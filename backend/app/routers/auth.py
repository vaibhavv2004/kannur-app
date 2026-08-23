from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import limiter
from app.models.admin import Admin
from app.models.user import User
from app.schemas.auth import AdminLoginRequest, TokenResponse, UserLoginRequest
from app.security import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/admin/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def admin_login(request: Request, payload: AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.scalar(select(Admin).where(Admin.username == payload.username))
    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or password")
    token = create_access_token(admin.id, "admin")
    return TokenResponse(access_token=token, role="admin")


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def citizen_login(request: Request, payload: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if user.status.value != "approved":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            f"Account is {user.status.value}, awaiting admin approval",
        )
    token = create_access_token(user.id, "citizen")
    return TokenResponse(access_token=token, role="citizen")
