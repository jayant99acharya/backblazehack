from typing import Any, Dict, Optional
from fastapi import APIRouter, File, HTTPException, Query, Response, UploadFile, status
from app.core.config import settings
from app.core.logger import logger
from app.models.request_models import RenameAssetRequest, StorageFileItem, StorageListResponse
from app.services.b2_service import b2_service
from app.utils.validators import validate_file_extension

router = APIRouter(prefix="/storage", tags=["Backblaze B2 Storage"])


@router.get(
    "/media/{file_key:path}",
    summary="Stream Media Asset directly from Backblaze B2",
    description="Fetches raw object bytes directly from Backblaze B2 bucket and streams them to browser with appropriate Content-Type header.",
)
async def stream_b2_media(file_key: str):
    """Streams file directly from Backblaze B2 bucket to browser."""
    logger.info(f"API Request: Stream B2 object key '{file_key}'")
    content, content_type = b2_service.fetch_file_stream(file_key)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset key '{file_key}' not found in Backblaze B2 bucket.",
        )
    return Response(content=content, media_type=content_type)


@router.get(
    "/files",
    response_model=StorageListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Stored Media Files in Backblaze B2",
    description="Retrieves a list of generated media assets and metadata stored in the B2 bucket.",
)
async def list_stored_files(user_id: Optional[str] = Query(None, description="Filter files for a specific user ID")) -> StorageListResponse:
    """Lists files in Backblaze B2 bucket."""
    logger.info(f"API Request: List files from Backblaze B2 bucket (user_id={user_id})")
    files_raw = b2_service.list_files(user_id=user_id)
    files_items = [StorageFileItem(**f) for f in files_raw]

    return StorageListResponse(
        files=files_items,
        total_count=len(files_items),
        bucket_name=settings.B2_BUCKET_NAME,
    )


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    summary="Upload Media Asset to Backblaze B2",
    description="Direct multipart file upload endpoint to store media assets directly into Backblaze B2 Cloud Storage.",
)
async def upload_media_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Uploads file directly to Backblaze B2 bucket."""
    logger.info(f"API Request: Upload media file '{file.filename}'")

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Filename missing."
        )

    _, media_type = validate_file_extension(file.filename)
    contents = await file.read()

    result = b2_service.upload_file(
        file_content=contents,
        file_name=file.filename,
        content_type=file.content_type or "application/octet-stream",
    )

    return {
        "message": f"File '{file.filename}' uploaded successfully to Backblaze B2.",
        "data": result,
    }


@router.post(
    "/rename",
    status_code=status.HTTP_200_OK,
    summary="Rename Stored Media Asset in Backblaze B2",
    description="Renames an asset and its provenance metadata in Backblaze B2 bucket.",
)
async def rename_media_asset(request: RenameAssetRequest) -> Dict[str, Any]:
    """Renames media asset in Backblaze B2 bucket."""
    logger.info(f"API Request: Rename file '{request.old_file_key}' -> '{request.new_file_name}'")
    result = b2_service.rename_file(request.old_file_key, request.new_file_name)
    return {"message": "File renamed successfully in Backblaze B2.", "data": result}


@router.delete(
    "/files/{file_key:path}",
    status_code=status.HTTP_200_OK,
    summary="Delete Asset from Backblaze B2",
    description="Removes specified file key from Backblaze B2 cloud storage.",
)
async def delete_stored_file(file_key: str) -> Dict[str, str]:
    """Deletes media asset from Backblaze B2 bucket."""
    logger.info(f"API Request: Delete file key '{file_key}' from Backblaze B2")
    success = b2_service.delete_file(file_key)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file key '{file_key}' from Backblaze B2.",
        )
    return {"message": f"File '{file_key}' deleted successfully from Backblaze B2."}

