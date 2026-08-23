from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.user import IdProofType, UserStatus


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    phone: str
    email: str
    id_proof_type: IdProofType
    status: UserStatus
    created_at: datetime


class UserReviewAction(BaseModel):
    reason: str | None = None
