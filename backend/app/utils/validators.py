import os
from typing import Tuple
from fastapi import HTTPException, status
from app.core.constants import (
    ALLOWED_AUDIO_EXTENSIONS,
    ALLOWED_IMAGE_EXTENSIONS,
    ALLOWED_VIDEO_EXTENSIONS,
    MediaType,
)


def validate_prompt(prompt: str) -> str:
    """Sanitizes and validates user prompt text."""
    cleaned = prompt.strip()
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt text cannot be empty or whitespace only.",
        )
    if len(cleaned) > 2000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt exceeds maximum length of 2000 characters.",
        )
    return cleaned


def validate_file_extension(filename: str) -> Tuple[bool, MediaType]:
    """Determines media type and validates extension for uploaded files."""
    ext = os.path.splitext(filename)[1].lower()
    if ext in ALLOWED_IMAGE_EXTENSIONS:
        return True, MediaType.IMAGE
    elif ext in ALLOWED_VIDEO_EXTENSIONS:
        return True, MediaType.VIDEO
    elif ext in ALLOWED_AUDIO_EXTENSIONS:
        return True, MediaType.AUDIO
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions: {ALLOWED_IMAGE_EXTENSIONS + ALLOWED_VIDEO_EXTENSIONS + ALLOWED_AUDIO_EXTENSIONS}",
        )
