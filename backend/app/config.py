"""
AI 케어브릿지 - 환경 설정
"""
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """애플리케이션 설정"""

    # App
    APP_NAME: str = "AI-CareBridge"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # LLM (Upstage Solar Pro 2)
    UPSTAGE_API_KEY: str = ""  # 테스트용 기본값, 실제 운영시 필수 설정
    UPSTAGE_MODEL: str = "solar-pro2"
    UPSTAGE_BASE_URL: str = "https://api.upstage.ai/v1/solar"

    # OpenAI (TTS/Whisper fallback)
    OPENAI_API_KEY: str = ""

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PASSWORD: str = ""

    # Vector DB
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-large"

    # External APIs
    WELFARE_API_KEY: str = ""
    WEATHER_API_KEY: str = ""
    HOSPITAL_API_KEY: str = ""

    # Security
    JWT_SECRET: str = "change-this-secret-key"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # .env의 추가 변수 무시


@lru_cache()
def get_settings() -> Settings:
    """설정 싱글톤 인스턴스 반환"""
    return Settings()


settings = get_settings()
