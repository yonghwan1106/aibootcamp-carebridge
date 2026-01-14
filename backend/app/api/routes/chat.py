"""
AI 케어브릿지 - 대화 API
LangGraph 멀티 에이전트 시스템 연동
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
import uuid
import logging
from langchain_core.messages import HumanMessage

from app.models.message import (
    ChatRequest,
    ChatResponse,
    Message,
    MessageRole,
    ChatSession,
    EmotionAnalysis,
    EmotionType
)
from app.agents.graph import agent_graph

router = APIRouter()
logger = logging.getLogger(__name__)

# 임시 세션 저장소 (추후 Redis로 교체)
sessions = {}


def _build_emotion_analysis(emotion_data: dict) -> Optional[EmotionAnalysis]:
    """감정 분석 데이터를 EmotionAnalysis 객체로 변환"""
    if not emotion_data:
        return None
    try:
        primary = emotion_data.get("primary", "neutral")
        emotion_type = EmotionType(primary) if primary in [e.value for e in EmotionType] else EmotionType.NEUTRAL
        return EmotionAnalysis(
            primary_emotion=emotion_type,
            confidence=emotion_data.get("confidence", 0.5),
            risk_level=emotion_data.get("risk_level", 0),
            keywords=emotion_data.get("keywords", [])
        )
    except Exception:
        return None


@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    메시지 전송 및 AI 응답 생성
    """
    try:
        session_id = request.session_id or str(uuid.uuid4())

        if session_id not in sessions:
            sessions[session_id] = ChatSession(
                session_id=session_id,
                user_id=request.user_id
            )

        logger.info(f"Chat - User: {request.user_id}, Session: {session_id}")

        # LangGraph 에이전트 호출
        try:
            agent_response = await agent_graph.ainvoke({
                "messages": [HumanMessage(content=request.message)],
                "user_id": request.user_id,
                "session_id": session_id,
                "user_profile": {"name": "어르신"}
            })

            # 응답에서 마지막 AI 메시지 추출
            response_messages = agent_response.get("messages", [])
            last_ai_message = None
            for msg in reversed(response_messages):
                if hasattr(msg, 'content') and not isinstance(msg, HumanMessage):
                    last_ai_message = msg.content
                    break

            # 감정 분석 결과
            emotion_data = agent_response.get("emotion_analysis")
            current_agent = agent_response.get("current_agent", "companion")
            emotion_obj = _build_emotion_analysis(emotion_data)

            assistant_message = Message(
                id=str(uuid.uuid4()),
                session_id=session_id,
                user_id=request.user_id,
                role=MessageRole.ASSISTANT,
                content=last_ai_message or "죄송해요, 다시 한번 말씀해 주시겠어요?",
                agent_type=current_agent,
                emotion=emotion_obj
            )

            return ChatResponse(
                session_id=session_id,
                message=assistant_message,
                emotion=emotion_obj
            )

        except Exception as agent_error:
            logger.error(f"Agent error: {str(agent_error)}")
            assistant_message = Message(
                id=str(uuid.uuid4()),
                session_id=session_id,
                user_id=request.user_id,
                role=MessageRole.ASSISTANT,
                content=_get_fallback_response(request.message),
                agent_type="fallback"
            )

            return ChatResponse(
                session_id=session_id,
                message=assistant_message,
                emotion=None
            )

    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def _get_fallback_response(message: str) -> str:
    """에이전트 오류 시 폴백 응답"""
    lower_msg = message.lower()

    if "복지" in lower_msg or "지원" in lower_msg:
        return "복지 정보를 찾아드릴게요. 어떤 복지 혜택이 궁금하신가요? 기초연금, 장기요양, 노인일자리 등 다양한 프로그램이 있어요."
    if "날씨" in lower_msg:
        return "오늘 날씨를 확인해 드릴게요. 외출하실 때 따뜻하게 입으세요!"
    if "안녕" in lower_msg or "반가" in lower_msg:
        return "안녕하세요! 오늘 하루 어떠셨어요? 궁금한 게 있으시면 편하게 말씀해 주세요."
    if "힘들" in lower_msg or "외로" in lower_msg or "걱정" in lower_msg:
        return "그런 마음이 드셨군요. 제가 곁에 있어요. 이야기 나누고 싶으시면 편하게 말씀해 주세요."
    return "네, 말씀 잘 들었어요. 더 자세히 말씀해 주시면 도움을 드릴 수 있어요."


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 50):
    """대화 기록 조회"""
    return {"session_id": session_id, "messages": [], "total_count": 0}


@router.delete("/session/{session_id}")
async def end_session(session_id: str):
    """대화 세션 종료"""
    if session_id in sessions:
        del sessions[session_id]
    return {"status": "session_ended", "session_id": session_id}
