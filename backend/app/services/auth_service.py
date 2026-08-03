import hashlib
import json
import os
import re
import sys
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from fastapi import HTTPException, status

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.logger import logger
from app.models.request_models import AuthTokenResponse, UserRegisterRequest, UserResponse
from app.services.b2_service import b2_service


class AuthService:
    """Authentication and User Management Service storing user profiles directly in Backblaze B2."""

    def __init__(self) -> None:
        self._memory_users: Dict[str, Dict[str, Any]] = {}

    def _hash_password(self, password: str) -> str:
        """Hashes password using SHA256 with salt."""
        salt = "genmedia_b2_hackathon_salt_2026"
        return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

    def register_user(self, request: UserRegisterRequest) -> AuthTokenResponse:
        """Registers a new user and saves their profile to Backblaze B2 under users/{user_id}.json."""
        email_clean = request.email.strip().lower()

        # Check if user already exists
        user_key = f"users/{hashlib.md5(email_clean.encode()).hexdigest()}.json"
        
        if email_clean in self._memory_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )

        # Create human-readable slug for folder naming in Backblaze B2
        clean_name = re.sub(r"[^\w]", "_", (request.full_name or email_clean.split("@")[0]).strip().lower())
        user_id = f"{clean_name}_{uuid.uuid4().hex[:4]}"
        hashed_password = self._hash_password(request.password)

        user_data = {
            "user_id": user_id,
            "email": email_clean,
            "full_name": request.full_name,
            "password_hash": hashed_password,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        # Store in memory cache
        self._memory_users[email_clean] = user_data

        # Store user record directly in Backblaze B2!
        if b2_service.s3_client:
            try:
                user_json = json.dumps(user_data, indent=2)
                b2_service.s3_client.put_object(
                    Bucket=b2_service.bucket_name,
                    Key=user_key,
                    Body=user_json.encode("utf-8"),
                    ContentType="application/json",
                )
                logger.info(f"Saved user profile for '{email_clean}' directly to Backblaze B2 at '{user_key}'.")
            except Exception as e:
                logger.warning(f"Could not upload user profile to B2: {e}")

        user_resp = UserResponse(
            user_id=user_id,
            email=email_clean,
            full_name=request.full_name,
            created_at=datetime.now(timezone.utc),
        )

        return AuthTokenResponse(
            access_token=f"token_{user_id}_{uuid.uuid4().hex[:12]}",
            token_type="bearer",
            user=user_resp,
        )

    def login_user(self, email: str, password: str) -> AuthTokenResponse:
        """Authenticates user against stored Backblaze B2 user profile."""
        email_clean = email.strip().lower()
        hashed_password = self._hash_password(password)

        user_data = self._memory_users.get(email_clean)

        # Try to load user profile from Backblaze B2 if not in memory
        if not user_data and b2_service.s3_client:
            user_key = f"users/{hashlib.md5(email_clean.encode()).hexdigest()}.json"
            try:
                obj = b2_service.s3_client.get_object(Bucket=b2_service.bucket_name, Key=user_key)
                content = obj["Body"].read().decode("utf-8")
                user_data = json.loads(content)
                self._memory_users[email_clean] = user_data
            except Exception:
                user_data = None

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if user_data.get("password_hash") != hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user_resp = UserResponse(
            user_id=user_data["user_id"],
            email=user_data["email"],
            full_name=user_data["full_name"],
            created_at=datetime.now(timezone.utc),
        )

        return AuthTokenResponse(
            access_token=f"token_{user_data['user_id']}_{uuid.uuid4().hex[:12]}",
            token_type="bearer",
            user=user_resp,
        )


auth_service = AuthService()
