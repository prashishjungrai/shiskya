from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document

class Course(Document):
    title: str
    slug: str
    description: Optional[str] = None
    syllabus: Optional[str] = None
    fee: Optional[float] = None
    duration: Optional[str] = None
    target_group: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    display_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

    class Settings:
        name = "courses"
        indexes = ["slug"]
