from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.admin import Admin
from app.deps import get_current_admin
from app.services.cloudinary_service import (
    upload_image,
    delete_image,
    generate_upload_signature,
)

router = APIRouter()


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """Upload an image to Cloudinary. Returns the CDN URL."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    # 10MB limit
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 10MB")

    # Reset file position after reading
    await file.seek(0)

    result = await upload_image(file)
    return result


@router.post("/signature")
def get_upload_signature(
    admin: Admin = Depends(get_current_admin),
):
    """Generate signed params for direct frontend-to-Cloudinary upload."""
    return generate_upload_signature()


@router.delete("/{public_id:path}")
def remove_image(
    public_id: str,
    admin: Admin = Depends(get_current_admin),
):
    """Delete an image from Cloudinary."""
    success = delete_image(public_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete image")
    return {"message": "Image deleted"}
