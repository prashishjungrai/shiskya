from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from beanie import PydanticObjectId


class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_colors: Optional[Dict[str, Any]] = None
    font_family: Optional[str] = None
    ui_customization: Optional[Dict[str, Any]] = None
    hero_section: Optional[Dict[str, Any]] = None
    about_content: Optional[str] = None
    home_page: Optional[Dict[str, Any]] = None
    about_page: Optional[Dict[str, Any]] = None
    teachers_page: Optional[Dict[str, Any]] = None
    footer_content: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None
    contact_page: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    meta_seo: Optional[Dict[str, Any]] = None


class SiteSettingsResponse(BaseModel):
    id: PydanticObjectId
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_colors: Optional[Dict[str, Any]] = None
    font_family: Optional[str] = None
    ui_customization: Optional[Dict[str, Any]] = None
    hero_section: Optional[Dict[str, Any]] = None
    about_content: Optional[str] = None
    home_page: Optional[Dict[str, Any]] = None
    about_page: Optional[Dict[str, Any]] = None
    teachers_page: Optional[Dict[str, Any]] = None
    footer_content: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None
    contact_page: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    meta_seo: Optional[Dict[str, Any]] = None
    source_updated_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class SiteSettingsRevisionResponse(BaseModel):
    id: PydanticObjectId
    site_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_colors: Optional[Dict[str, Any]] = None
    font_family: Optional[str] = None
    ui_customization: Optional[Dict[str, Any]] = None
    hero_section: Optional[Dict[str, Any]] = None
    about_content: Optional[str] = None
    home_page: Optional[Dict[str, Any]] = None
    about_page: Optional[Dict[str, Any]] = None
    teachers_page: Optional[Dict[str, Any]] = None
    footer_content: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None
    contact_page: Optional[Dict[str, Any]] = None
    social_links: Optional[Dict[str, Any]] = None
    meta_seo: Optional[Dict[str, Any]] = None
    published_at: Optional[datetime] = None
    published_by: Optional[str] = None
    source_updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class SiteSettingsEditorStateResponse(BaseModel):
    draft: SiteSettingsResponse
    published: SiteSettingsResponse
    has_unpublished_changes: bool
    revision_count: int = 0
    last_published_at: Optional[datetime] = None
