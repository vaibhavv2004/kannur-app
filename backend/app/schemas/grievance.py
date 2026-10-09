from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.grievance import GrievanceStatus


class GrievanceCreate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


class GrievanceStatusUpdate(BaseModel):
    status: GrievanceStatus


class GrievanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    petition_id: str
    category: str
    subject: str
    message: str
    status: GrievanceStatus
    is_new: bool
    created_at: datetime
    name: str
    phone: str
    email: str
