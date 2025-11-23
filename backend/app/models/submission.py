from datetime import datetime
from enum import Enum
from typing import Optional, Annotated

from bson import ObjectId
from fastapi import APIRouter
from pydantic import BaseModel, Field, EmailStr, constr, BeforeValidator

router = APIRouter()


