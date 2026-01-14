"""
AI 케어브릿지 - LangGraph AgentState 정의
"""
from typing import TypedDict, Annotated, List, Optional, Literal
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class EmotionData(TypedDict, total=False):
    """감정 분석 데이터"""
    primary: str        # happy, neutral, sad, anxious, angry, lonely
    confidence: float   # 0.0 ~ 1.0
    risk_level: int     # 0: 정상, 1: 주의, 2: 위험
    keywords: List[str]


class UserProfileData(TypedDict, total=False):
    """사용자 프로필 데이터"""
    user_id: str
    name: str
    age: int
    address: str
    health_conditions: List[str]
    is_basic_pension: bool
    family_members: List[dict]


class AgentState(TypedDict):
    """
    LangGraph 멀티 에이전트 상태 정의

    이 상태는 모든 에이전트 노드 간에 공유됩니다.
    """

    # === 메시지 히스토리 ===
    # add_messages 어노테이션으로 자동 누적
    messages: Annotated[List[BaseMessage], add_messages]

    # === 현재 활성 에이전트 ===
    # supervisor가 분류한 다음 에이전트
    current_agent: Literal["supervisor", "welfare", "companion", "daily", "end"]

    # === 사용자 정보 ===
    user_id: str
    user_profile: Optional[UserProfileData]

    # === 세션 정보 ===
    session_id: str

    # === 감정 분석 결과 ===
    # supervisor가 분석한 사용자 감정 상태
    emotion_analysis: Optional[EmotionData]

    # === RAG 검색 결과 ===
    # welfare 에이전트가 검색한 복지 문서
    retrieved_docs: List[str]

    # === Tool 호출 결과 ===
    # 각 에이전트가 사용한 도구 결과
    tool_results: List[dict]

    # === 응답 생성용 컨텍스트 ===
    # 최종 응답 생성에 사용될 컨텍스트
    response_context: Optional[str]

    # === 에러 핸들링 ===
    error: Optional[str]
    retry_count: int


def create_initial_state(
    user_id: str,
    session_id: str,
    user_profile: Optional[UserProfileData] = None
) -> AgentState:
    """초기 상태 생성 헬퍼 함수"""
    return AgentState(
        messages=[],
        current_agent="supervisor",
        user_id=user_id,
        user_profile=user_profile,
        session_id=session_id,
        emotion_analysis=None,
        retrieved_docs=[],
        tool_results=[],
        response_context=None,
        error=None,
        retry_count=0
    )
