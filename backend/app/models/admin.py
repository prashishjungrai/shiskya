from datetime import datetime, timezone
from pydantic import Field
from beanie import Document

class Admin(Document):
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "admins"
        indexes = ["username"]
