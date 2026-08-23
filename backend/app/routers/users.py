from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import limiter
from app.models.admin import Admin
from app.models.user import IdProofType, User, UserStatus
from app.schemas.user import UserOut, UserReviewAction
from app.security import get_current_admin, get_current_citizen, hash_password
from app.storage import ALLOWED_CONTENT_TYPES, MAX_FILE_SIZE_BYTES, read_id_proof, save_id_proof

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(
    request: Request,
    full_name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    id_proof_type: IdProofType = Form(...),
    id_proof: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if db.scalar(select(User).where(User.phone == phone)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Phone number already registered")
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    if id_proof.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "ID proof must be a JPEG, PNG, or PDF")
    contents = await id_proof.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "ID proof file is too large (max 5MB)")

    storage_key = save_id_proof(id_proof, contents)

    user = User(
        full_name=full_name,
        phone=phone,
        email=email,
        hashed_password=hash_password(password),
        id_proof_type=id_proof_type,
        id_proof_storage_key=storage_key,
        id_proof_content_type=id_proof.content_type,
        status=UserStatus.pending,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserOut)
def get_me(citizen: User = Depends(get_current_citizen)):
    return citizen


@router.get("", response_model=list[UserOut])
def list_users(
    status_filter: UserStatus | None = None,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    query = select(User)
    if status_filter is not None:
        query = query.where(User.status == status_filter)
    return db.scalars(query.order_by(User.created_at.desc())).all()


@router.get("/{user_id}/id-proof")
def get_id_proof(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    contents = read_id_proof(user.id_proof_storage_key)
    return Response(content=contents, media_type=user.id_proof_content_type)


@router.post("/{user_id}/approve", response_model=UserOut)
def approve_user(
    user_id: int,
    _payload: UserReviewAction | None = None,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    user.status = UserStatus.approved
    user.reviewed_at = datetime.now(timezone.utc)
    user.reviewed_by_admin_id = admin.id
    db.commit()
    db.refresh(user)
    return user


@router.post("/{user_id}/reject", response_model=UserOut)
def reject_user(
    user_id: int,
    _payload: UserReviewAction | None = None,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    user.status = UserStatus.rejected
    user.reviewed_at = datetime.now(timezone.utc)
    user.reviewed_by_admin_id = admin.id
    db.commit()
    db.refresh(user)
    return user
