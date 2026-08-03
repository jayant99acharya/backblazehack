from datetime import datetime
from fastapi import APIRouter, status
from app.core.config import settings
from app.models.request_models import HealthResponse, ServiceHealthStatus

router = APIRouter(prefix="/health", tags=["Health Telemetry"])


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Check API and Service Health",
    description="Returns backend server operational status and component readiness.",
)
async def check_health() -> HealthResponse:
    b2_status = (
        "configured"
        if (settings.B2_KEY_ID and settings.B2_APPLICATION_KEY)
        else "mock_mode (add credentials in .env)"
    )
    genblaze_status = (
        "configured"
        if settings.GENBLAZE_API_KEY
        else "mock_mode (add GENBLAZE_API_KEY in .env)"
    )

    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment="development",
        timestamp=datetime.utcnow(),
        services=ServiceHealthStatus(
            backblaze_b2=b2_status,
            genblaze_sdk=genblaze_status,
            storage_access="ok",
        ),
    )
