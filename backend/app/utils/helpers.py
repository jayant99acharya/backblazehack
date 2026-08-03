import uuid
from datetime import datetime


def generate_unique_id(prefix: str = "gen") -> str:
    """Generates a clean unique ID with prefix."""
    unique_hex = uuid.uuid4().hex[:12]
    return f"{prefix}_{unique_hex}"


def format_bytes(size: int) -> str:
    """Formats byte size into human readable string (KB, MB, GB)."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.2f} KB"
    elif size < 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024):.2f} MB"
    else:
        return f"{size / (1024 * 1024 * 1024):.2f} GB"


def get_timestamp_iso() -> str:
    """Returns current UTC timestamp in ISO 8601 format."""
    return datetime.utcnow().isoformat() + "Z"
