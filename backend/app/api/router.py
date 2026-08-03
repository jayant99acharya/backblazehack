from fastapi import APIRouter
from app.api.routes import auth, generate, health, storage

api_router = APIRouter()

# Include feature sub-routers
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(generate.router)
api_router.include_router(storage.router)
