import logging
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from pymongo.errors import ConnectionFailure

from app.config import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

db_client = None
redis_client = None

async def init_db():
    global db_client
    global redis_client
    
    # ─── Initialize MongoDB ───
    try:
        db_client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Verify connection
        await db_client.admin.command('ping')
        logger.info("✅ MongoDB Connected Successfully")
    except ConnectionFailure as e:
        logger.error(f"❌ MongoDB Unable to Connect: {e}")
        raise
    except Exception as e:
        logger.error(f"❌ Error connecting to MongoDB: {e}")
        raise
    
    # Import all models
    from app.models.admin import Admin
    from app.models.course import Course
    from app.models.teacher import Teacher
    from app.models.banner import Banner
    from app.models.site_settings import SiteSettings
    from app.models.testimonial import Testimonial
    from app.models.notice import Notice
    from app.models.contact import ContactSubmission

    await init_beanie(
        database=db_client.get_database("tutionweb"),
        document_models=[
            Admin,
            Course,
            Teacher,
            Banner,
            SiteSettings,
            Testimonial,
            Notice,
            ContactSubmission,
        ],
    )
    
    # ─── Initialize Redis ───
    if settings.REDIS_URL:
        try:
            redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            await redis_client.ping()
            logger.info("✅ Redis Connected Successfully")
        except redis.ConnectionError as e:
            logger.error(f"❌ Redis Unable to Connect at {settings.REDIS_URL}: {e}")
            # we might not want to crash the app if redis is down depending on requirements
        except Exception as e:
            logger.error(f"❌ Error connecting to Redis: {e}")

async def close_db():
    global db_client, redis_client
    if db_client:
        db_client.close()
        logger.info("🔌 MongoDB connection closed")
    if redis_client:
        await redis_client.close()
        logger.info("🔌 Redis connection closed")
