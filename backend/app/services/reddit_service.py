import httpx
import logging
import json
from app.database import redis_client

logger = logging.getLogger(__name__)

async def fetch_engineering_trends():
    """
    Fetches hot posts from /r/EngineeringStudents.
    Implements a stale-data fallback if Reddit API fails or hits rate limits.
    """
    cache_key = "reddit:engineering_trends"
    fallback_key = "reddit:engineering_trends_fallback"
    
    # 1. Check strict cache
    if redis_client:
        cached = await redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
            
    # 2. Fetch from Reddit
    url = "https://www.reddit.com/r/EngineeringStudents/hot.json?limit=5"
    headers = {"User-Agent": "TuitionWeb/1.0.0"}
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers, timeout=5.0)
            resp.raise_for_status()
            data = resp.json()
            
            # Format custom payload
            trends = []
            for post in data.get("data", {}).get("children", []):
                post_data = post.get("data", {})
                trends.append({
                    "title": post_data.get("title"),
                    "url": f"https://reddit.com{post_data.get('permalink')}",
                    "score": post_data.get("score"),
                    "num_comments": post_data.get("num_comments")
                })
                
            # 3. Store valid response in cache (TTL 30 mins) + permanent fallback
            if redis_client:
                serialized = json.dumps(trends)
                await redis_client.setex(cache_key, 1800, serialized)
                await redis_client.set(fallback_key, serialized)  # No expiration for fallback
                
            return trends
            
    except Exception as e:
        logger.error(f"Reddit API fetch failed: {e}")
        # 4. Fallback execution
        if redis_client:
            stale_data = await redis_client.get(fallback_key)
            if stale_data:
                logger.warning("Serving stale Reddit data from fallback cache.")
                return json.loads(stale_data)
                
        # 5. Worst case empty generic default
        return []
