import json
import os
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import boto3  # type: ignore
from botocore.exceptions import BotoCoreError, ClientError  # type: ignore
from app.core.config import settings
from app.core.constants import MediaType
from app.core.logger import logger
from app.utils.helpers import generate_unique_id


class B2StorageService:
    """Production service wrapper for interacting with Backblaze B2 Cloud Object Storage via S3 API."""

    def __init__(self) -> None:
        self.bucket_name = settings.B2_BUCKET_NAME or "satvik-genblaze-ai-media"
        self.endpoint_url = settings.B2_ENDPOINT or "https://s3.us-east-005.backblazeb2.com"
        self.key_id = settings.B2_KEY_ID
        self.application_key = settings.B2_APPLICATION_KEY

        self.s3_client = None
        self._initialize_client()

    def _initialize_client(self) -> None:
        """Initializes boto3 S3 client for Backblaze B2 endpoint and ensures bucket existence."""
        if self.key_id and self.application_key:
            try:
                self.s3_client = boto3.client(
                    "s3",
                    endpoint_url=self.endpoint_url,
                    aws_access_key_id=self.key_id,
                    aws_secret_access_key=self.application_key,
                )
                logger.info(
                    f"Backblaze B2 S3 client connected to bucket '{self.bucket_name}' at '{self.endpoint_url}'."
                )
                self._ensure_bucket_exists()
            except Exception as err:
                logger.error(f"Failed to initialize Backblaze B2 S3 client: {err}")
                self.s3_client = None
        else:
            logger.warning(
                "Backblaze B2 credentials missing in .env. Falling back to local storage buffer."
            )

    def _ensure_bucket_exists(self) -> None:
        """Checks if Backblaze B2 bucket exists; attempts creation if missing."""
        if not self.s3_client:
            return
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            logger.info(f"Verified Backblaze B2 bucket '{self.bucket_name}' exists.")
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code in ["404", "NoSuchBucket"]:
                logger.info(f"Bucket '{self.bucket_name}' not found. Creating bucket...")
                try:
                    self.s3_client.create_bucket(Bucket=self.bucket_name)
                    logger.info(f"Successfully created Backblaze B2 bucket '{self.bucket_name}'.")
                except Exception as create_err:
                    logger.warning(f"Could not auto-create bucket: {create_err}")
            else:
                logger.warning(f"Bucket head check status: {e}")

    def upload_file(
        self,
        file_content: bytes,
        file_name: str,
        content_type: str = "image/png",
        metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Uploads file bytes and metadata into Backblaze B2 under outputs/{user_id}/ and metadata/{user_id}/."""
        clean_user = user_id if (user_id and user_id.strip()) else "default_user"
        file_key = f"outputs/{clean_user}/{file_name}"
        metadata_key = f"metadata/{clean_user}/{file_name}.json"
        logger.info(f"Uploading file '{file_key}' to Backblaze B2 bucket '{self.bucket_name}'...")

        if metadata is None:
            metadata = {}
        metadata["user_id"] = clean_user

        if self.s3_client:
            try:
                # 1. Upload media asset to outputs/{user_id}/{filename}
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=file_key,
                    Body=file_content,
                    ContentType=content_type,
                )
                logger.info(f"Uploaded asset to B2: {file_key}")

                # 2. Upload provenance metadata sidecar JSON to metadata/{user_id}/{filename}.json
                metadata_json = json.dumps(metadata, indent=2, default=str)
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=metadata_key,
                    Body=metadata_json.encode("utf-8"),
                    ContentType="application/json",
                )
                logger.info(f"Uploaded provenance metadata to B2: {metadata_key}")

            except (BotoCoreError, ClientError) as e:
                logger.error(f"B2 upload exception: {e}")

        # Media proxy endpoint URL
        proxy_url = f"{settings.API_V1_STR}/storage/media/{file_key}"

        # Determine media type
        ext = os.path.splitext(file_name)[1].lower()
        if ext in [".mp4", ".webm", ".mov"]:
            mtype = MediaType.VIDEO.value
        elif ext in [".mp3", ".wav", ".ogg"]:
            mtype = MediaType.AUDIO.value
        else:
            mtype = MediaType.IMAGE.value

        return {
            "file_id": generate_unique_id("file"),
            "file_name": file_name,
            "file_key": file_key,
            "media_type": mtype,
            "size_bytes": len(file_content) if file_content else 1048576,
            "url": proxy_url,
            "bucket_name": self.bucket_name,
            "uploaded_at": datetime.now(timezone.utc),
        }

    def list_files(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Lists media assets stored in Backblaze B2 under outputs/{user_id}/ or all outputs/."""
        prefix = f"outputs/{user_id}/" if user_id else "outputs/"
        logger.info(f"Listing files in Backblaze B2 bucket '{self.bucket_name}' with prefix '{prefix}'...")
        results: List[Dict[str, Any]] = []

        if self.s3_client:
            try:
                response = self.s3_client.list_objects_v2(
                    Bucket=self.bucket_name, Prefix=prefix
                )
                contents = response.get("Contents", [])

                for obj in contents:
                    key = obj["Key"]
                    filename = os.path.basename(key)
                    if not filename or key.endswith("/"):
                        continue

                    ext = os.path.splitext(filename)[1].lower()
                    if ext in [".mp4", ".webm", ".mov"]:
                        mtype = MediaType.VIDEO.value
                    elif ext in [".mp3", ".wav", ".ogg"]:
                        mtype = MediaType.AUDIO.value
                    else:
                        mtype = MediaType.IMAGE.value

                    proxy_url = f"{settings.API_V1_STR}/storage/media/{key}"

                    results.append(
                        {
                            "file_id": generate_unique_id("b2_file"),
                            "file_name": filename,
                            "file_key": key,
                            "media_type": mtype,
                            "size_bytes": obj.get("Size", 0),
                            "url": proxy_url,
                            "thumbnail_url": proxy_url if mtype == MediaType.IMAGE.value else None,
                            "created_at": obj.get("LastModified", datetime.now(timezone.utc)),
                            "provider": "Genblaze Orchestration",
                        }
                    )
            except Exception as err:
                logger.error(f"Error fetching Backblaze B2 objects: {err}")

        return results

    def fetch_file_stream(self, file_key: str) -> Tuple[bytes, str]:
        """Fetches object bytes directly from Backblaze B2 bucket for HTTP stream rendering."""
        if self.s3_client:
            try:
                obj = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_key)
                content = obj["Body"].read()
                content_type = obj.get("ContentType")

                if not content_type or content_type == "binary/octet-stream":
                    ext = os.path.splitext(file_key)[1].lower()
                    if ext in [".mp4", ".webm"]:
                        content_type = "video/mp4"
                    elif ext in [".mp3", ".wav", ".ogg"]:
                        content_type = "audio/mpeg"
                    elif ext in [".png", ".jpg", ".jpeg"]:
                        content_type = f"image/{ext.replace('.', '')}"
                    else:
                        content_type = "image/png"

                return content, content_type
            except Exception as e:
                logger.error(f"Error fetching B2 object '{file_key}': {e}")
        return b"", "image/png"

    def delete_file(self, file_key: str) -> bool:
        """Deletes specified file and its provenance metadata from Backblaze B2."""
        logger.info(f"Deleting file key '{file_key}' from Backblaze B2 bucket '{self.bucket_name}'")
        if self.s3_client:
            try:
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)
                metadata_key = file_key.replace("outputs/", "metadata/") + ".json"
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=metadata_key)
                return True
            except Exception as e:
                logger.error(f"Failed to delete B2 object '{file_key}': {e}")
                return False
        return True

    def rename_file(self, old_file_key: str, new_file_name: str) -> Dict[str, Any]:
        """Renames an existing file and metadata JSON in Backblaze B2 by copy and delete."""
        dir_path = os.path.dirname(old_file_key)
        new_file_key = f"{dir_path}/{new_file_name}" if dir_path else f"outputs/{new_file_name}"
        logger.info(f"Renaming Backblaze B2 object '{old_file_key}' -> '{new_file_key}'")

        if self.s3_client:
            try:
                # Copy object to new key name in B2
                copy_source = {"Bucket": self.bucket_name, "Key": old_file_key}
                self.s3_client.copy_object(CopySource=copy_source, Bucket=self.bucket_name, Key=new_file_key)
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=old_file_key)

                # Rename metadata JSON if present
                old_meta_key = old_file_key.replace("outputs/", "metadata/") + ".json"
                new_meta_key = new_file_key.replace("outputs/", "metadata/") + ".json"
                try:
                    self.s3_client.copy_object(
                        CopySource={"Bucket": self.bucket_name, "Key": old_meta_key},
                        Bucket=self.bucket_name,
                        Key=new_meta_key,
                    )
                    self.s3_client.delete_object(Bucket=self.bucket_name, Key=old_meta_key)
                except Exception:
                    pass

            except Exception as e:
                logger.error(f"Failed to rename file in Backblaze B2: {e}")

        proxy_url = f"{settings.API_V1_STR}/storage/media/{new_file_key}"
        return {
            "old_file_key": old_file_key,
            "new_file_key": new_file_key,
            "new_file_name": new_file_name,
            "url": proxy_url,
        }


# Singleton service instance
b2_service = B2StorageService()
