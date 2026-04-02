from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId


class BannerBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class BannerResponse(BannerBase):
    id: PydanticObjectId
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
