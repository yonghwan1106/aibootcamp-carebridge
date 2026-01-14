"""
AI 케어브릿지 - 임베딩 서비스
Upstage Solar Embedding 또는 로컬 모델 사용
"""
import os
from typing import List, Optional
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class EmbeddingService:
    """텍스트 임베딩 서비스"""

    def __init__(self):
        self.api_key = settings.UPSTAGE_API_KEY
        self.model = "solar-embedding-1-large"
        self._upstage_embeddings = None
        self._local_model = None

    def _get_upstage_embeddings(self):
        """Upstage 임베딩 인스턴스 반환"""
        if self._upstage_embeddings is None:
            try:
                from langchain_upstage import UpstageEmbeddings
                self._upstage_embeddings = UpstageEmbeddings(
                    api_key=self.api_key,
                    model=self.model
                )
                logger.info("Upstage 임베딩 초기화 완료")
            except Exception as e:
                logger.error(f"Upstage 임베딩 초기화 실패: {e}")
                return None
        return self._upstage_embeddings

    async def embed_text(self, text: str) -> List[float]:
        """단일 텍스트 임베딩"""
        embeddings = await self.embed_texts([text])
        return embeddings[0] if embeddings else []

    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """여러 텍스트 임베딩"""
        if not texts:
            return []

        # API 키가 있으면 Upstage API 사용
        if self.api_key and self.api_key != "" and self.api_key != "your_upstage_api_key":
            return await self._embed_with_upstage(texts)

        # 없으면 로컬 모델 사용
        return self._embed_with_local(texts)

    async def _embed_with_upstage(self, texts: List[str]) -> List[List[float]]:
        """Upstage API로 임베딩 (langchain-upstage 사용)"""
        try:
            embeddings_model = self._get_upstage_embeddings()
            if embeddings_model is None:
                return self._embed_with_local(texts)

            # 비동기 임베딩
            embeddings = await embeddings_model.aembed_documents(texts)
            logger.info(f"Upstage 임베딩 성공: {len(texts)}개 텍스트")
            return embeddings

        except Exception as e:
            logger.error(f"Upstage 임베딩 실패: {e}")
            # 폴백: 로컬 모델
            return self._embed_with_local(texts)

    def _embed_with_local(self, texts: List[str]) -> List[List[float]]:
        """로컬 모델로 임베딩 (sentence-transformers)"""
        try:
            if self._local_model is None:
                from sentence_transformers import SentenceTransformer
                model_name = settings.EMBEDDING_MODEL
                logger.info(f"로컬 임베딩 모델 로딩: {model_name}")
                self._local_model = SentenceTransformer(model_name)

            embeddings = self._local_model.encode(
                texts,
                normalize_embeddings=True,
                show_progress_bar=False
            )
            return embeddings.tolist()

        except Exception as e:
            logger.error(f"로컬 임베딩 실패: {e}")
            # 최후의 폴백: 더미 임베딩
            return self._dummy_embedding(texts)

    def _dummy_embedding(self, texts: List[str], dim: int = 1024) -> List[List[float]]:
        """테스트용 더미 임베딩"""
        import hashlib
        embeddings = []
        for text in texts:
            # 텍스트 해시 기반 의사 랜덤 벡터
            hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
            embedding = [(hash_val >> i & 1) * 0.1 - 0.05 for i in range(dim)]
            # 정규화
            norm = sum(x*x for x in embedding) ** 0.5
            embedding = [x / norm for x in embedding]
            embeddings.append(embedding)
        return embeddings


# 싱글톤 인스턴스
embedding_service = EmbeddingService()
