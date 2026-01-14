"""
AI 케어브릿지 - FastAPI 메인 애플리케이션
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api.routes import chat, voice, welfare, health

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # 시작 시 초기화
    logger.info(f"🚀 {settings.APP_NAME} 서버 시작")
    logger.info(f"📍 환경: {settings.APP_ENV}")

    # TODO: Redis 연결 초기화
    # TODO: Vector Store 초기화

    yield

    # 종료 시 정리
    logger.info(f"👋 {settings.APP_NAME} 서버 종료")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    AI 케어브릿지 - 초고령 사회를 위한 에이전틱(Agentic) AI 케어 플랫폼

    ## 주요 기능
    - 🎤 음성 기반 대화 인터페이스
    - 📋 복지 정보 검색 및 신청 대행
    - 💬 정서 케어 대화
    - 📍 생활 정보 안내
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])
app.include_router(welfare.router, prefix="/api/welfare", tags=["Welfare"])


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "message": "AI 케어브릿지에 오신 것을 환영합니다!"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
