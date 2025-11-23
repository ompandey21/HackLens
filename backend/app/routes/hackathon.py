from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from datetime import datetime
from app.models.hackathon import Hackathon, HackathonCreate
from app.core.database import hackathon_collection, registrations_collection, submissions_collection
from app.routes.auth import RoleChecker, get_current_user
from app.models.user import UserRole, User
from bson import ObjectId
from fastapi import Path


router = APIRouter()

# {
#   "name": "HackLens ML Challenge",
#   "description": "A Machine Learning hackathon where models are auto-evaluated by the system.",
#   "hackathon_type": "ml_hackathon",
#   "start_date": "2025-11-10T09:00:00",
#   "end_date": "2025-11-12T18:00:00",
#   "is_active": true
# }

# Only admin can create hackathons
@router.post("/create", response_model=Hackathon)
async def create_hackathon(
    hackathon_data: HackathonCreate,
    current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
):
    new_hackathon = {
        "name": hackathon_data.name,
        "description": hackathon_data.description,
        "hackathon_type": hackathon_data.hackathon_type,
        "start_date": hackathon_data.start_date,
        "end_date": hackathon_data.end_date,
        "is_active": hackathon_data.is_active,
        "created_by": current_user.username,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await hackathon_collection.insert_one(new_hackathon)
    created = await hackathon_collection.find_one({"_id": result.inserted_id})
    return created

# Retrieve all active hackathons (for any user)
@router.get("/active", response_model=list[Hackathon])
async def get_active_hackathons():
    """
    Fetch all hackathons that are currently active.
    """
    try:
        hackathons = await hackathon_collection.find({"is_active": True}).to_list(None)
        return hackathons
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Get hackathons by type (filter)
@router.get("/type/{hackathon_type}", response_model=list[Hackathon])
async def get_hackathons_by_type(hackathon_type: str):
    valid_types = ["ml_hackathon", "codeathon", "hackathon"]
    if hackathon_type not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid hackathon type")

    hackathons = await hackathon_collection.find({
        "hackathon_type": hackathon_type,
        "is_active": True
    }).to_list(None)
    return hackathons


# Delete a hackathon (admin only)
@router.delete("/delete/{hackathon_id}")
async def delete_hackathon(
    hackathon_id: str = Path(..., description="ID of the hackathon to delete"),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
):
    # Validate ObjectId
    if not ObjectId.is_valid(hackathon_id):
        raise HTTPException(status_code=400, detail="Invalid hackathon ID")

    result = await hackathon_collection.delete_one({"_id": ObjectId(hackathon_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    return {"message": "Hackathon deleted successfully"}


@router.get("/{hackathon_id}", response_model=Hackathon)
async def get_hackathon_by_id(hackathon_id: str = Path(..., description="Hackathon ID")):
    """
    Get details of a single hackathon by ID.
    """
    if not ObjectId.is_valid(hackathon_id):
        raise HTTPException(status_code=400, detail="Invalid hackathon ID")

    hackathon = await hackathon_collection.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    return hackathon

@router.post("/register/{hackathon_id}")
async def register_for_hackathon(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    # Only participants can register
    if current_user.role != UserRole.PARTICIPANT:
        raise HTTPException(status_code=403, detail="Only participants can register.")

    # Validate hackathon ID
    if not ObjectId.is_valid(hackathon_id):
        raise HTTPException(status_code=400, detail="Invalid hackathon ID")

    hackathon = await hackathon_collection.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Check if already registered
    existing = await registrations_collection.find_one({
        "hackathon_id": hackathon_id,
        "participant_username": current_user.username
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this hackathon")

    # Register participant
    registration = {
        "hackathon_id": hackathon_id,
        "participant_username": current_user.username,
        "registered_at": datetime.utcnow(),
    }

    await registrations_collection.insert_one(registration)
    return {"message": f"{current_user.username} successfully registered for {hackathon['name']}"}

@router.get("/is_registered/{hackathon_id}")
async def check_registration(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PARTICIPANT:
        return {"registered": False}

    existing = await registrations_collection.find_one({
        "hackathon_id": hackathon_id,
        "participant_username": current_user.username
    })

    return {"registered": bool(existing)}

# Submission

@router.post("/submit/{hackathon_id}")
async def submit_project(
    hackathon_id: str,
    current_user: User = Depends(get_current_user),
    model_file: UploadFile = File(None),
    code_file: UploadFile = File(None),
    github_url: str = Form(None)
):
    """Handles participant submissions. No evaluation at this stage."""
    if not ObjectId.is_valid(hackathon_id):
        raise HTTPException(status_code=400, detail="Invalid hackathon ID")

    hackathon = await hackathon_collection.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    hack_type = hackathon["hackathon_type"]

    # Save metadata only — no evaluation yet
    submission = {
        "hackathon_id": hackathon_id,
        "participant": current_user.username,
        "hackathon_type": hack_type,
        "submission_filename": model_file.filename if model_file else code_file.filename if code_file else None,
        "github_url": github_url,
        "submitted_at": datetime.utcnow(),
        "status": "submitted",
        "evaluation_result": None
    }

    await submissions_collection.insert_one(submission)

    return {"message": "✅ Submission successful! Your project will be evaluated soon."}
