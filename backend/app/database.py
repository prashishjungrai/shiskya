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
    from app.models.site_settings import (
        SITE_SETTINGS_SNAPSHOT_FIELDS,
        SiteSettings,
        SiteSettingsDraft,
        SiteSettingsRevision,
        apply_site_settings_payload,
        extract_site_settings_payload,
    )
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
            SiteSettingsDraft,
            SiteSettingsRevision,
            Testimonial,
            Notice,
            ContactSubmission,
        ],
    )

    # ─── Seed Initial Data ───
    try:
        # 1. Ensure at least one Admin exists
        admin_count = await Admin.count()
        if admin_count == 0:
            logger.info("👨‍💼 No admin found. Creating default 'admin' user...")
            from app.services.auth_service import hash_password
            default_admin = Admin(
                username="admin",
                hashed_password=hash_password("admin123"),
            )
            await default_admin.insert()
            logger.info("✅ Default admin created: user='admin', pass='admin123'")

        # 2. Ensure SiteSettings exists
        settings_count = await SiteSettings.count()
        if settings_count == 0:
            logger.info("⚙️ No site settings found. Initializing Elite Academy defaults...")
            default_settings = SiteSettings() # Will use all the defaults we defined in the model
            await default_settings.insert()
            logger.info("✅ Elite Academy settings initialized.")
        else:
            # Optional: Ensure all expected fields are present (e.g. ui_customization)
            # This handles cases where an old doc exists but is missing new fields
            existing_settings = await SiteSettings.find_one()
            if existing_settings:
                normalized_payload = extract_site_settings_payload(existing_settings)
                current_payload = {
                    field: getattr(existing_settings, field, None)
                    for field in SITE_SETTINGS_SNAPSHOT_FIELDS
                }
                if current_payload != normalized_payload:
                    logger.info("🔄 Normalizing site settings to the latest schema...")
                    apply_site_settings_payload(existing_settings, normalized_payload)
                    await existing_settings.save()
                    logger.info("✅ Site settings normalization complete.")

            if existing_settings and (not existing_settings.ui_customization or "fonts" not in existing_settings.ui_customization or existing_settings.primary_colors.get("secondary") == "#d4af37"):
                logger.info("🔄 Migrating legacy settings to Institutional Navy structure...")
                # Merge logic if needed, or just reset to defaults for this specific migration
                default_v = SiteSettings()
                existing_settings.ui_customization = default_v.ui_customization
                existing_settings.primary_colors = default_v.primary_colors
                existing_settings.site_name = "Tuition Institute"
                await existing_settings.save()
                logger.info("✅ Navy Theme migration complete.")

        # 3. Ensure a draft workspace exists for admin editing
        published_settings = await SiteSettings.find_one()
        draft_settings = await SiteSettingsDraft.find_one()
        if published_settings and not draft_settings:
            logger.info("📝 No site settings draft found. Creating draft workspace...")
            draft_settings = SiteSettingsDraft(
                **extract_site_settings_payload(published_settings),
                source_updated_at=published_settings.updated_at,
                updated_at=published_settings.updated_at,
            )
            await draft_settings.insert()
            logger.info("✅ Draft workspace created.")
        elif draft_settings:
            normalized_draft_payload = extract_site_settings_payload(draft_settings)
            current_draft_payload = {
                field: getattr(draft_settings, field, None)
                for field in SITE_SETTINGS_SNAPSHOT_FIELDS
            }
            if current_draft_payload != normalized_draft_payload:
                logger.info("🔄 Normalizing settings draft to the latest schema...")
                apply_site_settings_payload(draft_settings, normalized_draft_payload)
                await draft_settings.save()
                logger.info("✅ Settings draft normalization complete.")

    except Exception as e:
        logger.error(f"❌ Failed to seed initial data: {e}")
    
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
