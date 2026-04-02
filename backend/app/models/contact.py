from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document

class ContactSubmission(Document):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "contact_submissions"
