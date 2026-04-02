from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter

from app.config import get_settings
from app.database import init_db, close_db
from app.routers import (
    auth,
    courses,
    teachers,
    banners,
    settings as settings_router,
    testimonials,
    notices,
    contacts,
    upload,
    reddit,
)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(
    title="Tuition Institute API",
    description="Backend API for Tuition Website",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

app.include_router(courses.public_router, prefix="/api/public/courses", tags=["Public Courses"])
app.include_router(courses.admin_router, prefix="/api/admin/courses", tags=["Admin Courses"])

app.include_router(teachers.public_router, prefix="/api/public/teachers", tags=["Public Teachers"])
app.include_router(teachers.admin_router, prefix="/api/admin/teachers", tags=["Admin Teachers"])

app.include_router(banners.public_router, prefix="/api/public/banners", tags=["Public Banners"])
app.include_router(banners.admin_router, prefix="/api/admin/banners", tags=["Admin Banners"])

app.include_router(settings_router.public_router, prefix="/api/public/settings", tags=["Public Settings"])
app.include_router(settings_router.admin_router, prefix="/api/admin/settings", tags=["Admin Settings"])

app.include_router(testimonials.public_router, prefix="/api/public/testimonials", tags=["Public Testimonials"])
app.include_router(testimonials.admin_router, prefix="/api/admin/testimonials", tags=["Admin Testimonials"])

app.include_router(notices.public_router, prefix="/api/public/notices", tags=["Public Notices"])
app.include_router(notices.admin_router, prefix="/api/admin/notices", tags=["Admin Notices"])

app.include_router(contacts.public_router, prefix="/api/public/contacts", tags=["Public Contacts"])
app.include_router(contacts.admin_router, prefix="/api/admin/contacts", tags=["Admin Contacts"])

app.include_router(reddit.router, prefix="/api/public/reddit", tags=["Public Reddit"])

@app.get("/")
def read_root():
    return {"message": "Tuition Institute API running on FastAPI + MongoDB"}
