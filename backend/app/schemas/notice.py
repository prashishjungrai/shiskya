from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class NoticeBase(BaseModel):
    title: str
    content: Optional[str] = None
    is_pinned: bool = False
    is_active: bool = True


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_active: Optional[bool] = None


class NoticeResponse(NoticeBase):
    id: PydanticObjectId
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
