from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
import os
from app.routes.auth import get_current_user
from app.models.user import User, UserRole
from app.core.database import hackathon_collection, submissions_collection, registrations_collection

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/submissions")
async def get_user_submissions(current_user: User = Depends(get_current_user)):
    """
    Fetch all submissions made by the logged-in participant.
    """
    try:
        subs = await submissions_collection.find(
            {"participant": current_user.username}
        ).to_list(None)
        return subs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/hackathons")
async def get_participant_hackathons(current_user: User = Depends(get_current_user)):
    """
    Return all hackathons the participant has registered for,
    and attach submission details if available.
    """
    try:
        # Step 1: Find registrations for the user
        regs = await registrations_collection.find(
            {"participant_username": current_user.username}
        ).to_list(None)

        if not regs:
            return []

        # Step 2: Gather hackathon IDs safely
        hackathon_ids = []
        for r in regs:
            try:
                hackathon_ids.append(ObjectId(r["hackathon_id"]))
            except InvalidId:
                print(f"⚠️ Invalid hackathon_id in registration: {r['hackathon_id']}")

        # Step 3: Fetch hackathon details
        hacks = await hackathon_collection.find(
            {"_id": {"$in": hackathon_ids}}
        ).to_list(None)

        # Step 4: Attach submissions if present
        for hack in hacks:
            hack_id_str = str(hack["_id"])
            sub = await submissions_collection.find_one({
                "hackathon_id": hack_id_str,
                "participant": current_user.username
            })
            if sub:
                sub["_id"] = str(sub["_id"])
                sub["hackathon_id"] = str(sub["hackathon_id"])
                hack["submission"] = sub

        # Step 5: Convert all ObjectIds to strings
        for hack in hacks:
            hack["_id"] = str(hack["_id"])

        return hacks

    except Exception as e:
        print("❌ Error in /participant/hackathons:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/submit/{hackathon_id}")
async def submit_project(
    hackathon_id: str,
    hackathon_type: str = Form(...),
    github_url: str = Form(None),
    model_file: UploadFile = File(None),
    code_file: UploadFile = File(None),
    dockerfile: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    """Handles dynamic hackathon submissions based on type."""

    if current_user.role != UserRole.PARTICIPANT:
        raise HTTPException(status_code=403, detail="Only participants can submit.")

    if not ObjectId.is_valid(hackathon_id):
        raise HTTPException(status_code=400, detail="Invalid hackathon ID")

    hackathon = await hackathon_collection.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Avoid duplicate submissions
    existing = await submissions_collection.find_one({
        "hackathon_id": hackathon_id,
        "participant": current_user.username
    })
    if existing:
        raise HTTPException(status_code=400, detail="You already submitted for this hackathon")

    filename = None

    # Handle file saving
    if model_file:
        filename = f"{current_user.username}_{model_file.filename}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await model_file.read())
    elif code_file:
        filename = f"{current_user.username}_{code_file.filename}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await code_file.read())
    elif dockerfile:
        filename = f"{current_user.username}_Dockerfile"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await dockerfile.read())

    submission = {
        "hackathon_id": hackathon_id,
        "participant": current_user.username,
        "hackathon_type": hackathon_type,
        "submission_filename": filename,
        "github_url": github_url,
        "submitted_at": datetime.utcnow(),
        "status": "submitted",
        "evaluation_result": None,
        "judge_assigned": None
    }

    await submissions_collection.insert_one(submission)

    return {"message": "✅ Submission successful", "filename": filename}

@router.get("/submission_status/{hackathon_id}")
async def get_submission_status(
    hackathon_id: str,
    current_user: User = Depends(get_current_user)
):
    """Return the participant’s submission info if it exists."""
    if current_user.role != UserRole.PARTICIPANT:
        raise HTTPException(status_code=403, detail="Only participants can view this data.")

    submission = await submissions_collection.find_one({
        "hackathon_id": hackathon_id,
        "participant": current_user.username
    })

    if not submission:
        return {"submitted": False}

    submission["_id"] = str(submission["_id"])
    submission["hackathon_id"] = str(submission["hackathon_id"])
    return {"submitted": True, "submission": submission}