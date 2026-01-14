"""
AI 케어브릿지 - LangGraph 멀티 에이전트 그래프
"""
from langgraph.graph import StateGraph, END
from typing import Literal
import logging

from app.agents.state import AgentState
from app.agents.nodes.supervisor import supervisor_node
from app.agents.nodes.welfare import welfare_node
from app.agents.nodes.companion import companion_node
from app.agents.nodes.daily import daily_node
from app.agents.nodes.memory import memory_load_node, memory_save_node

logger = logging.getLogger(__name__)


def route_by_intent(state: AgentState) -> Literal["welfare", "companion", "daily", "memory_save"]:
    """
    슈퍼바이저의 의도 분류 결과에 따라 라우팅

    Returns:
        다음 노드 이름
    """
    current_agent = state.get("current_agent", "companion")

    if current_agent == "end":
        return "memory_save"

    if current_agent in ["welfare", "companion", "daily"]:
        return current_agent

    # 기본값은 정서 케어
    return "companion"


def create_agent_graph() -> StateGraph:
    """
    멀티 에이전트 그래프 생성

    그래프 구조:
    ```
    [시작]
       ↓
    [memory_load] - 사용자 프로필 로드
       ↓
    [supervisor] - 의도 분류, 감정 분석
       ↓ (조건부 라우팅)
    ┌──────┼──────┐
    ↓      ↓      ↓
  [welfare] [companion] [daily]
    ↓      ↓      ↓
    └──────┼──────┘
           ↓
    [memory_save] - 대화 기록 저장
           ↓
        [END]
    ```
    """
    # 그래프 초기화
    workflow = StateGraph(AgentState)

    # === 노드 추가 ===
    workflow.add_node("memory_load", memory_load_node)
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("welfare", welfare_node)
    workflow.add_node("companion", companion_node)
    workflow.add_node("daily", daily_node)
    workflow.add_node("memory_save", memory_save_node)

    # === 엣지 정의 ===

    # 시작 -> 기억 로드
    workflow.set_entry_point("memory_load")

    # 기억 로드 -> 슈퍼바이저
    workflow.add_edge("memory_load", "supervisor")

    # 슈퍼바이저 -> 조건부 라우팅
    workflow.add_conditional_edges(
        "supervisor",
        route_by_intent,
        {
            "welfare": "welfare",
            "companion": "companion",
            "daily": "daily",
            "memory_save": "memory_save"  # end인 경우
        }
    )

    # 각 에이전트 -> 기억 저장 -> 종료
    workflow.add_edge("welfare", "memory_save")
    workflow.add_edge("companion", "memory_save")
    workflow.add_edge("daily", "memory_save")
    workflow.add_edge("memory_save", END)

    logger.info("LangGraph 멀티 에이전트 그래프 생성 완료")

    return workflow


def compile_graph(checkpointer=None):
    """
    그래프 컴파일

    Args:
        checkpointer: Redis 체크포인터 (선택적)

    Returns:
        컴파일된 그래프
    """
    workflow = create_agent_graph()

    if checkpointer:
        # Redis 체크포인터로 상태 영속화
        return workflow.compile(checkpointer=checkpointer)
    else:
        # 체크포인터 없이 컴파일 (개발용)
        return workflow.compile()


# 기본 그래프 인스턴스
agent_graph = compile_graph()
