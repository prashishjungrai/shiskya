from fastapi import APIRouter, Depends, HTTPException

from app.models.site_settings import SiteSettings
from app.models.admin import Admin
from app.schemas.site_settings import SiteSettingsUpdate, SiteSettingsResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=SiteSettingsResponse)
@cache_response(ttl_seconds=86400, key_prefix="settings:public")
async def get_settings():
    settings = await SiteSettings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not configured")
    return settings

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=SiteSettingsResponse)
async def admin_get_settings(admin: Admin = Depends(get_current_admin)):
    settings = await SiteSettings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not configured")
    return settings

@admin_router.put("", response_model=SiteSettingsResponse)
async def update_settings(data: SiteSettingsUpdate, admin: Admin = Depends(get_current_admin)):
    settings = await SiteSettings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Site settings not configured. Run seed first.")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(settings, key, value)

    await settings.save()
    await invalidate_cache("settings:*")
    return settings
