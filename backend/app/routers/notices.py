from fastapi import APIRouter, Depends, HTTPException
from typing import List
from beanie import PydanticObjectId

from app.models.notice import Notice
from app.models.admin import Admin
from app.schemas.notice import NoticeCreate, NoticeUpdate, NoticeResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=List[NoticeResponse])
@cache_response(ttl_seconds=3600, key_prefix="notices:list")
async def list_notices():
    return await Notice.find(Notice.is_active == True).sort(-Notice.is_pinned, -Notice.created_at).to_list()

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[NoticeResponse])
async def admin_list_notices(admin: Admin = Depends(get_current_admin)):
    return await Notice.find_all().sort(-Notice.is_pinned, -Notice.created_at).to_list()

@admin_router.post("", response_model=NoticeResponse, status_code=201)
async def create_notice(data: NoticeCreate, admin: Admin = Depends(get_current_admin)):
    notice = Notice(**data.model_dump())
    await notice.insert()
    await invalidate_cache("notices:*")
    return notice

@admin_router.put("/{notice_id}", response_model=NoticeResponse)
async def update_notice(notice_id: PydanticObjectId, data: NoticeUpdate, admin: Admin = Depends(get_current_admin)):
    notice = await Notice.get(notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(notice, key, value)
        
    await notice.save()
    await invalidate_cache("notices:*")
    return notice

@admin_router.delete("/{notice_id}")
async def delete_notice(notice_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    notice = await Notice.get(notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    await notice.delete()
    await invalidate_cache("notices:*")
    return {"message": "Notice deleted"}
