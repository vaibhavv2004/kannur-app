from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PageContentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    page_key: str
    data: dict
    updated_at: datetime


class PageContentUpdate(BaseModel):
    data: dict
