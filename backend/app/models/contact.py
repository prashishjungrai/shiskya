from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field
from beanie import Document

class ContactExtraField(BaseModel):
    field_id: str
    label: str
    value: str


class ContactSubmission(Document):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    message: str
    extra_fields: List[ContactExtraField] = Field(default_factory=list)
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "contact_submissions"
