from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.constants import MediaType, TaskStatus


class ProvenanceRecord(BaseModel):
    """Provenance tracking record for AI generated media assets."""

    prompt: str
    negative_prompt: Optional[str] = None
    provider: str
    model: str
    seed: Optional[int] = None
    guidance_scale: Optional[float] = 7.5
    generation_time_seconds: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = "anonymous_creator"


class MediaAsset(BaseModel):
    """Media asset stored in Backblaze B2."""

    asset_id: str
    file_key: str
    file_name: str
    media_type: MediaType
    url: str
    thumbnail_url: Optional[str] = None
    size_bytes: int
    b2_bucket: str
    provenance: Optional[ProvenanceRecord] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = Field(default_factory=list)
