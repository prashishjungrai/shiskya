import json
import logging
from functools import wraps
from typing import Callable, Any

from app import database

logger = logging.getLogger(__name__)

def cache_response(ttl_seconds: int = 3600, key_prefix: str = "cache"):
    """
    Decorator to cache the JSON response of an async FastAPI route.
    Usage: @cache_response(ttl_seconds=3600, key_prefix="courses")
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Form unique key based on prefix and function name
            # Note: For parameterized routes (like ID or slug), we should include kwargs
            # if we wanted precise caching, but since most public endpoints here are lists/singletons,
            # we'll build a simple dynamic key based on arguments.
            
            # Simple key builder: key_prefix:func_name:arg1:arg2
            # Filter out FastAPI dependency injections like Request/BackgroundTasks if they were present
            cache_key = f"{key_prefix}:{func.__name__}"
            if kwargs:
                # Append stringified kwargs
                cache_key += ":" + ":".join([f"{k}={v}" for k, v in kwargs.items()])

            if database.redis_client:
                try:
                    cached = await database.redis_client.get(cache_key)
                    if cached:
                        # logger.info(f"Cache HIT for {cache_key}")
                        return json.loads(cached)
                except Exception as e:
                    logger.error(f"Redis get error on {cache_key}: {e}")

            # logger.info(f"Cache MISS for {cache_key}, computing...")
            
            # Compute data
            result = await func(*args, **kwargs)
            
            # If Redis available, store it
            if database.redis_client:
                try:
                    # Depending on if result is a Pydantic model or list of models
                    if isinstance(result, list):
                        serialized = json.dumps([item.model_dump(mode="json") if hasattr(item, "model_dump") else item for item in result])
                    elif hasattr(result, "model_dump"):
                        serialized = json.dumps(result.model_dump(mode="json"))
                    else:
                        serialized = json.dumps(result)
                        
                    await database.redis_client.setex(cache_key, ttl_seconds, serialized)
                except Exception as e:
                    logger.error(f"Redis set error on {cache_key}: {e}")

            return result
        return wrapper
    return decorator

async def invalidate_cache(key_pattern: str):
    """
    Deletes all keys matching a pattern.
    Usage: await invalidate_cache("courses:*")
    """
    if database.redis_client:
        try:
            # We use keys() since this is a relatively small dataset, but SCAN is better for huge DBs.
            keys = await database.redis_client.keys(key_pattern)
            if keys:
                await database.redis_client.delete(*keys)
        except Exception as e:
            logger.error(f"Redis invalidation error on pattern {key_pattern}: {e}")
