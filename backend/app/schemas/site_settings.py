from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from beanie import PydanticObjectId


class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_colors: Optional[Dict[str, Any]] = None
    font_family: Optional[str] = None
    hero_section: Optional[Dict[str, Any]] = None
    about_content: Optional[str] = None
    footer_content: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    meta_seo: Optional[Dict[str, Any]] = None


class SiteSettingsResponse(BaseModel):
    id: PydanticObjectId
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_colors: Optional[Dict[str, Any]] = None
    font_family: Optional[str] = None
    hero_section: Optional[Dict[str, Any]] = None
    about_content: Optional[str] = None
    footer_content: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    meta_seo: Optional[Dict[str, Any]] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
