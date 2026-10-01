from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Rushi Food Ordering API"
    app_env: str = "development"
    app_debug: bool = False
    api_v1_prefix: str = "/api/v1"
    database_url: str = "mysql+pymysql://rushi_app:change-me@localhost:3306/food_ordering_db?charset=utf8mb4"
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore", case_sensitive=False)

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
