import bleach
from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import List
from beanie import PydanticObjectId

from app.models.contact import ContactSubmission
from app.models.admin import Admin
from app.schemas.contact import ContactCreate, ContactResponse
from app.deps import get_current_admin
from app.limiter import limiter

# ─── Public Routes ───
public_router = APIRouter()

@public_router.post("", response_model=ContactResponse, status_code=201)
@limiter.limit("3/minute")
async def submit_contact(request: Request, data: ContactCreate):
    data.name = bleach.clean(data.name)
    data.email = bleach.clean(data.email)
    if data.phone:
        data.phone = bleach.clean(data.phone)
    data.message = bleach.clean(data.message)

    contact = ContactSubmission(**data.model_dump())
    await contact.insert()
    return contact

# ─── Admin Routes ───
admin_router = APIRouter()

@admin_router.get("", response_model=List[ContactResponse])
async def admin_list_contacts(admin: Admin = Depends(get_current_admin)):
    return await ContactSubmission.find_all().sort(+ContactSubmission.is_read, -ContactSubmission.created_at).to_list()

@admin_router.put("/{contact_id}/read")
async def mark_as_read(contact_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    contact = await ContactSubmission.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact.is_read = True
    await contact.save()
    return {"message": "Marked as read"}

@admin_router.delete("/{contact_id}")
async def delete_contact(contact_id: PydanticObjectId, admin: Admin = Depends(get_current_admin)):
    contact = await ContactSubmission.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    await contact.delete()
    return {"message": "Contact deleted"}
