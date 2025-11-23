from datetime import datetime
from enum import Enum
from typing import Optional, Annotated
from bson import ObjectId
from pydantic import BaseModel, Field, constr, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]

class HackathonType(str, Enum):
    ML_HACKATHON = "ml_hackathon"
    CODEATHON = "codeathon"
    HACKATHON = "hackathon"

class HackathonBase(BaseModel):
    name: str
    description: str
    hackathon_type: HackathonType
    start_date: datetime
    end_date: datetime
    is_active: bool = True

class HackathonCreate(HackathonBase):
    pass

class Hackathon(HackathonBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
