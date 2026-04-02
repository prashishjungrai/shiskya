from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document

class Notice(Document):
    title: str
    content: Optional[str] = None
    is_pinned: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "notices"
