import os
import sys
from datetime import datetime, timezone
from typing import Dict, List, Optional

# Auto-add backend root directory to sys.path for IDE & CLI import safety
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.models.media import ProvenanceRecord
from app.models.request_models import GenerationRequest


class MetadataService:
    """Service responsible for indexing, persisting, and querying media asset provenance metadata."""

    def __init__(self) -> None:
        self._provenance_store: Dict[str, ProvenanceRecord] = {}

    def create_provenance_record(
        self, request: GenerationRequest, generation_time: float = 3.2
    ) -> ProvenanceRecord:
        """Creates a provenance record for an AI generation workflow."""
        record = ProvenanceRecord(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            provider=request.provider.value if hasattr(request.provider, 'value') else str(request.provider),
            model=request.model or "default_model",
            seed=request.seed or 42,
            guidance_scale=7.5,
            generation_time_seconds=generation_time,
            created_at=datetime.now(timezone.utc),
        )
        return record


# Singleton service instance
metadata_service = MetadataService()
