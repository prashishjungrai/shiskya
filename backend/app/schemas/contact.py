from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class ContactCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: str


class ContactResponse(BaseModel):
    id: PydanticObjectId
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
