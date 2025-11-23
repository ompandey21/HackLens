from datetime import datetime
from typing import List
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.core.database import user_collection
from app.core.security import ALGORITHM, SECRET_KEY, create_access_token, get_password_hash, verify_password
from app.models.user import User, UserCreate, UserRole

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print("SECRET_KEY:", SECRET_KEY[:10])

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await user_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    
    # Return the user as a Pydantic model
    return User(**user)

def RoleChecker(allowed_roles: List[UserRole]):
    def check_roles(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource"
            )
        return current_user
    return check_roles

# Admin User : 
# {
#   "name": "Admin Om",
#   "username": "admin_om",
#   "email": "admin@hacklens.com",
#   "password": "AdminPass123",
#   "role": "admin"
# }

# Participant:
# {
#   "name": "Test Participant",
#   "username": "participant_om",
#   "email": "participant@test.com",
#   "password": "test123456",
#   "role": "participant"
# }

@router.post("/signup", response_model=User)
async def signup(user_data: UserCreate):
    db_user_by_email = await user_collection.find_one({"email": user_data.email})
    if db_user_by_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    db_user_by_username = await user_collection.find_one({"username": user_data.username})
    if db_user_by_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    user_document = {
        "name": user_data.name,
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": get_password_hash(user_data.password),
        "role": user_data.role.value,
        "disabled": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await user_collection.insert_one(user_document)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    return created_user

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user