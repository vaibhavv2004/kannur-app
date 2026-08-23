import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.grievance import Grievance
from app.models.user import User
from app.schemas.grievance import GrievanceCreate, GrievanceOut, GrievanceStatusUpdate
from app.security import get_current_admin, get_current_citizen

router = APIRouter(prefix="/api/grievances", tags=["grievances"])


def _to_out(grievance: Grievance) -> GrievanceOut:
    return GrievanceOut(
        id=grievance.id,
        petition_id=grievance.petition_id,
        category=grievance.category,
        subject=grievance.subject,
        message=grievance.message,
        status=grievance.status,
        is_new=grievance.is_new,
        created_at=grievance.created_at,
        name=grievance.user.full_name,
        phone=grievance.user.phone,
        email=grievance.user.email,
    )


def _generate_petition_id(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    while True:
        candidate = f"PET-{year}-{random.randint(100, 999)}"
        if not db.scalar(select(Grievance).where(Grievance.petition_id == candidate)):
            return candidate


@router.post("", response_model=GrievanceOut, status_code=status.HTTP_201_CREATED)
def submit_grievance(
    payload: GrievanceCreate,
    db: Session = Depends(get_db),
    citizen: User = Depends(get_current_citizen),
):
    grievance = Grievance(
        petition_id=_generate_petition_id(db),
        user_id=citizen.id,
        category=payload.category,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return _to_out(grievance)


@router.get("", response_model=list[GrievanceOut])
def list_grievances(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    grievances = db.scalars(select(Grievance).order_by(Grievance.created_at.desc())).all()
    return [_to_out(g) for g in grievances]


@router.patch("/{grievance_id}", response_model=GrievanceOut)
def update_grievance_status(
    grievance_id: int,
    payload: GrievanceStatusUpdate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    grievance = db.get(Grievance, grievance_id)
    if grievance is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grievance not found")
    grievance.status = payload.status
    grievance.is_new = False
    db.commit()
    db.refresh(grievance)
    return _to_out(grievance)


@router.delete("/{grievance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grievance(
    grievance_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    grievance = db.get(Grievance, grievance_id)
    if grievance is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Grievance not found")
    db.delete(grievance)
    db.commit()
