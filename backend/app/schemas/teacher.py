from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class TeacherBase(BaseModel):
    name: str
    subject: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class TeacherResponse(TeacherBase):
    id: PydanticObjectId
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
