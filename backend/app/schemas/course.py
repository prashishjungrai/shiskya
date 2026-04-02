from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    syllabus: Optional[str] = None
    fee: Optional[float] = None
    duration: Optional[str] = None
    target_group: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    syllabus: Optional[str] = None
    fee: Optional[float] = None
    duration: Optional[str] = None
    target_group: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class CourseResponse(CourseBase):
    id: PydanticObjectId
    slug: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
