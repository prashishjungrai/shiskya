from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId


class ContactExtraFieldPayload(BaseModel):
    field_id: str
    label: str
    value: str


class ContactCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: str
    extra_fields: List[ContactExtraFieldPayload] = Field(default_factory=list)


class ContactResponse(BaseModel):
    id: PydanticObjectId
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    message: str
    extra_fields: List[ContactExtraFieldPayload] = Field(default_factory=list)
    is_read: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
