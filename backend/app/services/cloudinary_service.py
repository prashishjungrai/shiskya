import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.config import get_settings

settings = get_settings()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


async def upload_image(file: UploadFile, folder: str = "tutionweb") -> dict:
    """
    Upload an image to Cloudinary.
    Returns dict with 'url' and 'public_id'.
    """
    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        folder=folder,
        resource_type="image",
        transformation=[
            {"quality": "auto", "fetch_format": "auto"}
        ],
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary by its public_id."""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False


def generate_upload_signature(folder: str = "tutionweb") -> dict:
    """
    Generate signed params for direct frontend-to-Cloudinary upload.
    """
    import time
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": folder,
    }
    signature = cloudinary.utils.api_sign_request(
        params, settings.CLOUDINARY_API_SECRET
    )
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "api_key": settings.CLOUDINARY_API_KEY,
        "folder": folder,
    }
