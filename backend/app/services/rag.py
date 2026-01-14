"""
AI 케어브릿지 - RAG (Retrieval Augmented Generation) 서비스
복지 정보 검색 및 컨텍스트 생성
"""
import json
import os
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from app.services.vectorstore import vectorstore_service
from app.services.embedding import embedding_service
import logging

logger = logging.getLogger(__name__)

COLLECTION_NAME = "welfare_programs"
DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "welfare_programs.json")


@dataclass
class SearchResult:
    """검색 결과"""
    program_id: str
    name: str
    category: str
    description: str
    benefit: str
    eligibility: List[str]
    how_to_apply: str
    contact: str
    score: float  # 유사도 점수 (낮을수록 유사)


class RAGService:
    """복지 정보 RAG 서비스"""

    def __init__(self):
        self._initialized = False

    async def initialize(self) -> bool:
        """벡터 DB 초기화 및 데이터 로드"""
        if self._initialized:
            return True

        try:
            # 이미 데이터가 있는지 확인
            count = vectorstore_service.get_collection_count(COLLECTION_NAME)
            if count > 0:
                logger.info(f"기존 데이터 사용: {count}개 문서")
                self._initialized = True
                return True

            # 데이터 로드 및 인덱싱
            await self._load_and_index_data()
            self._initialized = True
            return True

        except Exception as e:
            logger.error(f"RAG 초기화 실패: {e}")
            return False

    async def _load_and_index_data(self) -> None:
        """복지 데이터 로드 및 인덱싱"""
        # JSON 파일 로드
        data_path = os.path.normpath(DATA_FILE)
        if not os.path.exists(data_path):
            logger.warning(f"데이터 파일 없음: {data_path}")
            return

        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        programs = data.get("programs", [])
        if not programs:
            logger.warning("복지 프로그램 데이터 없음")
            return

        # 문서 준비
        documents = []
        metadatas = []
        ids = []

        for program in programs:
            # 검색용 텍스트 생성
            doc_text = self._create_document_text(program)
            documents.append(doc_text)

            # 메타데이터
            metadatas.append({
                "id": program["id"],
                "name": program["name"],
                "category": program["category"],
                "target": program.get("target", ""),
                "contact": program.get("contact", "")
            })

            ids.append(program["id"])

        # 임베딩 생성
        logger.info(f"{len(documents)}개 문서 임베딩 생성 중...")
        embeddings = await embedding_service.embed_texts(documents)

        # 벡터 DB에 저장
        vectorstore_service.add_documents(
            collection_name=COLLECTION_NAME,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        logger.info(f"복지 데이터 인덱싱 완료: {len(documents)}개")

    def _create_document_text(self, program: Dict[str, Any]) -> str:
        """검색용 문서 텍스트 생성"""
        parts = [
            f"프로그램명: {program.get('name', '')}",
            f"분류: {program.get('category', '')}",
            f"대상: {program.get('target', '')}",
            f"설명: {program.get('description', '')}",
            f"혜택: {program.get('benefit', '')}",
            f"자격요건: {', '.join(program.get('eligibility', []))}",
            f"신청방법: {program.get('how_to_apply', '')}",
            f"연락처: {program.get('contact', '')}",
            f"키워드: {', '.join(program.get('keywords', []))}"
        ]
        return "\n".join(parts)

    async def search(
        self,
        query: str,
        n_results: int = 3,
        category: Optional[str] = None
    ) -> List[SearchResult]:
        """복지 정보 검색"""
        # 초기화 확인
        if not self._initialized:
            await self.initialize()

        # 쿼리 임베딩
        query_embedding = await embedding_service.embed_text(query)

        # 필터 조건
        where = None
        if category:
            where = {"category": category}

        # 검색
        results = vectorstore_service.query(
            collection_name=COLLECTION_NAME,
            query_embedding=query_embedding,
            n_results=n_results,
            where=where
        )

        # 결과 파싱
        search_results = []
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for doc, meta, dist in zip(documents, metadatas, distances):
            # 원본 데이터 로드
            program_data = self._get_program_by_id(meta.get("id", ""))
            if program_data:
                search_results.append(SearchResult(
                    program_id=program_data.get("id", ""),
                    name=program_data.get("name", ""),
                    category=program_data.get("category", ""),
                    description=program_data.get("description", ""),
                    benefit=program_data.get("benefit", ""),
                    eligibility=program_data.get("eligibility", []),
                    how_to_apply=program_data.get("how_to_apply", ""),
                    contact=program_data.get("contact", ""),
                    score=dist
                ))

        return search_results

    def _get_program_by_id(self, program_id: str) -> Optional[Dict[str, Any]]:
        """ID로 프로그램 정보 조회"""
        data_path = os.path.normpath(DATA_FILE)
        if not os.path.exists(data_path):
            return None

        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for program in data.get("programs", []):
            if program.get("id") == program_id:
                return program
        return None

    async def get_context_for_llm(
        self,
        query: str,
        n_results: int = 3
    ) -> str:
        """LLM에 전달할 컨텍스트 생성"""
        results = await self.search(query, n_results=n_results)

        if not results:
            return "관련 복지 정보를 찾지 못했습니다."

        context_parts = ["[관련 복지 정보]"]

        for i, result in enumerate(results, 1):
            context_parts.append(f"\n--- {i}. {result.name} ---")
            context_parts.append(f"분류: {result.category}")
            context_parts.append(f"설명: {result.description}")
            context_parts.append(f"혜택: {result.benefit}")
            context_parts.append(f"자격요건: {', '.join(result.eligibility)}")
            context_parts.append(f"신청방법: {result.how_to_apply}")
            context_parts.append(f"문의: {result.contact}")

        return "\n".join(context_parts)

    async def get_all_categories(self) -> List[str]:
        """모든 카테고리 목록"""
        data_path = os.path.normpath(DATA_FILE)
        if not os.path.exists(data_path):
            return []

        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        categories = set()
        for program in data.get("programs", []):
            if cat := program.get("category"):
                categories.add(cat)

        return sorted(list(categories))

    def reset_index(self) -> bool:
        """인덱스 리셋"""
        success = vectorstore_service.delete_collection(COLLECTION_NAME)
        self._initialized = False
        return success


# 싱글톤 인스턴스
rag_service = RAGService()
