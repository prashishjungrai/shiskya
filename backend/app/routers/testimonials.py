from fastapi import APIRouter, Depends, HTTPException
from typing import List
from beanie import PydanticObjectId

from app.models.testimonial import Testimonial
from app.models.admin import Admin
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=List[TestimonialResponse])
@cache_response(ttl_seconds=3600, key_prefix="testimonials:list")
async def list_testimonials():
    return await Testimonial.find(Testimonial.is_active == True).sort(-Testimonial.created_at).to_list()

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[TestimonialResponse])
async def admin_list_testimonials(admin: Admin = Depends(get_current_admin)):
    return await Testimonial.find_all().sort(-Testimonial.created_at).to_list()

@admin_router.post("", response_model=TestimonialResponse, status_code=201)
async def create_testimonial(data: TestimonialCreate, admin: Admin = Depends(get_current_admin)):
    testimonial = Testimonial(**data.model_dump())
    await testimonial.insert()
    await invalidate_cache("testimonials:*")
    return testimonial

@admin_router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(testimonial_id: PydanticObjectId, data: TestimonialUpdate, admin: Admin = Depends(get_current_admin)):
    testimonial = await Testimonial.get(testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(testimonial, key, value)
        
    await testimonial.save()
    await invalidate_cache("testimonials:*")
    return testimonial

@admin_router.delete("/{testimonial_id}")
async def delete_testimonial(testimonial_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    testimonial = await Testimonial.get(testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await testimonial.delete()
    await invalidate_cache("testimonials:*")
    return {"message": "Testimonial deleted"}
