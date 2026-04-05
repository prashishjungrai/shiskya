from typing import List

from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.site_settings import (
    SITE_SETTINGS_SNAPSHOT_FIELDS,
    SiteSettings,
    SiteSettingsDraft,
    SiteSettingsRevision,
    apply_site_settings_payload,
    extract_site_settings_payload,
    site_settings_payloads_equal,
    utc_now,
)
from app.models.admin import Admin
from app.schemas.site_settings import (
    SiteSettingsEditorStateResponse,
    SiteSettingsRevisionResponse,
    SiteSettingsResponse,
    SiteSettingsUpdate,
)
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=SiteSettingsResponse)
@cache_response(ttl_seconds=86400, key_prefix="settings:public")
async def get_settings():
    return await _get_published_settings()

# ─── Admin Routes ───
admin_router = APIRouter()


async def _normalize_document(document):
    payload = extract_site_settings_payload(document)
    current_payload = {
        field: getattr(document, field, None)
        for field in SITE_SETTINGS_SNAPSHOT_FIELDS
    }

    if current_payload != payload:
        apply_site_settings_payload(document, payload)
        await document.save()

    return document


async def _get_published_settings() -> SiteSettings:
    settings = await SiteSettings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not configured")
    return await _normalize_document(settings)


async def _get_or_create_draft(settings: SiteSettings) -> SiteSettingsDraft:
    draft = await SiteSettingsDraft.find_one()
    if draft:
        return await _normalize_document(draft)

    draft = SiteSettingsDraft(
        **extract_site_settings_payload(settings),
        source_updated_at=settings.updated_at,
        updated_at=settings.updated_at,
    )
    await draft.insert()
    return draft


async def _build_editor_state() -> SiteSettingsEditorStateResponse:
    published = await _get_published_settings()
    draft = await _get_or_create_draft(published)
    revision_count = await SiteSettingsRevision.count()

    return SiteSettingsEditorStateResponse(
        draft=draft,
        published=published,
        has_unpublished_changes=not site_settings_payloads_equal(draft, published),
        revision_count=revision_count,
        last_published_at=published.updated_at,
    )


async def _load_revisions(limit: int = 6) -> List[SiteSettingsRevision]:
    return (
        await SiteSettingsRevision.find_all()
        .sort(-SiteSettingsRevision.published_at)
        .limit(limit)
        .to_list()
    )


async def _get_revision_or_404(revision_id: str) -> SiteSettingsRevision:
    try:
        revision = await SiteSettingsRevision.get(revision_id)
    except (InvalidId, TypeError, ValueError):
        revision = None

    if not revision:
        raise HTTPException(status_code=404, detail="Revision not found")
    return revision


async def _publish_payload(
    payload: dict,
    *,
    published: SiteSettings,
    draft: SiteSettingsDraft,
    admin: Admin,
    source_updated_at,
):
    published_at = utc_now()

    revision = SiteSettingsRevision(
        **payload,
        published_at=published_at,
        published_by=admin.username,
        source_updated_at=source_updated_at,
    )
    await revision.insert()

    apply_site_settings_payload(published, payload)
    published.updated_at = published_at
    await published.save()

    apply_site_settings_payload(draft, payload)
    draft.source_updated_at = published_at
    draft.updated_at = published_at
    await draft.save()

    await invalidate_cache("settings:*")

@admin_router.get("", response_model=SiteSettingsResponse)
async def admin_get_settings(admin: Admin = Depends(get_current_admin)):
    settings = await _get_published_settings()
    return await _get_or_create_draft(settings)


@admin_router.get("/editor-state", response_model=SiteSettingsEditorStateResponse)
async def admin_get_editor_state(admin: Admin = Depends(get_current_admin)):
    return await _build_editor_state()


@admin_router.get("/revisions", response_model=List[SiteSettingsRevisionResponse])
async def admin_get_revisions(
    limit: int = Query(default=6, ge=1, le=20),
    admin: Admin = Depends(get_current_admin),
):
    return await _load_revisions(limit)

@admin_router.put("", response_model=SiteSettingsResponse)
async def update_settings(data: SiteSettingsUpdate, admin: Admin = Depends(get_current_admin)):
    settings = await _get_published_settings()
    draft = await _get_or_create_draft(settings)

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(draft, key, value)

    draft.updated_at = utc_now()
    await draft.save()
    return draft


@admin_router.post("/publish", response_model=SiteSettingsEditorStateResponse)
async def publish_settings(admin: Admin = Depends(get_current_admin)):
    published = await _get_published_settings()
    draft = await _get_or_create_draft(published)

    payload = extract_site_settings_payload(draft)
    await _publish_payload(
        payload,
        published=published,
        draft=draft,
        admin=admin,
        source_updated_at=draft.updated_at,
    )
    return await _build_editor_state()


@admin_router.post("/discard", response_model=SiteSettingsEditorStateResponse)
async def discard_settings_draft(admin: Admin = Depends(get_current_admin)):
    published = await _get_published_settings()
    draft = await _get_or_create_draft(published)

    payload = extract_site_settings_payload(published)
    apply_site_settings_payload(draft, payload)
    draft.source_updated_at = published.updated_at
    draft.updated_at = published.updated_at
    await draft.save()

    return await _build_editor_state()


@admin_router.post("/revisions/{revision_id}/restore", response_model=SiteSettingsEditorStateResponse)
async def restore_revision(
    revision_id: str,
    publish: bool = Query(default=False),
    admin: Admin = Depends(get_current_admin),
):
    published = await _get_published_settings()
    draft = await _get_or_create_draft(published)
    revision = await _get_revision_or_404(revision_id)
    payload = extract_site_settings_payload(revision)

    if publish:
        if site_settings_payloads_equal(revision, published):
            apply_site_settings_payload(draft, payload)
            draft.source_updated_at = published.updated_at
            draft.updated_at = published.updated_at
            await draft.save()
            return await _build_editor_state()

        await _publish_payload(
            payload,
            published=published,
            draft=draft,
            admin=admin,
            source_updated_at=revision.published_at,
        )
        return await _build_editor_state()

    apply_site_settings_payload(draft, payload)
    draft.source_updated_at = revision.published_at
    draft.updated_at = utc_now()
    await draft.save()

    return await _build_editor_state()
