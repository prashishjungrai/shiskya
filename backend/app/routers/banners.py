from fastapi import APIRouter, Depends, HTTPException
from typing import List
from beanie import PydanticObjectId

from app.models.banner import Banner
from app.models.admin import Admin
from app.schemas.banner import BannerCreate, BannerUpdate, BannerResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=List[BannerResponse])
@cache_response(ttl_seconds=3600, key_prefix="banners:list")
async def list_banners():
    return await Banner.find(Banner.is_active == True).sort(+Banner.display_order).to_list()

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[BannerResponse])
async def admin_list_banners(admin: Admin = Depends(get_current_admin)):
    return await Banner.find_all().sort(+Banner.display_order).to_list()

@admin_router.post("", response_model=BannerResponse, status_code=201)
async def create_banner(data: BannerCreate, admin: Admin = Depends(get_current_admin)):
    banner = Banner(**data.model_dump())
    await banner.insert()
    await invalidate_cache("banners:*")
    return banner

@admin_router.put("/{banner_id}", response_model=BannerResponse)
async def update_banner(banner_id: PydanticObjectId, data: BannerUpdate, admin: Admin = Depends(get_current_admin)):
    banner = await Banner.get(banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
        
    await banner.save()
    await invalidate_cache("banners:*")
    return banner

@admin_router.delete("/{banner_id}")
async def delete_banner(banner_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    banner = await Banner.get(banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    await banner.delete()
    await invalidate_cache("banners:*")
    return {"message": "Banner deleted"}
