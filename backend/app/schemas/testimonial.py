from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class TestimonialBase(BaseModel):
    student_name: str
    course: Optional[str] = None
    content: str
    rating: int = 5
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    student_name: Optional[str] = None
    course: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    is_active: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    id: PydanticObjectId
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
