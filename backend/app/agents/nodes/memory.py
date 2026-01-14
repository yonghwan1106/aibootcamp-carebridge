"""
AI 케어브릿지 - 기억 관리 노드
사용자 프로필 로드 및 대화 기록 저장을 담당합니다.
"""
from app.agents.state import AgentState, UserProfileData
import logging

logger = logging.getLogger(__name__)

# 임시 사용자 저장소 (추후 Redis로 교체)
USER_PROFILES = {
    "user_001": UserProfileData(
        user_id="user_001",
        name="김순자",
        age=75,
        address="서울 강북구",
        health_conditions=["고혈압", "당뇨", "무릎 관절염"],
        is_basic_pension=True,
        family_members=[
            {"relation": "아들", "name": "민수"},
            {"relation": "손녀", "name": "지은"}
        ]
    )
}


async def memory_load_node(state: AgentState) -> AgentState:
    """
    기억 로드 노드

    역할:
    1. 사용자 프로필 로드 (Redis/DB)
    2. 이전 대화 컨텍스트 복원
    3. 장기 기억 정보 가져오기

    Args:
        state: 현재 에이전트 상태

    Returns:
        업데이트된 상태 (user_profile 설정)
    """
    user_id = state.get("user_id", "")

    if not user_id:
        logger.warning("기억 로드: user_id가 비어있습니다")
        return state

    try:
        # TODO: Redis에서 사용자 프로필 로드
        # from app.memory.redis_store import get_user_profile
        # user_profile = await get_user_profile(user_id)

        # 임시: 메모리에서 로드
        user_profile = USER_PROFILES.get(user_id)

        if user_profile:
            logger.info(f"기억 로드 완료 - User: {user_id}, Name: {user_profile.get('name')}")
            return {
                **state,
                "user_profile": user_profile
            }
        else:
            # 새 사용자
            logger.info(f"새 사용자 - User: {user_id}")
            return state

    except Exception as e:
        logger.error(f"기억 로드 오류: {str(e)}")
        return {
            **state,
            "error": f"기억 로드 오류: {str(e)}"
        }


async def memory_save_node(state: AgentState) -> AgentState:
    """
    기억 저장 노드

    역할:
    1. 대화 내용 저장 (Redis/DB)
    2. 감정 분석 결과 기록
    3. 중요 정보 장기 기억에 저장

    Args:
        state: 현재 에이전트 상태

    Returns:
        상태 (변경 없음)
    """
    user_id = state.get("user_id", "")
    session_id = state.get("session_id", "")
    messages = state.get("messages", [])
    emotion_analysis = state.get("emotion_analysis", {})

    try:
        # TODO: Redis에 대화 기록 저장
        # from app.memory.redis_store import save_conversation
        # await save_conversation(user_id, session_id, messages)

        # 위험 상황 로그
        if emotion_analysis and emotion_analysis.get("risk_level", 0) >= 1:
            logger.warning(f"감정 위험 감지 기록 - User: {user_id}, Risk: {emotion_analysis.get('risk_level')}")

        # 대화 요약 (긴 대화의 경우)
        if len(messages) > 10:
            # TODO: 대화 요약 생성 및 저장
            pass

        logger.info(f"기억 저장 완료 - User: {user_id}, Session: {session_id}, Messages: {len(messages)}")

        return state

    except Exception as e:
        logger.error(f"기억 저장 오류: {str(e)}")
        return {
            **state,
            "error": f"기억 저장 오류: {str(e)}"
        }


# 테스트용 사용자 추가 함수
def add_test_user(user_id: str, profile: UserProfileData):
    """테스트용 사용자 추가"""
    USER_PROFILES[user_id] = profile
    logger.info(f"테스트 사용자 추가: {user_id}")
