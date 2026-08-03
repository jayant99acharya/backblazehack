import os
from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings and Environment Configuration."""

    PROJECT_NAME: str = "GenMedia AI Pipeline"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Backblaze B2 S3-Compatible Cloud Storage Settings
    B2_KEY_ID: str = Field(default="", env="B2_KEY_ID")
    B2_APPLICATION_KEY: str = Field(default="", env="B2_APPLICATION_KEY")
    B2_BUCKET_NAME: str = Field(default="genmedia-assets", env="B2_BUCKET_NAME")
    B2_ENDPOINT: str = Field(
        default="https://s3.us-west-004.backblazeb2.com", env="B2_ENDPOINT"
    )

    # Generative AI Credentials
    GENBLAZE_API_KEY: str = Field(default="", env="GENBLAZE_API_KEY")
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY")

    # Host & Server Config
    HOST: str = Field(default="0.0.0.0", env="HOST")
    PORT: int = Field(default=8000, env="PORT")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
