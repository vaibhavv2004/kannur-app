from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.gallery import MediaType


class GalleryItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    media_type: MediaType
    url: str = Field(min_length=1, max_length=1000)


class GalleryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str
    media_type: MediaType
    url: str
    created_at: datetime
