from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from datetime import datetime
from app.models.hackathon import Hackathon, HackathonCreate
from app.core.database import hackathon_collection, registrations_collection ,submissions_collection, evaluations_collection

from app.routes.auth import RoleChecker, get_current_user
from app.models.user import UserRole, User
from bson import ObjectId
import os
from fastapi import Path
from app.routes.model_evaluator import run_model_evaluation, evaluate_model, predict_pitch, execute

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
    # ---- Authorization ----
    if current_user.role != UserRole.JUDGE:
        raise HTTPException(status_code=403, detail="Access denied")

    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid submission ID")

    submission = await submissions_collection.find_one({"_id": ObjectId(submission_id)})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    hack_type = submission["hackathon_type"]

    # ---- Step 1: Dummy metrics ----
    import random, asyncio
    await asyncio.sleep(0.3)

    if hack_type == "ml_hackathon":
        evaluate_model(submission.get("submission_filename"))

    elif hack_type == "codeathon":
        file = submission.get("submission_filename")
        

    else:
        metrics = {
            "docker_valid": bool(random.choice([True, False])),
            "deployment_ready": bool(random.choice([True, False])),
            "final_score": round(random.uniform(0.6, 0.95), 2)
        }

    # ---- Step 2: Load code (only codeathon) ----
    # ---------------------------------------------
    code_preview = "(No code found)"

    filename = submission.get("submission_filename")
    file_path = f"uploads/{filename}" if filename else None

    if file_path:
        try:
            # If file is text-based (py, cpp, java, txt, Dockerfile, ipynb)
            if any(file_path.endswith(ext) for ext in [".py", ".cpp", ".java", ".txt", "Dockerfile"]):
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    code_preview = f.read()[:1500]

            # If ML model (.onnx), try to find corresponding script
            elif file_path.endswith(".onnx"): 
                # Try to find a script with same prefix
                base = filename.split(".")[0] 
                for ext in [".py", ".ipynb"]: 
                    alt = f"uploads/{base}{ext}"
                    if os.path.exists(alt):
                        with open(alt, "r", encoding="utf-8", errors="ignore") as f:
                            code_preview = f.read()[:1500]
                            break

        except Exception as e:
            code_preview = f"(Error reading code: {str(e)})"


    # ---- Step 3: LLM explanation (Gemini) ----
    import os, google.generativeai as genai
    
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""
You are an evaluator for a hackathon platform.

Hackathon Type: {hack_type}
Metrics: {metrics}
Participant Username: {submission['participant']}
Submitted Code Snippet: {code_preview}

Write a clear human-friendly evaluation summary. Use this format:

1. Overall Summary (2–3 sentences)
2. Interpretation of Metrics
3. Strengths (bullets)
4. Weaknesses (bullets)
5. Suggestions (bullets)
"""

    try:
        ai_res = model.generate_content(prompt)
        explanation = ai_res.text
    except Exception as e:
        explanation = f"(Failed to generate explanation: {str(e)})"

    # ---- Step 4: SAVE IN DB ----
    await submissions_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {
            "status": "evaluated",
            "evaluation_result": metrics,
            "evaluation_result_text": explanation
        }}
    )

    return {"evaluated": True}

@router.get("/get_result/{submission_id}")
async def get_result(submission_id: str, current_user: User = Depends(get_current_user)):

    if not ObjectId.is_valid(submission_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    sub = await submissions_collection.find_one({"_id": ObjectId(submission_id)})
    if not sub:
        raise HTTPException(status_code=404, detail="Not found")

    return {
        "metrics": sub.get("evaluation_result"),
        "explanation": sub.get("evaluation_result_text"),
        "submission": sub
    }
