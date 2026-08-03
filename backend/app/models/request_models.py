from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.constants import AIProvider, MediaType, TaskStatus
from app.models.media import MediaAsset, ProvenanceRecord


# --- User Authentication Models ---

class UserRegisterRequest(BaseModel):
    email: str = Field(..., example="creator@genmedia.ai")
    password: str = Field(..., min_length=6, example="securePassword123")
    full_name: str = Field(..., example="Alex Creator")


class UserLoginRequest(BaseModel):
    email: str = Field(..., example="creator@genmedia.ai")
    password: str = Field(..., example="securePassword123")


class UserResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Generation Request / Response Models ---

class GenerationRequest(BaseModel):
    """Payload sent by client to request media generation."""

    prompt: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="Text prompt describing the desired media output.",
        example="A futuristic glowing cybernetic city at twilight with flying vehicles, 8k resolution",
    )
    media_type: MediaType = Field(
        default=MediaType.IMAGE,
        description="Type of media to generate (image, video, audio, multimodal).",
    )
    provider: AIProvider = Field(
        default=AIProvider.GMI_CLOUD,
        description="Generative AI provider to use via Genblaze SDK.",
    )
    model: Optional[str] = Field(
        default=None,
        description="Specific model identifier (e.g., flux-1-schnell, dall-e-3, gen-2).",
    )
    aspect_ratio: Optional[str] = Field(
        default="16:9",
        description="Aspect ratio for image/video outputs (e.g., 1:1, 16:9, 9:16).",
    )
    negative_prompt: Optional[str] = Field(
        default=None,
        description="Unwanted elements to avoid during generation.",
    )
    seed: Optional[int] = Field(
        default=None,
        description="Random seed for reproducible media outputs.",
    )
    user_id: Optional[str] = Field(
        default="default_user",
        description="User ID for isolated asset storage.",
    )


class GenerationResponse(BaseModel):
    """Response returned upon initiation of a media generation task."""

    task_id: str
    status: TaskStatus
    media_type: MediaType
    provider: str
    model: str
    prompt: str
    message: str = "Media generation task created successfully."
    created_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_time_seconds: Optional[float] = 5.0
    media_url: Optional[str] = None
    b2_file_key: Optional[str] = None


class TaskStatusResponse(BaseModel):
    """Detailed status update for an ongoing generation task."""

    task_id: str
    status: TaskStatus
    progress_percentage: int = 0
    media_url: Optional[str] = None
    b2_file_key: Optional[str] = None
    media_type: MediaType
    provider: str
    provenance: Optional[ProvenanceRecord] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None


# --- Storage Request / Response Models ---

class StorageUploadRequest(BaseModel):
    """Request metadata for direct asset uploads."""

    file_name: str
    media_type: MediaType
    custom_tags: List[str] = Field(default_factory=list)


class RenameAssetRequest(BaseModel):
    """Payload to rename an existing file stored in Backblaze B2."""

    old_file_key: str
    new_file_name: str


class StorageFileItem(BaseModel):
    """Representation of an object stored in Backblaze B2."""

    file_id: str
    file_name: str
    file_key: str
    media_type: MediaType
    size_bytes: int
    url: str
    thumbnail_url: Optional[str] = None
    created_at: datetime
    provider: Optional[str] = "user_uploaded"


class StorageListResponse(BaseModel):
    """Response wrapper for listing files in Backblaze B2 bucket."""

    files: List[StorageFileItem]
    total_count: int
    bucket_name: str


# --- System Health Response Model ---

class ServiceHealthStatus(BaseModel):
    backblaze_b2: str = "configured"
    genblaze_sdk: str = "ready"
    storage_access: str = "ok"


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    environment: str = "development"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: ServiceHealthStatus = Field(default_factory=ServiceHealthStatus)
