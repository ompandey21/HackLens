from datetime import datetime
from enum import Enum
from typing import Optional, Annotated

from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr, constr, BeforeValidator

# This custom type will convert MongoDB's ObjectId to a string
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserRole(str, Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    JUDGE = "judge"
    PARTICIPANT = "participant"

class UserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: constr(min_length=8, max_length=72)
    role: UserRole = UserRole.PARTICIPANT

class User(BaseModel):
    # Use the new PyObjectId type for the id field
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    username: str
    email: EmailStr
    hashed_password: str
    role: UserRole
    disabled: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Om Pandey",
                "username": "om",
                "email": "om@example.com",
                "role": "admin",
            }
        }