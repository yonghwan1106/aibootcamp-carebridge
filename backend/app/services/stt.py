"""
AI 케어브릿지 - STT (Speech-to-Text) 서비스
Upstage Whisper API 또는 OpenAI Whisper 사용
"""
import os
import tempfile
from typing import Optional, Tuple
import httpx
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class STTService:
    """음성-텍스트 변환 서비스"""

    def __init__(self):
        self.upstage_api_key = settings.UPSTAGE_API_KEY
        self.openai_api_key = settings.OPENAI_API_KEY
        self.upstage_base_url = "https://api.upstage.ai/v1/solar"
        self.openai_base_url = "https://api.openai.com/v1"

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: str = "ko",
        filename: str = "audio.wav"
    ) -> Tuple[str, float]:
        """
        음성을 텍스트로 변환

        Args:
            audio_bytes: 오디오 바이트 데이터
            language: 언어 코드 (기본: ko)
            filename: 파일명 (확장자로 형식 판단)

        Returns:
            (변환된 텍스트, 신뢰도 점수)
        """
        # Upstage API 우선 사용
        if self.upstage_api_key:
            try:
                return await self._transcribe_upstage(audio_bytes, language, filename)
            except Exception as e:
                logger.warning(f"Upstage STT 실패, OpenAI 폴백: {e}")

        # OpenAI Whisper API 폴백
        if self.openai_api_key:
            try:
                return await self._transcribe_openai(audio_bytes, language, filename)
            except Exception as e:
                logger.warning(f"OpenAI STT 실패: {e}")

        # 로컬 Whisper 폴백
        return await self._transcribe_local(audio_bytes, language)

    async def _transcribe_upstage(
        self,
        audio_bytes: bytes,
        language: str,
        filename: str
    ) -> Tuple[str, float]:
        """Upstage Whisper API로 변환"""
        async with httpx.AsyncClient(timeout=60.0) as client:
            # 멀티파트 폼 데이터 구성
            files = {
                "file": (filename, audio_bytes, "audio/wav"),
            }
            data = {
                "model": "whisper-1",
                "language": language
            }

            response = await client.post(
                f"{self.upstage_base_url}/audio/transcriptions",
                headers={"Authorization": f"Bearer {self.upstage_api_key}"},
                files=files,
                data=data
            )
            response.raise_for_status()
            result = response.json()

            text = result.get("text", "")
            confidence = 0.95  # Upstage는 신뢰도를 반환하지 않음

            logger.info(f"Upstage STT 성공: {len(text)} chars")
            return text, confidence

    async def _transcribe_openai(
        self,
        audio_bytes: bytes,
        language: str,
        filename: str
    ) -> Tuple[str, float]:
        """OpenAI Whisper API로 변환"""
        async with httpx.AsyncClient(timeout=60.0) as client:
            files = {
                "file": (filename, audio_bytes, "audio/wav"),
            }
            data = {
                "model": "whisper-1",
                "language": language,
                "response_format": "verbose_json"
            }

            response = await client.post(
                f"{self.openai_base_url}/audio/transcriptions",
                headers={"Authorization": f"Bearer {self.openai_api_key}"},
                files=files,
                data=data
            )
            response.raise_for_status()
            result = response.json()

            text = result.get("text", "")
            # verbose_json은 segments에 avg_logprob 포함
            segments = result.get("segments", [])
            if segments:
                avg_logprob = sum(s.get("avg_logprob", -0.5) for s in segments) / len(segments)
                # logprob을 신뢰도로 변환 (대략적인 변환)
                confidence = min(1.0, max(0.0, 1.0 + avg_logprob / 2))
            else:
                confidence = 0.9

            logger.info(f"OpenAI STT 성공: {len(text)} chars, conf: {confidence:.2f}")
            return text, confidence

    async def _transcribe_local(
        self,
        audio_bytes: bytes,
        language: str
    ) -> Tuple[str, float]:
        """로컬 Whisper 모델로 변환 (폴백)"""
        try:
            import whisper
            import numpy as np
            import io
            from scipy.io import wavfile

            # 임시 파일로 저장
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                f.write(audio_bytes)
                temp_path = f.name

            try:
                # Whisper 모델 로드 (최초 1회)
                model = whisper.load_model("base")  # 가벼운 모델 사용

                # 변환
                result = model.transcribe(
                    temp_path,
                    language=language,
                    fp16=False
                )

                text = result.get("text", "").strip()
                confidence = 0.85  # 로컬 모델은 낮은 신뢰도

                logger.info(f"로컬 Whisper STT 성공: {len(text)} chars")
                return text, confidence

            finally:
                # 임시 파일 삭제
                os.unlink(temp_path)

        except ImportError:
            logger.error("Whisper 라이브러리가 설치되지 않음")
            return "[음성 인식 서비스를 사용할 수 없습니다]", 0.0
        except Exception as e:
            logger.error(f"로컬 Whisper 오류: {e}")
            return "[음성 인식 오류]", 0.0


# 싱글톤 인스턴스
stt_service = STTService()
