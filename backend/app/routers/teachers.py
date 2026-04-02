from fastapi import APIRouter, Depends, HTTPException
from typing import List
from beanie import PydanticObjectId

from app.models.teacher import Teacher
from app.models.admin import Admin
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from app.deps import get_current_admin
from app.services.cache_service import cache_response, invalidate_cache

# ─── Public Routes ───
public_router = APIRouter()

@public_router.get("", response_model=List[TeacherResponse])
@cache_response(ttl_seconds=3600, key_prefix="teachers:list")
async def list_teachers():
    return await Teacher.find(Teacher.is_active == True).sort(+Teacher.display_order).to_list()

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[TeacherResponse])
async def admin_list_teachers(admin: Admin = Depends(get_current_admin)):
    return await Teacher.find_all().sort(+Teacher.display_order).to_list()

@admin_router.post("", response_model=TeacherResponse, status_code=201)
async def create_teacher(data: TeacherCreate, admin: Admin = Depends(get_current_admin)):
    teacher = Teacher(**data.model_dump())
    await teacher.insert()
    await invalidate_cache("teachers:*")
    return teacher

@admin_router.put("/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(teacher_id: PydanticObjectId, data: TeacherUpdate, admin: Admin = Depends(get_current_admin)):
    teacher = await Teacher.get(teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(teacher, key, value)
        
    await teacher.save()
    await invalidate_cache("teachers:*")
    return teacher

@admin_router.delete("/{teacher_id}")
async def delete_teacher(teacher_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    teacher = await Teacher.get(teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    await teacher.delete()
    await invalidate_cache("teachers:*")
    return {"message": "Teacher deleted"}
