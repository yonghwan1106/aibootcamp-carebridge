"""
AI 케어브릿지 - 슈퍼바이저 노드
의도 분류 및 감정 분석을 담당합니다.
"""
from langchain_upstage import ChatUpstage
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.agents.state import AgentState, EmotionData
from app.agents.prompts.supervisor import SUPERVISOR_SYSTEM_PROMPT
from app.config import settings
import json
import re
import logging

logger = logging.getLogger(__name__)


def _get_llm():
    """LLM 인스턴스 생성"""
    return ChatUpstage(
        api_key=settings.UPSTAGE_API_KEY,
        model=settings.UPSTAGE_MODEL
    )


def _extract_json(text: str) -> dict:
    """LLM 응답에서 JSON 추출"""
    # 마크다운 코드 블록에서 JSON 추출
    json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if json_match:
        text = json_match.group(1).strip()

    # {...} 패턴 찾기
    brace_match = re.search(r'\{[\s\S]*\}', text)
    if brace_match:
        text = brace_match.group(0)

    return json.loads(text)


def _keyword_fallback(message: str) -> str:
    """키워드 기반 폴백 라우팅"""
    lower_msg = message.lower()

    # 복지 관련 키워드
    welfare_keywords = ["복지", "지원", "혜택", "연금", "수당", "보조금", "신청", "자격"]
    if any(kw in lower_msg for kw in welfare_keywords):
        return "welfare"

    # 일상 정보 키워드
    daily_keywords = ["날씨", "병원", "약국", "일정", "예약", "시간"]
    if any(kw in lower_msg for kw in daily_keywords):
        return "daily"

    # 종료 키워드
    end_keywords = ["잘가", "끝", "종료", "나중에"]
    if any(kw in lower_msg for kw in end_keywords):
        return "end"

    return "companion"


def _build_user_context(profile: dict) -> str:
    """사용자 컨텍스트 문자열 생성"""
    if not profile:
        return "사용자 정보 없음"

    parts = []
    if profile.get("name"):
        parts.append(f"이름: {profile['name']}")
    if profile.get("age"):
        parts.append(f"나이: {profile['age']}세")
    if profile.get("health_conditions"):
        conditions = ", ".join(profile["health_conditions"])
        parts.append(f"건강상태: {conditions}")
    if profile.get("is_basic_pension"):
        parts.append("기초연금 수급자")

    return ", ".join(parts) if parts else "상세 정보 없음"


async def supervisor_node(state: AgentState) -> AgentState:
    """
    슈퍼바이저 노드
    """
    messages = state.get("messages", [])
    user_profile = state.get("user_profile", {})

    if not messages:
        logger.warning("슈퍼바이저: 메시지가 비어있습니다")
        return {
            **state,
            "current_agent": "companion",
            "error": "메시지가 비어있습니다"
        }

    last_message = messages[-1].content if messages else ""
    user_name = user_profile.get("name", "어르신") if user_profile else "어르신"

    # 시스템 프롬프트 구성
    system_prompt = SUPERVISOR_SYSTEM_PROMPT.format(
        user_name=user_name,
        user_context=_build_user_context(user_profile)
    )

    try:
        llm = _get_llm()

        # LLM 호출 (의도 분류 + 감정 분석)
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f'''다음 사용자 발화를 분석해주세요:

발화: "{last_message}"

반드시 아래 JSON 형식만 출력하세요:
{{"intent": "welfare", "intent_confidence": 0.9, "emotion": {{"primary": "neutral", "confidence": 0.8, "risk_level": 0, "keywords": []}}, "greeting_response": ""}}

intent: welfare(복지정보), companion(정서케어), daily(일상정보), end(대화종료)''')
        ])

        # 응답 파싱 (JSON 추출 함수 사용)
        result = _extract_json(response.content)
        intent = result.get("intent", "companion")
        emotion_data = result.get("emotion", {})
        greeting = result.get("greeting_response")

        # 감정 분석 결과 생성
        emotion_analysis: EmotionData = {
            "primary": emotion_data.get("primary", "neutral"),
            "confidence": emotion_data.get("confidence", 0.5),
            "risk_level": emotion_data.get("risk_level", 0),
            "keywords": emotion_data.get("keywords", [])
        }

        new_messages = list(messages)
        if greeting:
            new_messages.append(AIMessage(content=greeting))

        logger.info(f"슈퍼바이저 분류 결과 - Intent: {intent}, Emotion: {emotion_analysis['primary']}, Risk: {emotion_analysis['risk_level']}")

        return {
            **state,
            "messages": new_messages,
            "current_agent": intent,
            "emotion_analysis": emotion_analysis
        }

    except json.JSONDecodeError as e:
        logger.error(f"슈퍼바이저 JSON 파싱 오류: {str(e)}")
        fallback_intent = _keyword_fallback(last_message)
        logger.info(f"키워드 폴백 라우팅: {fallback_intent}")
        return {
            **state,
            "current_agent": fallback_intent,
            "error": f"JSON 파싱 오류, 키워드 폴백: {fallback_intent}"
        }
    except Exception as e:
        logger.error(f"슈퍼바이저 오류: {str(e)}")
        return {
            **state,
            "current_agent": "companion",
            "error": str(e)
        }
