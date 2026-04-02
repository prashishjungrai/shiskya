from fastapi import Depends, HTTPException, status, Cookie
from beanie import PydanticObjectId

from app.models.admin import Admin
from app.services.auth_service import decode_access_token

async def get_current_admin(
    admin_token: str | None = Cookie(default=None)
) -> Admin:
    """Dependency that extracts and validates the JWT token from HttpOnly Cookie, returns the admin user."""
    
    if not admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication cookie",
        )
        
    token = admin_token
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    admin_id_str = payload.get("sub")
    if admin_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    try:
        admin_id = PydanticObjectId(admin_id_str)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    admin = await Admin.get(admin_id)
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
        )

    return admin
