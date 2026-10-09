from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.gallery import GalleryItem
from app.schemas.gallery import GalleryItemCreate, GalleryItemOut
from app.security import get_current_admin

router = APIRouter(prefix="/api/gallery", tags=["gallery"])


@router.get("", response_model=list[GalleryItemOut])
def list_gallery_items(db: Session = Depends(get_db)):
    return db.scalars(select(GalleryItem).order_by(GalleryItem.created_at.desc())).all()


@router.post("", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
def create_gallery_item(
    payload: GalleryItemCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    item = GalleryItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_item(
    item_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    item = db.get(GalleryItem, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Gallery item not found")
    db.delete(item)
    db.commit()
