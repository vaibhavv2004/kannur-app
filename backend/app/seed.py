"""One-off script: creates the initial admin account and seeds sample gallery items.

Run with: python -m app.seed
"""

from app.config import settings
from app.database import SessionLocal
from app.models.admin import Admin
from app.models.gallery import GalleryItem, MediaType
from app.security import hash_password

SAMPLE_GALLERY_ITEMS = [
    {"title": "Inauguration of Digital Classrooms", "category": "Education", "url": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80"},
    {"title": "Inspection of City Road Project", "category": "Development", "url": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"},
    {"title": "Interacting with Handloom Weavers", "category": "Community", "url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"},
    {"title": "St. Angelo Fort Tourism Inspection", "category": "Tourism", "url": "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80"},
    {"title": "Public Grievance Redressal Adalat", "category": "Community", "url": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"},
    {"title": "Distribution of Agriculture Subsidies", "category": "Agriculture", "url": "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"},
]


def seed():
    db = SessionLocal()
    try:
        if not db.query(Admin).filter_by(username=settings.admin_username).first():
            db.add(
                Admin(
                    username=settings.admin_username,
                    hashed_password=hash_password(settings.admin_password),
                )
            )
            print(f"Created admin user '{settings.admin_username}'")
        else:
            print(f"Admin user '{settings.admin_username}' already exists, skipping")

        if db.query(GalleryItem).count() == 0:
            for item in SAMPLE_GALLERY_ITEMS:
                db.add(GalleryItem(media_type=MediaType.image, **item))
            print(f"Seeded {len(SAMPLE_GALLERY_ITEMS)} gallery items")
        else:
            print("Gallery items already exist, skipping")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
