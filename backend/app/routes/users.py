from fastapi import APIRouter, Depends
from app.models.user import User, UserRole
from .auth import get_current_user, RoleChecker

router = APIRouter()

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Fetch the current logged in user.
    """
    return current_user

@router.get("/participant-dashboard", response_model=dict)
async def get_participant_dashboard(
    current_user: User = Depends(RoleChecker([UserRole.PARTICIPANT]))
):
    """
    Example of an endpoint protected for Participants only.
    """
    return {"message": f"Welcome to your dashboard, Participant {current_user.name}!"}

@router.get("/judge-dashboard", response_model=dict)
async def get_judge_dashboard(
    current_user: User = Depends(RoleChecker([UserRole.JUDGE]))
):
    """
    Example of an endpoint protected for Judges only.
    """
    return {"message": f"Welcome to your dashboard, Judge {current_user.name}!"}

@router.get("/admin-panel", response_model=dict)
async def get_admin_panel(
    current_user: User = Depends(RoleChecker([UserRole.ADMIN, UserRole.ORGANIZER]))
):
    """
    Example of an endpoint protected for Admins or Organizers.
    """
    return {"message": f"Welcome to the Admin Panel, {current_user.name}!"}