from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from app.models.admin import Admin
from app.schemas.admin import LoginRequest, AdminResponse
from app.services.auth_service import verify_password, create_access_token
from app.deps import get_current_admin
from app.limiter import limiter

router = APIRouter()

@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest, response: Response):
    admin = await Admin.find_one(Admin.username == body.username)
    if not admin or not verify_password(body.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token(data={"sub": str(admin.id)})
    
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,  # Blocks JS access
        samesite="lax", # Necessary if backend and frontend are strictly different origins
        secure=False,   # Set True in production (HTTPS)
        max_age=86400,
    )
    
    return {"message": "Login successful"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("admin_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=AdminResponse)
async def get_me(admin: Admin = Depends(get_current_admin)):
    return admin
