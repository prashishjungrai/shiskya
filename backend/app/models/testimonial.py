from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document

class Testimonial(Document):
    student_name: str
    course: Optional[str] = None
    content: str
    rating: int = 5
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "testimonials"
