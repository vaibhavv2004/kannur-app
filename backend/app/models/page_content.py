from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PageContent(Base):
    __tablename__ = "page_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    page_key: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
