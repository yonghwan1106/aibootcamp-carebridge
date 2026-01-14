"""
AI 케어브릿지 - 생활 정보 에이전트 노드
날씨, 뉴스, 일정, 병원 예약 등 생활 정보를 담당합니다.
"""
from langchain_upstage import ChatUpstage
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from app.agents.state import AgentState
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def _get_llm():
    """LLM 인스턴스 생성"""
    return ChatUpstage(
        api_key=settings.UPSTAGE_API_KEY,
        model=settings.UPSTAGE_MODEL
    )


DAILY_SYSTEM_PROMPT = """당신은 AI 케어브릿지의 생활 도우미입니다.
시니어 사용자에게 날씨, 뉴스, 일정, 병원 예약 등 생활 정보를 안내합니다.

## 사용자 정보
- 이름: {user_name}
- 주소: {user_address}
- 단골 병원: {preferred_hospital}

## 제공 가능한 서비스
1. **날씨 안내**: 오늘/내일/주간 날씨, 미세먼지
2. **뉴스 요약**: 주요 뉴스 간단 요약
3. **병원 예약**: 병원 예약 대행
4. **일정 관리**: 약 복용 시간, 병원 방문 일정 알림
5. **택시 호출**: 카카오택시 호출 안내

## 응답 지침
- 정보는 간단명료하게
- 필요 시 외부 API 호출 (Tool Use)
- 복잡한 정보는 핵심만 요약
- 후속 질문으로 추가 도움 제안

## 현재 정보 (샘플)
{current_info}
"""


async def daily_node(state: AgentState) -> AgentState:
    """
    생활 정보 에이전트 노드

    역할:
    1. 날씨, 뉴스 등 생활 정보 제공
    2. 병원 예약 대행
    3. 일정 관리 및 알림

    Args:
        state: 현재 에이전트 상태

    Returns:
        업데이트된 상태 (응답 메시지 추가)
    """
    messages = state.get("messages", [])
    user_profile = state.get("user_profile", {})

    if not messages:
        return state

    last_message = messages[-1].content if messages else ""

    # 사용자 정보 추출
    user_name = user_profile.get("name", "어르신") if user_profile else "어르신"
    user_address = user_profile.get("address", "서울") if user_profile else "서울"
    preferred_hospital = user_profile.get("preferred_hospital", "가까운 병원") if user_profile else "가까운 병원"

    # TODO: 실제 API 호출 (날씨, 뉴스 등)
    # 샘플 정보
    current_info = """
    [오늘의 날씨 - 서울]
    - 현재: 맑음, 기온 -3°C
    - 체감온도: -8°C (바람이 차요)
    - 미세먼지: 보통
    - 내일: 흐림, 눈 올 수 있음

    [오늘의 주요 뉴스]
    - 전국 한파 특보, 건강관리 유의
    - 기초연금 인상안 국회 통과
    """

    # 시스템 프롬프트 구성
    system_prompt = DAILY_SYSTEM_PROMPT.format(
        user_name=user_name,
        user_address=user_address,
        preferred_hospital=preferred_hospital,
        current_info=current_info
    )

    try:
        llm = _get_llm()

        # LLM 호출
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"""사용자 질문: "{last_message}"

위 정보를 바탕으로 친절하게 답변해주세요.
필요한 정보가 없으면 "확인 후 알려드릴게요"라고 답변하세요.
응답은 간단명료하게 2-3문장으로.""")
        ])

        # 응답 메시지 추가
        new_messages = list(messages)
        new_messages.append(AIMessage(content=response.content))

        logger.info(f"생활 정보 에이전트 응답 생성 완료 - Query: {last_message[:30]}...")

        return {
            **state,
            "messages": new_messages
        }

    except Exception as e:
        logger.error(f"생활 정보 에이전트 오류: {str(e)}")

        # 오류 시 기본 응답
        error_response = f"{user_name}, 지금 정보를 가져오는 데 문제가 생겼어요. 잠시 후 다시 물어봐 주시겠어요?"
        new_messages = list(messages)
        new_messages.append(AIMessage(content=error_response))

        return {
            **state,
            "messages": new_messages,
            "error": str(e)
        }
