import asyncio
from app.database import init_db
from app.models.admin import Admin
from app.models.site_settings import SiteSettings
from app.services.auth_service import hash_password

async def seed():
    print("Initializing Database...")
    await init_db()

    print("Checking Admin user...")
    admin = await Admin.find_one(Admin.username == "admin")
    if not admin:
        new_admin = Admin(
            username="admin",
            hashed_password=hash_password("admin123")
        )
        await new_admin.insert()
        print("Created default admin (admin / admin123)")
    else:
        print("Admin user already exists.")

    print("Checking Site Settings...")
    settings = await SiteSettings.find_one()
    if not settings:
        new_settings = SiteSettings()
        await new_settings.insert()
        print("Created default site settings.")
    else:
        print("Site settings already exist.")

    print("Seed complete.")

if __name__ == "__main__":
    asyncio.run(seed())
