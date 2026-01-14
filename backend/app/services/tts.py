"""
AI 케어브릿지 - TTS (Text-to-Speech) 서비스
OpenAI TTS API 또는 Edge TTS 사용
"""
import asyncio
from typing import Optional, Literal
import httpx
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# 지원하는 음성 목록
VoiceType = Literal["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

# 한국어 친화적 음성 매핑
KOREAN_FRIENDLY_VOICES = {
    "female_warm": "nova",      # 따뜻한 여성 음성 (노인 친화적)
    "female_calm": "shimmer",   # 차분한 여성 음성
    "male_warm": "onyx",        # 따뜻한 남성 음성
    "male_calm": "echo",        # 차분한 남성 음성
    "default": "nova"           # 기본 음성
}


class TTSService:
    """텍스트-음성 변환 서비스"""

    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.openai_base_url = "https://api.openai.com/v1"

    async def synthesize(
        self,
        text: str,
        voice: str = "nova",
        speed: float = 0.9,
        response_format: str = "mp3"
    ) -> bytes:
        """
        텍스트를 음성으로 변환

        Args:
            text: 변환할 텍스트
            voice: 음성 유형 (alloy, echo, fable, onyx, nova, shimmer)
            speed: 속도 (0.25 ~ 4.0, 기본 0.9 - 노인 친화적)
            response_format: 출력 형식 (mp3, opus, aac, flac)

        Returns:
            오디오 바이트 데이터
        """
        # 음성 이름 매핑
        if voice in KOREAN_FRIENDLY_VOICES:
            voice = KOREAN_FRIENDLY_VOICES[voice]

        # OpenAI TTS API 사용
        if self.openai_api_key:
            try:
                return await self._synthesize_openai(text, voice, speed, response_format)
            except Exception as e:
                logger.warning(f"OpenAI TTS 실패: {e}")

        # Edge TTS 폴백 (무료)
        try:
            return await self._synthesize_edge_tts(text, speed)
        except Exception as e:
            logger.warning(f"Edge TTS 실패: {e}")

        # 최종 폴백: 빈 오디오 반환
        logger.error("모든 TTS 서비스 실패")
        return b""

    async def _synthesize_openai(
        self,
        text: str,
        voice: str,
        speed: float,
        response_format: str
    ) -> bytes:
        """OpenAI TTS API로 변환"""
        # 속도 범위 제한
        speed = max(0.25, min(4.0, speed))

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.openai_base_url}/audio/speech",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "tts-1",  # tts-1-hd for higher quality
                    "input": text,
                    "voice": voice,
                    "speed": speed,
                    "response_format": response_format
                }
            )
            response.raise_for_status()

            audio_bytes = response.content
            logger.info(f"OpenAI TTS 성공: {len(text)} chars -> {len(audio_bytes)} bytes")
            return audio_bytes

    async def _synthesize_edge_tts(
        self,
        text: str,
        speed: float = 0.9
    ) -> bytes:
        """Edge TTS로 변환 (무료 대안)"""
        try:
            import edge_tts

            # 한국어 음성 선택
            voice = "ko-KR-SunHiNeural"  # 한국어 여성 음성

            # 속도 조절 (rate 형식: +0%, -10%, etc)
            rate_percent = int((speed - 1.0) * 100)
            rate = f"{rate_percent:+d}%"

            # TTS 생성
            communicate = edge_tts.Communicate(text, voice, rate=rate)

            # 오디오 데이터 수집
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]

            logger.info(f"Edge TTS 성공: {len(text)} chars -> {len(audio_data)} bytes")
            return audio_data

        except ImportError:
            logger.error("edge-tts 라이브러리가 설치되지 않음")
            raise
        except Exception as e:
            logger.error(f"Edge TTS 오류: {e}")
            raise

    async def synthesize_for_senior(
        self,
        text: str,
        emotion: Optional[str] = None
    ) -> bytes:
        """
        노인 친화적 음성 합성

        - 기본 속도 0.85 (약간 느리게)
        - 따뜻한 음성 사용
        - 감정에 따른 음성 조절
        """
        # 감정에 따른 음성 선택
        if emotion == "comfort":
            voice = "nova"  # 따뜻하고 부드러운 음성
            speed = 0.8
        elif emotion == "urgent":
            voice = "onyx"  # 명확한 음성
            speed = 0.95
        else:
            voice = "nova"
            speed = 0.85

        return await self.synthesize(text, voice=voice, speed=speed)

    def get_available_voices(self) -> dict:
        """사용 가능한 음성 목록 반환"""
        return {
            "openai": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
            "edge_tts_korean": [
                "ko-KR-SunHiNeural",   # 여성
                "ko-KR-InJoonNeural",  # 남성
                "ko-KR-HyunsuNeural",  # 남성
            ],
            "recommended_for_senior": {
                "female": "nova",
                "male": "onyx"
            }
        }


# 싱글톤 인스턴스
tts_service = TTSService()
