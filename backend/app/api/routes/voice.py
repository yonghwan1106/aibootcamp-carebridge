"""
AI 케어브릿지 - 음성 처리 API
STT/TTS 통합 음성 인터페이스
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional
import logging
import io
import uuid

from app.services.stt import stt_service
from app.services.tts import tts_service

router = APIRouter()
logger = logging.getLogger(__name__)


class TTSRequest(BaseModel):
    """TTS 요청 모델"""
    text: str
    voice: str = "nova"
    speed: float = 0.9
    format: str = "mp3"


class STTResponse(BaseModel):
    """STT 응답 모델"""
    text: str
    language: str
    confidence: float
    duration_ms: Optional[int] = None


class VoiceConversationResponse(BaseModel):
    """음성 대화 응답 모델"""
    session_id: str
    user_text: str
    assistant_text: str
    confidence: float


@router.post("/stt", response_model=STTResponse)
async def speech_to_text(
    audio: UploadFile = File(..., description="오디오 파일 (wav, mp3, webm 등)"),
    language: str = Form(default="ko", description="언어 코드 (ko, en 등)")
):
    """
    음성을 텍스트로 변환 (STT)

    - Upstage Whisper API 사용 (우선)
    - OpenAI Whisper API 폴백
    - 로컬 Whisper 모델 폴백

    지원 형식: wav, mp3, webm, m4a, ogg
    """
    try:
        # 오디오 파일 읽기
        audio_bytes = await audio.read()
        filename = audio.filename or "audio.wav"

        logger.info(f"STT 요청 - File: {filename}, Size: {len(audio_bytes)} bytes, Lang: {language}")

        # STT 처리
        text, confidence = await stt_service.transcribe(
            audio_bytes=audio_bytes,
            language=language,
            filename=filename
        )

        return STTResponse(
            text=text,
            language=language,
            confidence=confidence
        )

    except Exception as e:
        logger.error(f"STT 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"음성 인식 실패: {str(e)}")


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    텍스트를 음성으로 변환 (TTS)

    - OpenAI TTS API 사용 (우선)
    - Edge TTS 폴백 (무료)

    음성 옵션:
    - alloy, echo, fable, onyx, nova, shimmer
    - 추천: nova (따뜻한 여성), onyx (차분한 남성)

    속도: 0.25 ~ 4.0 (노인 친화적 기본값: 0.9)
    """
    try:
        logger.info(f"TTS 요청 - Text: {request.text[:50]}..., Voice: {request.voice}, Speed: {request.speed}")

        # TTS 처리
        audio_bytes = await tts_service.synthesize(
            text=request.text,
            voice=request.voice,
            speed=request.speed,
            response_format=request.format
        )

        if not audio_bytes:
            raise HTTPException(status_code=500, detail="음성 합성 실패")

        # 적절한 MIME 타입 설정
        media_types = {
            "mp3": "audio/mpeg",
            "opus": "audio/opus",
            "aac": "audio/aac",
            "flac": "audio/flac",
            "wav": "audio/wav"
        }
        media_type = media_types.get(request.format, "audio/mpeg")

        return Response(
            content=audio_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename=speech.{request.format}",
                "Content-Length": str(len(audio_bytes))
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"TTS 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"음성 합성 실패: {str(e)}")


@router.post("/tts/senior")
async def text_to_speech_senior(
    text: str = Form(..., description="변환할 텍스트"),
    emotion: Optional[str] = Form(default=None, description="감정 (comfort, urgent, neutral)")
):
    """
    노인 친화적 TTS

    - 기본 속도 0.85 (약간 느리게)
    - 따뜻하고 명확한 음성
    - 감정에 따른 자동 조절
    """
    try:
        logger.info(f"노인용 TTS 요청 - Text: {text[:50]}..., Emotion: {emotion}")

        audio_bytes = await tts_service.synthesize_for_senior(
            text=text,
            emotion=emotion
        )

        if not audio_bytes:
            raise HTTPException(status_code=500, detail="음성 합성 실패")

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=response.mp3",
                "Content-Length": str(len(audio_bytes))
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"노인용 TTS 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"음성 합성 실패: {str(e)}")


@router.post("/conversation", response_model=VoiceConversationResponse)
async def voice_conversation(
    audio: UploadFile = File(..., description="사용자 음성"),
    user_id: str = Form(default="", description="사용자 ID"),
    session_id: Optional[str] = Form(default=None, description="세션 ID")
):
    """
    음성 대화 통합 API

    1. STT로 음성을 텍스트로 변환
    2. LangGraph 에이전트로 응답 생성 (TODO)
    3. TTS로 응답을 음성으로 변환

    응답에는 텍스트와 오디오 URL이 포함됩니다.
    """
    try:
        # 세션 ID 생성/유지
        current_session = session_id or str(uuid.uuid4())

        # 1. STT 처리
        audio_bytes = await audio.read()
        user_text, confidence = await stt_service.transcribe(
            audio_bytes=audio_bytes,
            language="ko",
            filename=audio.filename or "audio.wav"
        )

        logger.info(f"음성 대화 - User: {user_text[:50]}..., Conf: {confidence:.2f}")

        # 2. AI 응답 생성 (TODO: LangGraph 에이전트 연동)
        # from app.agents.graph import carebridge_graph
        # response = await carebridge_graph.ainvoke(...)
        assistant_text = f"안녕하세요! '{user_text}'에 대해 도움을 드릴게요. 어떤 것이 궁금하신가요?"

        # 3. TTS는 별도 엔드포인트로 처리 (클라이언트에서 호출)
        # 이유: 응답 텍스트를 먼저 보여주고, 음성은 비동기로 로드

        return VoiceConversationResponse(
            session_id=current_session,
            user_text=user_text,
            assistant_text=assistant_text,
            confidence=confidence
        )

    except Exception as e:
        logger.error(f"음성 대화 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"음성 대화 처리 실패: {str(e)}")


@router.get("/voices")
async def get_available_voices():
    """사용 가능한 음성 목록"""
    return tts_service.get_available_voices()


@router.get("/health")
async def voice_health():
    """음성 서비스 상태 확인"""
    return {
        "stt": {
            "upstage": bool(stt_service.upstage_api_key),
            "openai": bool(stt_service.openai_api_key),
            "local": True  # Whisper 설치 여부와 무관하게 폴백 가능
        },
        "tts": {
            "openai": bool(tts_service.openai_api_key),
            "edge_tts": True  # 항상 사용 가능
        }
    }
