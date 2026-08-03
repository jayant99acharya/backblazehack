import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import settings
from app.core.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """FastAPI application lifespan setup and teardown handler."""
    logger.info("==================================================")
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Backblaze B2 Target Bucket: {settings.B2_BUCKET_NAME}")
    logger.info(f"Genblaze SDK Integration: Ready (Mock Mode default)")
    logger.info("==================================================")

    yield

    logger.info("Shutting down GenMedia FastAPI Application Server.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-ready backend scaffold for Generative AI Media workflows. "
        "Orchestrates media generation with Genblaze SDK and stores assets on Backblaze B2."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Enable CORS for frontend client interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", summary="Health Check")
@app.get("/api/health", summary="Health Check")
@app.get("/api/v1/health", summary="Health Check")
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "bucket": settings.B2_BUCKET_NAME,
    }

# Register main API router with API_V1_STR prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

# Static files & SPA mounting for Cloud Run single container deployment
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
if not os.path.exists(static_dir):
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))

if os.path.exists(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/{full_path:path}", summary="SPA Fallback Route Handler")
    async def serve_spa(request: Request, full_path: str):
        if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json"]:
            return None
        target_path = os.path.join(static_dir, full_path)
        if os.path.isfile(target_path):
            return FileResponse(target_path)
        index_path = os.path.join(static_dir, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        return {
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "online",
        }
else:
    @app.get("/", summary="Root Endpoint")
    async def root():
        """Welcome endpoint providing health status and API doc pointers."""
        return {
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "online",
            "docs_url": "/docs",
            "health_check": f"{settings.API_V1_STR}/health",
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
