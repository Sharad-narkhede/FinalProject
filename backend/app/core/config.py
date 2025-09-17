from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Smart Feedback Backend"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    database_url: str
    environment: str = "development"
    secret_key: str = "change-me-in-prod"
    access_token_expire_minutes: int = 60
    
    model_config = SettingsConfigDict(
        env_file=str((Path(__file__).resolve().parents[3] / ".env").absolute()),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

