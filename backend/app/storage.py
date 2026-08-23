import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def _storage_dir() -> Path:
    path = Path(settings.id_proof_storage_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_id_proof(file: UploadFile, contents: bytes) -> str:
    """Writes the uploaded ID proof to private local storage and returns its storage key.

    Swap this function's body for an S3/R2 client call to move to object storage —
    callers only depend on the storage-key string it returns.
    """
    suffix = Path(file.filename or "").suffix.lower()
    storage_key = f"{uuid.uuid4().hex}{suffix}"
    (_storage_dir() / storage_key).write_bytes(contents)
    return storage_key


def read_id_proof(storage_key: str) -> bytes:
    return (_storage_dir() / storage_key).read_bytes()
