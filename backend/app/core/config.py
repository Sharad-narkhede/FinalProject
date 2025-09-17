from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Smart Feedback Backend"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    database_url: str
    environment: str = "development"
    secret_key: str = "change-me-in-prod"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()

