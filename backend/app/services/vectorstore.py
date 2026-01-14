"""
AI 케어브릿지 - ChromaDB 벡터 저장소 서비스
"""
import os
from typing import List, Optional, Dict, Any
from chromadb import Client, Settings as ChromaSettings
from chromadb.config import Settings as ChromaConfig
import chromadb
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class VectorStoreService:
    """ChromaDB 벡터 저장소 관리"""

    _instance: Optional['VectorStoreService'] = None
    _client: Optional[chromadb.ClientAPI] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._client is None:
            self._initialize_client()

    def _initialize_client(self):
        """ChromaDB 클라이언트 초기화"""
        persist_dir = settings.CHROMA_PERSIST_DIR

        # 디렉토리 생성
        os.makedirs(persist_dir, exist_ok=True)

        # ChromaDB 클라이언트 설정
        self._client = chromadb.PersistentClient(
            path=persist_dir,
            settings=ChromaConfig(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        logger.info(f"ChromaDB 초기화 완료: {persist_dir}")

    @property
    def client(self) -> chromadb.ClientAPI:
        """ChromaDB 클라이언트 반환"""
        if self._client is None:
            self._initialize_client()
        return self._client

    def get_or_create_collection(
        self,
        name: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> chromadb.Collection:
        """컬렉션 가져오기 또는 생성"""
        return self.client.get_or_create_collection(
            name=name,
            metadata=metadata or {"hnsw:space": "cosine"}
        )

    def delete_collection(self, name: str) -> bool:
        """컬렉션 삭제"""
        try:
            self.client.delete_collection(name)
            logger.info(f"컬렉션 삭제됨: {name}")
            return True
        except Exception as e:
            logger.error(f"컬렉션 삭제 실패: {e}")
            return False

    def list_collections(self) -> List[str]:
        """모든 컬렉션 목록"""
        collections = self.client.list_collections()
        return [c.name for c in collections]

    def add_documents(
        self,
        collection_name: str,
        documents: List[str],
        embeddings: List[List[float]],
        metadatas: Optional[List[Dict[str, Any]]] = None,
        ids: Optional[List[str]] = None
    ) -> bool:
        """문서 추가"""
        try:
            collection = self.get_or_create_collection(collection_name)

            # ID 자동 생성
            if ids is None:
                existing_count = collection.count()
                ids = [f"doc_{existing_count + i}" for i in range(len(documents))]

            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"{len(documents)}개 문서 추가됨 -> {collection_name}")
            return True
        except Exception as e:
            logger.error(f"문서 추가 실패: {e}")
            return False

    def query(
        self,
        collection_name: str,
        query_embedding: List[float],
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None,
        include: List[str] = ["documents", "metadatas", "distances"]
    ) -> Dict[str, Any]:
        """유사 문서 검색"""
        try:
            collection = self.get_or_create_collection(collection_name)

            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where,
                include=include
            )
            return results
        except Exception as e:
            logger.error(f"검색 실패: {e}")
            return {"documents": [[]], "metadatas": [[]], "distances": [[]]}

    def get_collection_count(self, collection_name: str) -> int:
        """컬렉션 문서 수"""
        try:
            collection = self.get_or_create_collection(collection_name)
            return collection.count()
        except Exception:
            return 0


# 싱글톤 인스턴스
vectorstore_service = VectorStoreService()
