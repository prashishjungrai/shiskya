from pydantic import BaseModel
from beanie import PydanticObjectId

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AdminResponse(BaseModel):
    id: PydanticObjectId
    username: str

    model_config = {"from_attributes": True}
