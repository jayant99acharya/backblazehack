from fastapi import APIRouter, status
from app.models.request_models import AuthTokenResponse, UserLoginRequest, UserRegisterRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["User Authentication"])


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    description="Creates user account and persists profile record directly into Backblaze B2 bucket.",
)
async def register(request: UserRegisterRequest) -> AuthTokenResponse:
    return auth_service.register_user(request)


@router.post(
    "/login",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    description="Authenticates user against credentials stored in Backblaze B2.",
)
async def login(request: UserLoginRequest) -> AuthTokenResponse:
    return auth_service.login_user(request.email, request.password)
