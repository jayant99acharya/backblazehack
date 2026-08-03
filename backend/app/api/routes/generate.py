from typing import Any, Dict
from fastapi import APIRouter, HTTPException, status
from app.core.constants import SUPPORTED_PROVIDERS
from app.core.logger import logger
from app.models.request_models import (
    GenerationRequest,
    GenerationResponse,
    TaskStatusResponse,
)
from app.services.genblaze_service import genblaze_service
from app.utils.validators import validate_prompt

router = APIRouter(prefix="/generate", tags=["Media Generation"])


@router.post(
    "",
    response_model=GenerationResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Initiate AI Media Generation",
    description="Submits a media generation request across supported AI providers using Genblaze SDK.",
)
async def generate_media(request: GenerationRequest) -> GenerationResponse:
    """Initiates media generation task.

    TODO:
    1. Pass request to Genblaze SDK multi-provider orchestrator.
    2. Pipe resulting image/video/audio output stream into Backblaze B2 storage bucket.
    """
    request.prompt = validate_prompt(request.prompt)

    logger.info(
        f"API Request: Generate media | Provider: {request.provider} | Type: {request.media_type}"
    )

    result = genblaze_service.initiate_generation(request)
    return GenerationResponse(**result)


@router.get(
    "/status/{task_id}",
    response_model=TaskStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Generation Task Status",
    description="Polls current progress and retrieves output Backblaze B2 media URL once completed.",
)
async def get_generation_status(task_id: str) -> TaskStatusResponse:
    """Polls task generation status.

    TODO:
    Query Genblaze SDK workflow status and return updated progress or completion URL.
    """
    logger.info(f"API Request: Check status for task '{task_id}'")
    status_data = genblaze_service.get_task_status(task_id)
    return TaskStatusResponse(**status_data)


@router.get(
    "/providers",
    status_code=status.HTTP_200_OK,
    summary="List Supported AI Providers and Models",
    description="Returns available AI generation providers, supported media formats, and available models.",
)
async def list_providers() -> Dict[str, Any]:
    """Returns list of supported providers and model presets."""
    return {"providers": SUPPORTED_PROVIDERS}
