from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.page_content import PageContent
from app.schemas.page_content import PageContentOut, PageContentUpdate
from app.security import get_current_admin

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/{page_key}", response_model=PageContentOut)
def get_page_content(page_key: str, db: Session = Depends(get_db)):
    content = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    if content is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"No content seeded for '{page_key}'")
    return content


@router.put("/{page_key}", response_model=PageContentOut)
def update_page_content(
    page_key: str,
    payload: PageContentUpdate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    content = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    if content is None:
        content = PageContent(page_key=page_key, data=payload.data)
        db.add(content)
    else:
        content.data = payload.data
        content.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(content)
    return content
