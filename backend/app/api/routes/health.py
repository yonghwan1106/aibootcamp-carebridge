"""
AI 케어브릿지 - 헬스체크 API
"""
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """서버 상태 확인"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "ai-carebridge"
    }


@router.get("/ready")
async def readiness_check():
    """서비스 준비 상태 확인"""
    # TODO: Redis, Vector DB 연결 상태 확인
    return {
        "ready": True,
        "checks": {
            "database": "ok",
            "redis": "ok",
            "llm": "ok"
        }
    }
