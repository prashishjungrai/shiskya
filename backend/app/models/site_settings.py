from datetime import datetime, timezone
from typing import Optional, Dict, Any
from pydantic import Field
from beanie import Document

class SiteSettings(Document):
    site_name: str = "Tuition Institute"
    logo_url: Optional[str] = None
    primary_colors: Dict[str, Any] = {
        "primary": "#1e40af",
        "secondary": "#f59e0b",
        "accent": "#10b981",
        "background": "#ffffff",
        "text": "#1f2937"
    }
    font_family: str = "Inter"
    hero_section: Dict[str, Any] = {
        "title": "Excel in Your Board Exams",
        "subtitle": "Expert coaching for +2 and Engineering students",
        "cta_text": "View Courses",
        "cta_link": "/courses",
        "background_image": ""
    }
    about_content: str = "Welcome to our institute."
    footer_content: Dict[str, Any] = {
        "description": "Leading coaching institute for +2 and Engineering students.",
        "copyright": "© 2026 Tuition Institute"
    }
    contact_info: Dict[str, Any] = {
        "address": "",
        "phone": [],
        "email": "",
        "map_embed": "",
        "hours": "Sun-Fri 6AM-6PM"
    }
    social_links: Dict[str, Any] = {
        "facebook": "",
        "instagram": "",
        "youtube": "",
        "tiktok": ""
    }
    meta_seo: Dict[str, Any] = {
        "title": "Tuition Institute - Expert Coaching",
        "description": "Best coaching for +2 and Engineering students",
        "keywords": "tuition, coaching, +2, engineering, board exams"
    }
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "site_settings"
