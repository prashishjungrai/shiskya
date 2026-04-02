from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document

class Teacher(Document):
    name: str
    subject: Optional[str] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "teachers"
