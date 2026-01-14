"""
AI 케어브릿지 - 복지 정보 API (RAG 기반)
"""
from fastapi import APIRouter, HTTPException
from typing import Optional, List
from pydantic import BaseModel
import logging

from app.models.welfare import (
    WelfareSearchRequest,
    WelfareSearchResponse,
    WelfareProgram,
    WelfareEligibility,
    WelfareCategory
)
from app.services.rag import rag_service

router = APIRouter()
logger = logging.getLogger(__name__)


class RAGSearchRequest(BaseModel):
    """RAG 검색 요청"""
    query: str
    n_results: int = 3
    category: Optional[str] = None


class RAGSearchResult(BaseModel):
    """RAG 검색 결과"""
    program_id: str
    name: str
    category: str
    description: str
    benefit: str
    eligibility: List[str]
    how_to_apply: str
    contact: str
    score: float

# 샘플 복지 데이터 (추후 RAG로 교체)
SAMPLE_WELFARE_PROGRAMS = [
    WelfareProgram(
        id="energy-voucher-2026",
        name="에너지바우처",
        category=WelfareCategory.ENERGY,
        description="저소득층 가구의 난방비 지원",
        benefit_amount="연간 최대 18.6만원",
        benefit_type="바우처",
        age_min=65,
        income_criteria="기초생활수급자, 차상위계층",
        required_conditions=["기초생활수급자 또는 차상위계층", "만 65세 이상"],
        application_method="주민센터 방문 또는 온라인 신청",
        application_url="https://www.bokjiro.go.kr",
        agency="한국에너지공단",
        source_url="https://www.bokjiro.go.kr"
    ),
    WelfareProgram(
        id="basic-pension-2026",
        name="기초연금",
        category=WelfareCategory.LIVING,
        description="어르신의 안정적인 노후생활 지원",
        benefit_amount="월 최대 32.4만원",
        benefit_type="현금",
        age_min=65,
        income_criteria="소득인정액 기준 하위 70%",
        required_conditions=["만 65세 이상", "소득인정액 기준 충족"],
        application_method="주민센터 방문 또는 복지로 온라인 신청",
        application_url="https://www.bokjiro.go.kr",
        agency="국민연금공단",
        source_url="https://www.bokjiro.go.kr"
    )
]


@router.post("/search", response_model=WelfareSearchResponse)
async def search_welfare(request: WelfareSearchRequest):
    """
    복지 정보 검색

    - RAG 기반 벡터 검색
    - 사용자 자격 요건 대조
    """
    try:
        # TODO: RAG 검색 구현
        # from app.rag.retriever import welfare_retriever
        # results = await welfare_retriever.search(request.query)

        # 샘플 응답
        results = []
        for program in SAMPLE_WELFARE_PROGRAMS:
            if request.query.lower() in program.name.lower() or \
               request.query.lower() in program.description.lower():
                results.append(WelfareEligibility(
                    program=program,
                    is_eligible=True,
                    match_score=0.85,
                    matched_conditions=["나이 조건 충족"],
                    missing_conditions=[],
                    recommendation_reason=f"{program.name}을(를) 신청하실 수 있습니다."
                ))

        # 검색어가 없으면 전체 반환
        if not results and not request.query:
            results = [
                WelfareEligibility(
                    program=p,
                    is_eligible=True,
                    match_score=0.7,
                    matched_conditions=[],
                    missing_conditions=[],
                    recommendation_reason="확인이 필요합니다."
                ) for p in SAMPLE_WELFARE_PROGRAMS
            ]

        logger.info(f"Welfare search - Query: {request.query}, Results: {len(results)}")

        return WelfareSearchResponse(
            results=results[:request.limit],
            total_count=len(results),
            query=request.query
        )

    except Exception as e:
        logger.error(f"Welfare search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/programs")
async def list_welfare_programs(
    category: Optional[WelfareCategory] = None,
    limit: int = 10
):
    """모든 복지 프로그램 목록 조회"""
    programs = SAMPLE_WELFARE_PROGRAMS
    if category:
        programs = [p for p in programs if p.category == category]
    return {
        "programs": programs[:limit],
        "total_count": len(programs)
    }


@router.get("/programs/{program_id}")
async def get_welfare_program(program_id: str):
    """특정 복지 프로그램 상세 조회"""
    for program in SAMPLE_WELFARE_PROGRAMS:
        if program.id == program_id:
            return program
    raise HTTPException(status_code=404, detail="복지 프로그램을 찾을 수 없습니다.")


@router.post("/apply/{program_id}")
async def apply_welfare(program_id: str, user_id: str):
    """
    복지 신청 대행

    - 사용자 정보로 신청서 자동 작성
    - 필요 서류 안내
    """
    # TODO: 실제 복지 신청 API 연동
    return {
        "status": "pending",
        "program_id": program_id,
        "user_id": user_id,
        "message": "복지 신청이 접수되었습니다. 담당자 확인 후 안내드리겠습니다.",
        "required_documents": ["신분증 사본", "소득증명서"]
    }


# === RAG 기반 검색 API ===

@router.post("/rag/search")
async def rag_search(request: RAGSearchRequest):
    """
    RAG 기반 복지 정보 검색

    벡터 유사도 검색으로 관련 복지 프로그램을 찾습니다.
    """
    try:
        results = await rag_service.search(
            query=request.query,
            n_results=request.n_results,
            category=request.category
        )

        return {
            "query": request.query,
            "results": [
                RAGSearchResult(
                    program_id=r.program_id,
                    name=r.name,
                    category=r.category,
                    description=r.description,
                    benefit=r.benefit,
                    eligibility=r.eligibility,
                    how_to_apply=r.how_to_apply,
                    contact=r.contact,
                    score=r.score
                ) for r in results
            ],
            "total": len(results)
        }
    except Exception as e:
        logger.error(f"RAG 검색 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rag/categories")
async def get_categories():
    """복지 프로그램 카테고리 목록"""
    try:
        categories = await rag_service.get_all_categories()
        return {"categories": categories}
    except Exception as e:
        logger.error(f"카테고리 조회 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rag/initialize")
async def initialize_rag():
    """RAG 시스템 초기화 (데이터 인덱싱)"""
    try:
        success = await rag_service.initialize()
        return {
            "status": "success" if success else "failed",
            "message": "RAG 시스템이 초기화되었습니다." if success else "초기화 실패"
        }
    except Exception as e:
        logger.error(f"RAG 초기화 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/rag/reset")
async def reset_rag():
    """RAG 인덱스 리셋"""
    try:
        success = rag_service.reset_index()
        return {
            "status": "success" if success else "failed",
            "message": "RAG 인덱스가 리셋되었습니다."
        }
    except Exception as e:
        logger.error(f"RAG 리셋 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))
