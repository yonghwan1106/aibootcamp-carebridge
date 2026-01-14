"""
AI 케어브릿지 - 복지 전문 에이전트 노드
RAG 기반 복지 정보 검색 및 안내를 담당합니다.
"""
from langchain_upstage import ChatUpstage
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from app.agents.state import AgentState
from app.agents.prompts.welfare import WELFARE_SYSTEM_PROMPT
from app.services.rag import rag_service
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def _get_llm():
    """LLM 인스턴스 생성"""
    return ChatUpstage(
        api_key=settings.UPSTAGE_API_KEY,
        model=settings.UPSTAGE_MODEL
    )


async def welfare_node(state: AgentState) -> AgentState:
    """
    복지 전문 에이전트 노드

    역할:
    1. RAG로 복지 정보 검색
    2. 사용자 자격 요건 대조
    3. 맞춤형 복지 안내
    4. 신청 대행 지원

    Args:
        state: 현재 에이전트 상태

    Returns:
        업데이트된 상태 (응답 메시지 추가)
    """
    messages = state.get("messages", [])
    user_profile = state.get("user_profile", {})
    retrieved_docs = state.get("retrieved_docs", [])

    if not messages:
        return state

    last_message = messages[-1].content if messages else ""

    # 사용자 정보 추출
    user_name = user_profile.get("name", "어르신") if user_profile else "어르신"
    user_age = user_profile.get("age", 75) if user_profile else 75
    user_address = user_profile.get("address", "서울") if user_profile else "서울"
    income_level = user_profile.get("income_level", "중위소득") if user_profile else "중위소득"
    is_basic_pension = user_profile.get("is_basic_pension", False) if user_profile else False
    health_conditions = user_profile.get("health_conditions", []) if user_profile else []

    # RAG 검색으로 관련 복지 정보 조회
    try:
        rag_context = await rag_service.get_context_for_llm(last_message, n_results=3)
        logger.info(f"RAG 검색 완료: {last_message[:30]}...")
    except Exception as e:
        logger.warning(f"RAG 검색 실패, 기본 정보 사용: {e}")
        rag_context = """
        [기초연금]
        - 대상: 만 65세 이상, 소득인정액 기준 하위 70%
        - 지원금액: 월 최대 32.4만원
        - 신청방법: 주민센터 또는 국민연금공단
        """

    # 시스템 프롬프트 구성
    system_prompt = WELFARE_SYSTEM_PROMPT.format(
        user_name=user_name,
        user_age=user_age,
        user_address=user_address,
        income_level=income_level,
        is_basic_pension="예" if is_basic_pension else "아니오",
        health_conditions=", ".join(health_conditions) if health_conditions else "정보 없음",
        retrieved_docs=rag_context
    )

    try:
        llm = _get_llm()

        # LLM 호출
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"사용자 질문: {last_message}")
        ])

        # 응답 메시지 추가
        new_messages = list(messages)
        new_messages.append(AIMessage(content=response.content))

        logger.info(f"복지 에이전트 응답 생성 완료 - Query: {last_message[:50]}...")

        return {
            **state,
            "messages": new_messages,
            "retrieved_docs": [rag_context]
        }

    except Exception as e:
        logger.error(f"복지 에이전트 오류: {str(e)}")

        # 오류 시 기본 응답
        error_response = f"{user_name}, 죄송해요. 지금 복지 정보를 찾는 데 문제가 생겼어요. 잠시 후 다시 물어봐 주시겠어요?"
        new_messages = list(messages)
        new_messages.append(AIMessage(content=error_response))

        return {
            **state,
            "messages": new_messages,
            "error": str(e)
        }
