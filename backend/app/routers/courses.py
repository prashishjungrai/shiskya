import re
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie import PydanticObjectId

from app.models.course import Course
from app.models.admin import Admin
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

def generate_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[-\s]+", "-", slug)
    return slug

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=List[CourseResponse])
@cache_response(ttl_seconds=3600, key_prefix="courses:list")
async def list_courses():
    courses = await Course.find(Course.is_active == True).sort(+Course.display_order, -Course.created_at).to_list()
    return courses

@public_router.get("/{slug}", response_model=CourseResponse)
@cache_response(ttl_seconds=3600, key_prefix="courses:detail")
async def get_course(slug: str):
    course = await Course.find_one(Course.slug == slug, Course.is_active == True)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[CourseResponse])
async def admin_list_courses(admin: Admin = Depends(get_current_admin)):
    return await Course.find_all().sort(+Course.display_order).to_list()

@admin_router.post("", response_model=CourseResponse, status_code=201)
async def create_course(data: CourseCreate, admin: Admin = Depends(get_current_admin)):
    slug = generate_slug(data.title)
    existing = await Course.find_one(Course.slug == slug)
    if existing:
        slug = f"{slug}-1"
    course = Course(**data.model_dump(), slug=slug)
    await course.insert()
    await invalidate_cache("courses:*")
    return course

@admin_router.put("/{course_id}", response_model=CourseResponse)
async def update_course(course_id: PydanticObjectId, data: CourseUpdate, admin: Admin = Depends(get_current_admin)):
    course = await Course.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_data = data.model_dump(exclude_unset=True)
    if "title" in update_data:
        update_data["slug"] = generate_slug(update_data["title"])
    
    for key, value in update_data.items():
        setattr(course, key, value)
    
    await course.save()
    await invalidate_cache("courses:*")
    return course

@admin_router.delete("/{course_id}")
async def delete_course(course_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    course = await Course.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    await course.delete()
    await invalidate_cache("courses:*")
    return {"message": "Course deleted"}
