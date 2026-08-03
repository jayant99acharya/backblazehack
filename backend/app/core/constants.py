from enum import Enum


class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    MULTIMODAL = "multimodal"


class TaskStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class AIProvider(str, Enum):
    GMI_CLOUD = "gmi_cloud"
    OPENAI = "openai"
    RUNWAY = "runway"
    ELEVENLABS = "elevenlabs"
    STABILITY_AUDIO = "stability_audio"
    DECAART = "decart"
    NVIDIA_NIM = "nvidia_nim"
    GOOGLE = "google"


# Supported Providers Mapping
SUPPORTED_PROVIDERS = [
    {
        "id": AIProvider.GMI_CLOUD.value,
        "name": "GMI Cloud",
        "supported_types": [MediaType.IMAGE.value, MediaType.VIDEO.value, MediaType.MULTIMODAL.value],
        "default_model": "flux-1-schnell",
        "models": ["flux-1-schnell", "flux-1-dev", "luma-dream-machine"],
    },
    {
        "id": AIProvider.OPENAI.value,
        "name": "OpenAI",
        "supported_types": [MediaType.IMAGE.value],
        "default_model": "dall-e-3",
        "models": ["dall-e-3", "dall-e-2"],
    },
    {
        "id": AIProvider.RUNWAY.value,
        "name": "Runway",
        "supported_types": [MediaType.VIDEO.value],
        "default_model": "gen-2",
        "models": ["gen-2", "gen-3-alpha"],
    },
    {
        "id": AIProvider.ELEVENLABS.value,
        "name": "ElevenLabs",
        "supported_types": [MediaType.AUDIO.value],
        "default_model": "eleven_multilingual_v2",
        "models": ["eleven_multilingual_v2", "eleven_turbo_v2"],
    },
]

# File Storage Extensions Allowed
ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"]
ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"]
ALLOWED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".flac"]
