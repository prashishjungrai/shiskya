from fastapi import APIRouter
from app.services.reddit_service import fetch_engineering_trends

router = APIRouter()

@router.get("/engineering-trends")
async def get_engineering_trends():
    """
    Returns the top hot posts from /r/EngineeringStudents.
    Handles caching and rate limiting internally.
    """
    data = await fetch_engineering_trends()
    return {"status": "success", "data": data}
