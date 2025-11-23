from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from datetime import datetime
from app.models.hackathon import Hackathon, HackathonCreate
from app.core.database import hackathon_collection, registrations_collection ,submissions_collection, evaluations_collection

from app.routes.auth import RoleChecker, get_current_user
from app.models.user import UserRole, User
from bson import ObjectId
import os
from fastapi import Path
from app.routes.model_evaluator import run_model_evaluation

import numpy as np


router = APIRouter()

@router.post("/assign_judge/{submission_id}")
async def assign_judge(submission_id: str, judge_username: str):
    result = await submissions_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"assigned_judge": judge_username}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": f"Judge {judge_username} assigned successfully."}

@router.get("/assigned")
async def get_assigned_hackathons(
    current_user: User = Depends(RoleChecker([UserRole.JUDGE]))
):
    """Fetch all hackathons or submissions assigned to this judge."""
    try:
        assigned = await submissions_collection.find(
            {"assigned_judge": current_user.username}
        ).to_list(None)

        if not assigned:
            return []

        # Convert ObjectIds -> strings
        for sub in assigned:
            if "_id" in sub:
                sub["_id"] = str(sub["_id"])
            if "hackathon_id" in sub and not isinstance(sub["hackathon_id"], str):
                sub["hackathon_id"] = str(sub["hackathon_id"])

        return assigned

    except Exception as e:
        print("❌ Error fetching assigned submissions:", e)
        raise HTTPException(status_code=500, detail=str(e))

import traceback

@router.get("/submissions")
async def get_all_submissions(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    subs = await submissions_collection.find().to_list(None)
    return subs


from app.routes.model_evaluator import run_model_evaluation

@router.post("/evaluate/{submission_id}")
async def evaluate_submission(submission_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.JUDGE:
        raise HTTPException(status_code=403, detail="Access denied")

    submission = await submissions_collection.find_one({"_id": ObjectId(submission_id)})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    hack_type = submission["hackathon_type"]
    eval_result = {}

    # Dummy evaluation depending on hackathon type
    import random, asyncio
    await asyncio.sleep(0.3)  # simulate compute time

    if hack_type == "ml_hackathon":
        eval_result = {
            "accuracy": round(random.uniform(0.7, 0.99), 3),
            "precision": round(random.uniform(0.6, 0.98), 3),
            "recall": round(random.uniform(0.65, 0.97), 3),
            "f1_score": round(random.uniform(0.6, 0.95), 3),
            "final_combined_score": round(random.uniform(0.7, 0.95), 3)
        }

    elif hack_type == "codeathon":
        eval_result = {
            "test_cases_passed": random.randint(6, 10),
            "performance": round(random.uniform(0.7, 1.0), 2),
            "final_score": round(random.uniform(0.7, 1.0), 2)
        }

    elif hack_type == "hackathon":
        eval_result = {
            "docker_valid": bool(random.choice([True, False])),
            "deployment_ready": bool(random.choice([True, False])),
            "final_score": round(random.uniform(0.6, 0.95), 2)
        }

    # Update submission record
    await submissions_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"status": "evaluated", "evaluation_result": eval_result}}
    )

    return {"message": "✅ Evaluation completed successfully", "result": eval_result}
