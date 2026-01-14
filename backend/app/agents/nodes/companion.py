"""
AI 케어브릿지 - 정서 케어 에이전트 노드
따뜻한 대화와 정서적 지지를 담당합니다.
"""
from langchain_upstage import ChatUpstage
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from app.agents.state import AgentState
from app.agents.prompts.companion import COMPANION_SYSTEM_PROMPT
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def _get_llm():
    """LLM 인스턴스 생성"""
    return ChatUpstage(
        api_key=settings.UPSTAGE_API_KEY,
        model=settings.UPSTAGE_MODEL
    )


async def companion_node(state: AgentState) -> AgentState:
    """
    정서 케어 에이전트 노드

    역할:
    1. 공감적 대화 수행
    2. 회상 요법 기반 긍정적 대화 유도
    3. 위기 상황 감지 시 보호자 알림
    4. 장기 기억 활용한 개인화된 대화

    Args:
        state: 현재 에이전트 상태

    Returns:
        업데이트된 상태 (응답 메시지 추가)
    """
    messages = state.get("messages", [])
    user_profile = state.get("user_profile", {})
    emotion_analysis = state.get("emotion_analysis", {})

    if not messages:
        return state

    last_message = messages[-1].content if messages else ""

    # 사용자 정보 추출
    user_name = user_profile.get("name", "어르신") if user_profile else "어르신"
    family_info = ""
    if user_profile and user_profile.get("family_members"):
        family_info = ", ".join([f"{m.get('relation', '')} {m.get('name', '')}"
                                  for m in user_profile["family_members"]])

    # 감정 정보
    emotion_str = "중립"
    if emotion_analysis:
        emotion_str = f"{emotion_analysis.get('primary', '중립')} (위험도: {emotion_analysis.get('risk_level', 0)})"

    # 시스템 프롬프트 구성
    system_prompt = COMPANION_SYSTEM_PROMPT.format(
        user_name=user_name,
        family_info=family_info or "정보 없음",
        recent_emotion=emotion_str,
        interests="정보 없음"  # TODO: 장기 기억에서 가져오기
    )

    try:
        llm = _get_llm()

        # 위기 상황 체크
        risk_level = emotion_analysis.get("risk_level", 0) if emotion_analysis else 0

        if risk_level >= 2:
            # 위기 상황 - 특별 프롬프트
            crisis_prompt = f"""
위기 상황 감지! 사용자가 심각한 정서적 위기 상태입니다.

사용자 발화: "{last_message}"
감정 분석: {emotion_str}

다음 지침을 따라 응답하세요:
1. 먼저 따뜻하게 공감 표현
2. 안전 확인 질문
3. 자살예방상담전화 1393 안내
4. 혼자가 아니라는 메시지 전달

응답은 2-3문장으로 짧고 따뜻하게.
"""
            response = await llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=crisis_prompt)
            ])

            # TODO: 보호자 알림 전송
            logger.warning(f"위기 상황 감지! User: {state.get('user_id')}, Risk Level: {risk_level}")

        else:
            # 일반 대화
            response = await llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"""사용자 발화: "{last_message}"
감정 분석: {emotion_str}

위 정보를 바탕으로 따뜻하고 공감적인 응답을 해주세요.
응답은 2-3문장 이내로 짧게, 자연스러운 대화체로 작성하세요.
마지막에 질문을 넣어 대화를 이어가세요.""")
            ])

        # 응답 메시지 추가
        new_messages = list(messages)
        new_messages.append(AIMessage(content=response.content))

        logger.info(f"정서 케어 에이전트 응답 생성 완료 - Emotion: {emotion_str}")

        return {
            **state,
            "messages": new_messages
        }

    except Exception as e:
        logger.error(f"정서 케어 에이전트 오류: {str(e)}")

        # 오류 시 기본 응답
        error_response = f"{user_name}, 잠시 생각이 깊어졌어요. 다시 한번 말씀해 주시겠어요?"
        new_messages = list(messages)
        new_messages.append(AIMessage(content=error_response))

        return {
            **state,
            "messages": new_messages,
            "error": str(e)
        }
