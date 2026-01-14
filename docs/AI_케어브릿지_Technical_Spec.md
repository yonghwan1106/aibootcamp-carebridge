# AI 케어브릿지 Technical Implementation Spec

> Claude Code 개발용 기술 명세서  
> Version: 1.0 | Last Updated: 2026-01-13

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 의존성](#2-기술-스택-및-의존성)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [데이터 모델](#5-데이터-모델)
6. [LangGraph 에이전트 설계](#6-langgraph-에이전트-설계)
7. [에이전트별 시스템 프롬프트](#7-에이전트별-시스템-프롬프트)
8. [RAG 파이프라인](#8-rag-파이프라인)
9. [Tool 정의 (Function Calling)](#9-tool-정의-function-calling)
10. [API 엔드포인트](#10-api-엔드포인트)
11. [프론트엔드 구조](#11-프론트엔드-구조)
12. [배포 설정](#12-배포-설정)
13. [개발 순서 가이드](#13-개발-순서-가이드)

---

## 1. 프로젝트 개요

### 1.1 서비스 설명

AI 케어브릿지는 LangGraph 기반 멀티 에이전트 시스템으로, 시니어 사용자에게 음성 기반 복지 안내, 정서 케어, 생활 지원 서비스를 제공합니다.

### 1.2 핵심 기술 요소

| 구분 | 기술 | 용도 |
|------|------|------|
| LLM | Upstage Solar Pro 2 | 한국어 특화 추론 |
| Agent Framework | LangGraph | 멀티 에이전트 오케스트레이션 |
| STT | Whisper Large-v3 | 노인 발화 음성 인식 |
| TTS | OpenAI TTS / VITS | 음성 합성 |
| Vector DB | Chroma | RAG 임베딩 저장 |
| Memory | Redis | 장기 기억 저장 |
| Backend | FastAPI | REST API 서버 |
| Frontend | Next.js 14 | 웹 인터페이스 |

---

## 2. 기술 스택 및 의존성

### 2.1 Backend (Python 3.11+)

```txt
# requirements.txt

# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0

# LangChain & LangGraph
langchain==0.1.0
langchain-community==0.0.13
langchain-upstage==0.1.0
langgraph==0.0.26

# Vector DB & Embeddings
chromadb==0.4.22
sentence-transformers==2.2.2

# Memory & Cache
redis==5.0.1
aioredis==2.0.1

# Speech
openai-whisper==20231117
openai==1.10.0

# Utils
httpx==0.26.0
python-multipart==0.0.6
aiofiles==23.2.1
```

### 2.2 Frontend (Node.js 20+)

```json
// package.json dependencies
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "tailwindcss": "3.4.1",
    "zustand": "4.5.0",
    "axios": "1.6.5",
    "react-icons": "5.0.1",
    "framer-motion": "11.0.3"
  }
}
```

---

## 3. 프로젝트 구조

```
ai-carebridge/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI 앱 진입점
│   │   ├── config.py               # 환경 설정
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── chat.py         # 대화 API
│   │   │   │   ├── voice.py        # 음성 처리 API
│   │   │   │   ├── welfare.py      # 복지 검색 API
│   │   │   │   └── health.py       # 헬스체크
│   │   │   └── deps.py             # 의존성 주입
│   │   │
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── graph.py            # LangGraph 메인 그래프
│   │   │   ├── state.py            # AgentState 정의
│   │   │   ├── nodes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── supervisor.py   # 슈퍼바이저 노드
│   │   │   │   ├── welfare.py      # 복지 에이전트 노드
│   │   │   │   ├── companion.py    # 정서 케어 노드
│   │   │   │   ├── daily.py        # 생활 정보 노드
│   │   │   │   └── memory.py       # 기억 관리 노드
│   │   │   └── prompts/
│   │   │       ├── __init__.py
│   │   │       ├── supervisor.py
│   │   │       ├── welfare.py
│   │   │       ├── companion.py
│   │   │       └── daily.py
│   │   │
│   │   ├── tools/
│   │   │   ├── __init__.py
│   │   │   ├── welfare_search.py   # 복지 검색 도구
│   │   │   ├── hospital_booking.py # 병원 예약 도구
│   │   │   ├── weather.py          # 날씨 조회 도구
│   │   │   └── notification.py     # 보호자 알림 도구
│   │   │
│   │   ├── rag/
│   │   │   ├── __init__.py
│   │   │   ├── vectorstore.py      # Chroma 벡터스토어
│   │   │   ├── retriever.py        # 검색기
│   │   │   ├── embeddings.py       # 임베딩 모델
│   │   │   └── loader.py           # 문서 로더
│   │   │
│   │   ├── memory/
│   │   │   ├── __init__.py
│   │   │   ├── redis_store.py      # Redis 저장소
│   │   │   ├── checkpointer.py     # LangGraph 체크포인터
│   │   │   └── user_profile.py     # 사용자 프로필 관리
│   │   │
│   │   ├── speech/
│   │   │   ├── __init__.py
│   │   │   ├── stt.py              # Whisper STT
│   │   │   └── tts.py              # TTS 처리
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py             # 사용자 모델
│   │   │   ├── message.py          # 메시지 모델
│   │   │   ├── welfare.py          # 복지 정보 모델
│   │   │   └── emotion.py          # 감정 분석 모델
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       └── exceptions.py
│   │
│   ├── data/
│   │   ├── welfare_docs/           # 복지 문서 (PDF, HWP)
│   │   └── chroma_db/              # Chroma 영속화
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_agents.py
│   │   ├── test_rag.py
│   │   └── test_api.py
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # 메인 페이지
│   │   │   ├── chat/
│   │   │   │   └── page.tsx        # 대화 페이지
│   │   │   └── dashboard/
│   │   │       └── page.tsx        # 보호자 대시보드
│   │   │
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── VoiceButton.tsx
│   │   │   │   └── AIAvatar.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatusCard.tsx
│   │   │   │   ├── EmotionChart.tsx
│   │   │   │   └── WelfareStatus.tsx
│   │   │   └── common/
│   │   │       ├── Header.tsx
│   │   │       └── Loading.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useVoice.ts         # 음성 녹음 훅
│   │   │   ├── useChat.ts          # 채팅 상태 훅
│   │   │   └── useWebSocket.ts     # 실시간 통신 훅
│   │   │
│   │   ├── stores/
│   │   │   ├── chatStore.ts        # Zustand 채팅 스토어
│   │   │   └── userStore.ts
│   │   │
│   │   ├── services/
│   │   │   └── api.ts              # API 클라이언트
│   │   │
│   │   └── types/
│   │       └── index.ts            # TypeScript 타입
│   │
│   ├── public/
│   │   └── avatars/                # AI 아바타 이미지
│   │
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 4. 환경 변수 설정

### 4.1 Backend (.env)

```env
# .env.example

# === App ===
APP_NAME=AI-CaresBridge
APP_ENV=development
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000

# === LLM ===
UPSTAGE_API_KEY=your_upstage_api_key
UPSTAGE_MODEL=solar-pro-2
UPSTAGE_BASE_URL=https://api.upstage.ai/v1/solar

# === OpenAI (TTS/Whisper fallback) ===
OPENAI_API_KEY=your_openai_api_key

# === Redis ===
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=

# === Vector DB ===
CHROMA_PERSIST_DIR=./data/chroma_db
EMBEDDING_MODEL=intfloat/multilingual-e5-large

# === External APIs ===
WELFARE_API_KEY=your_welfare_api_key
WEATHER_API_KEY=your_weather_api_key
HOSPITAL_API_KEY=your_hospital_api_key

# === Security ===
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=http://localhost:3000,https://carebridge.ai

# === Notification ===
FCM_SERVER_KEY=your_fcm_key
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
```

### 4.2 Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=AI 케어브릿지
```

---

## 5. 데이터 모델

### 5.1 사용자 프로필 (UserProfile)

```python
# backend/app/models/user.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"

class IncomeLevel(str, Enum):
    BASIC_PENSION = "basic_pension"  # 기초연금 수급
    LOW = "low"                       # 저소득
    MIDDLE = "middle"                 # 중위소득
    HIGH = "high"                     # 고소득

class HealthCondition(BaseModel):
    """건강 상태 정보"""
    name: str                         # 질환명 (예: "고혈압")
    severity: str = "mild"            # mild, moderate, severe
    medications: List[str] = []       # 복용 약물
    hospital: Optional[str] = None    # 담당 병원
    doctor: Optional[str] = None      # 담당 의사

class FamilyMember(BaseModel):
    """가족 정보"""
    relation: str                     # 관계 (아들, 딸, 손녀 등)
    name: str
    phone: Optional[str] = None
    is_primary_guardian: bool = False # 주 보호자 여부

class UserProfile(BaseModel):
    """사용자 프로필 (장기 기억)"""
    user_id: str
    name: str
    birth_date: date
    gender: Gender
    
    # 주소 정보
    address: str
    region_code: str                  # 행정구역 코드
    
    # 경제 상태
    income_level: IncomeLevel
    is_basic_pension: bool = False    # 기초연금 수급 여부
    is_medicaid: bool = False         # 의료급여 수급 여부
    
    # 건강 정보
    health_conditions: List[HealthCondition] = []
    mobility_level: str = "normal"    # normal, limited, wheelchair
    
    # 가족 정보
    family_members: List[FamilyMember] = []
    living_alone: bool = True
    
    # 선호도
    preferred_hospital: Optional[str] = None
    wake_time: str = "07:00"
    sleep_time: str = "21:00"
    dialect: Optional[str] = None     # 사투리 (경상도, 전라도 등)
    
    # 메타데이터
    created_at: datetime
    updated_at: datetime

class UserProfileCreate(BaseModel):
    """사용자 등록 요청"""
    name: str
    birth_date: date
    gender: Gender
    address: str
    phone: str
    guardian_phone: str               # 보호자 연락처 (필수)
```

### 5.2 메시지 모델 (Message)

```python
# backend/app/models/message.py

from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class EmotionType(str, Enum):
    HAPPY = "happy"
    NEUTRAL = "neutral"
    SAD = "sad"
    ANXIOUS = "anxious"
    ANGRY = "angry"
    LONELY = "lonely"

class EmotionAnalysis(BaseModel):
    """감정 분석 결과"""
    primary_emotion: EmotionType
    confidence: float                 # 0.0 ~ 1.0
    risk_level: int = 0               # 0: 정상, 1: 주의, 2: 위험
    keywords: List[str] = []          # 감정 관련 키워드

class Message(BaseModel):
    """대화 메시지"""
    id: str
    session_id: str
    user_id: str
    role: MessageRole
    content: str
    
    # 음성 관련
    audio_url: Optional[str] = None
    duration_seconds: Optional[float] = None
    
    # 에이전트 정보
    agent_type: Optional[str] = None  # supervisor, welfare, companion, daily
    tool_calls: List[str] = []        # 사용된 도구 목록
    
    # 감정 분석 (user 메시지인 경우)
    emotion: Optional[EmotionAnalysis] = None
    
    # RAG 관련 (assistant 메시지인 경우)
    sources: List[str] = []           # 참조 문서 목록
    groundedness_score: Optional[float] = None
    
    timestamp: datetime

class ChatSession(BaseModel):
    """대화 세션"""
    session_id: str
    user_id: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    message_count: int = 0
    summary: Optional[str] = None     # 대화 요약
    
class ConversationHistory(BaseModel):
    """대화 기록 조회 응답"""
    session: ChatSession
    messages: List[Message]
```

### 5.3 복지 정보 모델 (Welfare)

```python
# backend/app/models/welfare.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from enum import Enum

class WelfareCategory(str, Enum):
    HOUSING = "housing"           # 주거
    MEDICAL = "medical"           # 의료
    LIVING = "living"             # 생활지원
    ENERGY = "energy"             # 에너지
    EMPLOYMENT = "employment"     # 취업
    CULTURE = "culture"           # 문화

class WelfareProgram(BaseModel):
    """복지 프로그램 정보"""
    id: str
    name: str                     # 프로그램명
    category: WelfareCategory
    description: str              # 설명
    
    # 지원 내용
    benefit_amount: Optional[str] = None   # 지원금액 (예: "월 최대 18.6만원")
    benefit_type: str                       # 현금, 현물, 서비스
    
    # 자격 요건
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    income_criteria: Optional[str] = None
    required_conditions: List[str] = []
    
    # 신청 정보
    application_method: str               # 신청 방법
    application_url: Optional[str] = None
    required_documents: List[str] = []
    
    # 기간
    application_start: Optional[date] = None
    application_end: Optional[date] = None
    
    # 담당 기관
    agency: str                           # 담당 기관
    contact: Optional[str] = None
    
    # 메타데이터
    source_url: str
    last_updated: date

class WelfareEligibility(BaseModel):
    """복지 자격 검증 결과"""
    program: WelfareProgram
    is_eligible: bool
    match_score: float            # 적합도 점수 (0.0 ~ 1.0)
    matched_conditions: List[str] # 충족 조건
    missing_conditions: List[str] # 미충족 조건
    recommendation_reason: str    # 추천 사유

class WelfareApplication(BaseModel):
    """복지 신청 정보"""
    id: str
    user_id: str
    program_id: str
    status: str                   # pending, submitted, approved, rejected
    submitted_at: Optional[date] = None
    result_at: Optional[date] = None
    notes: Optional[str] = None
```

---

## 6. LangGraph 에이전트 설계

### 6.1 AgentState 정의

```python
# backend/app/agents/state.py

from typing import TypedDict, Annotated, List, Optional, Literal
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from app.models.user import UserProfile
from app.models.emotion import EmotionAnalysis

class AgentState(TypedDict):
    """LangGraph 상태 정의"""
    
    # 메시지 히스토리 (add_messages로 자동 누적)
    messages: Annotated[List[BaseMessage], add_messages]
    
    # 현재 활성 에이전트
    current_agent: Literal["supervisor", "welfare", "companion", "daily", "end"]
    
    # 사용자 정보
    user_id: str
    user_profile: Optional[UserProfile]
    
    # 세션 정보
    session_id: str
    
    # 감정 분석 결과
    emotion_analysis: Optional[EmotionAnalysis]
    
    # RAG 검색 결과
    retrieved_docs: List[str]
    
    # Tool 호출 결과
    tool_results: List[dict]
    
    # 응답 생성용 컨텍스트
    response_context: Optional[str]
    
    # 에러 핸들링
    error: Optional[str]
    retry_count: int
```

### 6.2 그래프 구조 정의

```python
# backend/app/agents/graph.py

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.redis import RedisSaver
from app.agents.state import AgentState
from app.agents.nodes.supervisor import supervisor_node
from app.agents.nodes.welfare import welfare_node
from app.agents.nodes.companion import companion_node
from app.agents.nodes.daily import daily_node
from app.agents.nodes.memory import memory_load_node, memory_save_node
from app.config import settings

def create_agent_graph():
    """멀티 에이전트 그래프 생성"""
    
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
            "end": "memory_save"
        }
    )
    
    # 각 에이전트 -> 기억 저장 -> 종료
    workflow.add_edge("welfare", "memory_save")
    workflow.add_edge("companion", "memory_save")
    workflow.add_edge("daily", "memory_save")
    workflow.add_edge("memory_save", END)
    
    # === 체크포인터 설정 (Redis) ===
    checkpointer = RedisSaver.from_conn_string(settings.REDIS_URL)
    
    # 그래프 컴파일
    app = workflow.compile(checkpointer=checkpointer)
    
    return app


def route_by_intent(state: AgentState) -> str:
    """슈퍼바이저의 의도 분류 결과에 따라 라우팅"""
    return state["current_agent"]


# 그래프 인스턴스 생성
agent_graph = create_agent_graph()
```

### 6.3 슈퍼바이저 노드

```python
# backend/app/agents/nodes/supervisor.py

from langchain_upstage import ChatUpstage
from langchain_core.messages import HumanMessage, AIMessage
from app.agents.state import AgentState
from app.agents.prompts.supervisor import SUPERVISOR_SYSTEM_PROMPT
from app.models.emotion import EmotionAnalysis, EmotionType
from app.config import settings
import json

# LLM 초기화
llm = ChatUpstage(
    api_key=settings.UPSTAGE_API_KEY,
    model=settings.UPSTAGE_MODEL
)

async def supervisor_node(state: AgentState) -> AgentState:
    """
    슈퍼바이저 노드: 의도 분류 및 감정 분석
    """
    messages = state["messages"]
    user_profile = state["user_profile"]
    last_message = messages[-1].content if messages else ""
    
    # 시스템 프롬프트 구성
    system_prompt = SUPERVISOR_SYSTEM_PROMPT.format(
        user_name=user_profile.name if user_profile else "어르신",
        user_context=_build_user_context(user_profile)
    )
    
    # LLM 호출 (의도 분류 + 감정 분석)
    response = await llm.ainvoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"""
다음 사용자 발화를 분석해주세요:

발화: "{last_message}"

JSON 형식으로 응답해주세요:
{{
    "intent": "welfare" | "companion" | "daily" | "end",
    "intent_confidence": 0.0~1.0,
    "emotion": {{
        "primary": "happy" | "neutral" | "sad" | "anxious" | "angry" | "lonely",
        "confidence": 0.0~1.0,
        "risk_level": 0 | 1 | 2,
        "keywords": ["키워드1", "키워드2"]
    }},
    "greeting_response": "선제적 인사말 (있을 경우)"
}}
"""}
    ])
    
    # 응답 파싱
    try:
        result = json.loads(response.content)
        intent = result["intent"]
        emotion_data = result["emotion"]
        greeting = result.get("greeting_response")
        
        # 감정 분석 결과 생성
        emotion_analysis = EmotionAnalysis(
            primary_emotion=EmotionType(emotion_data["primary"]),
            confidence=emotion_data["confidence"],
            risk_level=emotion_data["risk_level"],
            keywords=emotion_data["keywords"]
        )
        
        # 인사말이 있으면 메시지에 추가
        new_messages = list(messages)
        if greeting:
            new_messages.append(AIMessage(content=greeting))
        
        return {
            **state,
            "messages": new_messages,
            "current_agent": intent,
            "emotion_analysis": emotion_analysis
        }
        
    except Exception as e:
        # 파싱 실패 시 기본값
        return {
            **state,
            "current_agent": "companion",  # 기본은 정서 케어
            "error": str(e)
        }


def _build_user_context(profile) -> str:
    """사용자 컨텍스트 문자열 생성"""
    if not profile:
        return "사용자 정보 없음"
    
    context_parts = []
    context_parts.append(f"이름: {profile.name}")
    
    if profile.health_conditions:
        conditions = ", ".join([c.name for c in profile.health_conditions])
        context_parts.append(f"건강상태: {conditions}")
    
    if profile.living_alone:
        context_parts.append("독거 어르신")
    
    if profile.dialect:
        context_parts.append(f"사투리: {profile.dialect}")
    
    return " / ".join(context_parts)
```

### 6.4 복지 에이전트 노드

```python
# backend/app/agents/nodes/welfare.py

from langchain_upstage import ChatUpstage
from langchain_core.messages import AIMessage
from app.agents.state import AgentState
from app.agents.prompts.welfare import WELFARE_SYSTEM_PROMPT
from app.rag.retriever import welfare_retriever
from app.tools.welfare_search import search_welfare_programs
from app.tools.welfare_search import check_eligibility
from app.config import settings

llm = ChatUpstage(
    api_key=settings.UPSTAGE_API_KEY,
    model=settings.UPSTAGE_MODEL
)

async def welfare_node(state: AgentState) -> AgentState:
    """
    복지 전문 에이전트: RAG 기반 복지 정보 검색 및 안내
    """
    messages = state["messages"]
    user_profile = state["user_profile"]
    last_message = messages[-1].content
    
    # 1. RAG 검색 수행
    retrieved_docs = await welfare_retriever.aretrieve(last_message)
    docs_context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    
    # 2. 사용자 자격 요건 기반 필터링
    if user_profile:
        eligible_programs = await check_eligibility(
            user_profile=user_profile,
            query=last_message
        )
    else:
        eligible_programs = []
    
    # 3. 시스템 프롬프트 구성
    system_prompt = WELFARE_SYSTEM_PROMPT.format(
        user_name=user_profile.name if user_profile else "어르신",
        user_age=_calculate_age(user_profile.birth_date) if user_profile else "알 수 없음",
        user_region=user_profile.region_code if user_profile else "",
        income_level=user_profile.income_level.value if user_profile else "",
        health_conditions=_format_health_conditions(user_profile),
        retrieved_docs=docs_context,
        eligible_programs=_format_eligible_programs(eligible_programs)
    )
    
    # 4. LLM 응답 생성
    response = await llm.ainvoke([
        {"role": "system", "content": system_prompt},
        *_convert_messages(messages)
    ])
    
    # 5. Groundedness Check (환각 방지)
    groundedness_score = await _check_groundedness(
        response.content, 
        docs_context
    )
    
    # 6. 응답에 출처 정보 추가
    if groundedness_score < 0.7:
        # 신뢰도 낮으면 안전한 응답으로 대체
        response_content = _get_safe_response(last_message)
    else:
        response_content = response.content
    
    return {
        **state,
        "messages": [*messages, AIMessage(content=response_content)],
        "retrieved_docs": [doc.page_content for doc in retrieved_docs],
        "tool_results": [{"type": "welfare_search", "count": len(eligible_programs)}]
    }


async def _check_groundedness(response: str, context: str) -> float:
    """Upstage Groundedness Check API 호출"""
    # TODO: Upstage Groundedness Check API 연동
    # 임시로 1.0 반환
    return 1.0


def _get_safe_response(query: str) -> str:
    """환각 발생 시 안전한 응답 반환"""
    return "죄송해요, 정확한 정보를 찾지 못했어요. 주민센터(☎ 120)에 문의하시면 더 자세히 안내받으실 수 있어요."
```

### 6.5 정서 케어 에이전트 노드

```python
# backend/app/agents/nodes/companion.py

from langchain_upstage import ChatUpstage
from langchain_core.messages import AIMessage
from app.agents.state import AgentState
from app.agents.prompts.companion import COMPANION_SYSTEM_PROMPT
from app.tools.notification import send_guardian_alert
from app.config import settings

llm = ChatUpstage(
    api_key=settings.UPSTAGE_API_KEY,
    model=settings.UPSTAGE_MODEL
)

async def companion_node(state: AgentState) -> AgentState:
    """
    정서 케어 에이전트: 공감적 대화 및 위기 감지
    """
    messages = state["messages"]
    user_profile = state["user_profile"]
    emotion_analysis = state.get("emotion_analysis")
    
    # 1. 위기 상황 감지 시 보호자 알림
    if emotion_analysis and emotion_analysis.risk_level >= 2:
        await _handle_crisis(user_profile, emotion_analysis)
    
    # 2. 장기 기억에서 대화 소재 로드
    memory_context = await _load_conversation_topics(state["user_id"])
    
    # 3. 시스템 프롬프트 구성
    system_prompt = COMPANION_SYSTEM_PROMPT.format(
        user_name=user_profile.name if user_profile else "어르신",
        user_context=_build_companion_context(user_profile),
        memory_context=memory_context,
        emotion_state=emotion_analysis.primary_emotion.value if emotion_analysis else "neutral"
    )
    
    # 4. LLM 응답 생성
    response = await llm.ainvoke([
        {"role": "system", "content": system_prompt},
        *_convert_messages(messages)
    ])
    
    return {
        **state,
        "messages": [*messages, AIMessage(content=response.content)]
    }


async def _handle_crisis(user_profile, emotion_analysis):
    """위기 상황 처리"""
    if not user_profile:
        return
    
    # 주 보호자 찾기
    guardian = next(
        (f for f in user_profile.family_members if f.is_primary_guardian),
        None
    )
    
    if guardian and guardian.phone:
        await send_guardian_alert(
            guardian_phone=guardian.phone,
            user_name=user_profile.name,
            alert_type="emotional_crisis",
            details={
                "emotion": emotion_analysis.primary_emotion.value,
                "risk_level": emotion_analysis.risk_level,
                "keywords": emotion_analysis.keywords
            }
        )


async def _load_conversation_topics(user_id: str) -> str:
    """장기 기억에서 대화 소재 로드"""
    # Redis에서 이전 대화 키워드/토픽 로드
    # TODO: 구현
    return ""


def _build_companion_context(profile) -> str:
    """정서 케어를 위한 컨텍스트 구성"""
    if not profile:
        return ""
    
    context_parts = []
    
    # 가족 정보 (대화 소재로 활용)
    for member in profile.family_members:
        context_parts.append(f"{member.relation}: {member.name}")
    
    return " / ".join(context_parts)
```

### 6.6 기억 관리 노드

```python
# backend/app/agents/nodes/memory.py

from app.agents.state import AgentState
from app.memory.redis_store import RedisMemoryStore
from app.memory.user_profile import UserProfileManager

memory_store = RedisMemoryStore()
profile_manager = UserProfileManager()

async def memory_load_node(state: AgentState) -> AgentState:
    """
    기억 로드 노드: 세션 시작 시 사용자 프로필 및 최근 대화 로드
    """
    user_id = state["user_id"]
    session_id = state["session_id"]
    
    # 1. 사용자 프로필 로드
    user_profile = await profile_manager.get_profile(user_id)
    
    # 2. 최근 대화 요약 로드 (선제적 안부용)
    recent_summary = await memory_store.get_recent_summary(user_id)
    
    # 3. 중요 기억 로드 (건강 이슈, 가족 이벤트 등)
    important_memories = await memory_store.get_important_memories(user_id)
    
    # 컨텍스트 구성
    response_context = _build_proactive_context(
        user_profile, 
        recent_summary, 
        important_memories
    )
    
    return {
        **state,
        "user_profile": user_profile,
        "response_context": response_context
    }


async def memory_save_node(state: AgentState) -> AgentState:
    """
    기억 저장 노드: 세션 종료 시 중요 정보 저장
    """
    user_id = state["user_id"]
    session_id = state["session_id"]
    messages = state["messages"]
    emotion_analysis = state.get("emotion_analysis")
    
    # 1. 대화 요약 생성 및 저장
    if len(messages) > 2:
        summary = await _generate_summary(messages)
        await memory_store.save_session_summary(
            user_id=user_id,
            session_id=session_id,
            summary=summary
        )
    
    # 2. 중요 정보 추출 및 저장 (건강 이슈, 가족 소식 등)
    important_info = await _extract_important_info(messages)
    if important_info:
        await memory_store.save_important_memory(
            user_id=user_id,
            memory=important_info
        )
    
    # 3. 감정 상태 기록
    if emotion_analysis:
        await memory_store.log_emotion(
            user_id=user_id,
            session_id=session_id,
            emotion=emotion_analysis
        )
    
    return state


def _build_proactive_context(profile, summary, memories) -> str:
    """선제적 안부를 위한 컨텍스트 구성"""
    context_parts = []
    
    # 어제 대화 내용 기반 안부
    if summary:
        context_parts.append(f"어제 대화 요약: {summary}")
    
    # 중요 기억 기반 안부 (건강 이슈 등)
    if memories:
        for mem in memories[:3]:  # 최근 3개만
            context_parts.append(f"기억: {mem}")
    
    return "\n".join(context_parts)
```

---

## 7. 에이전트별 시스템 프롬프트

### 7.1 슈퍼바이저 프롬프트

```python
# backend/app/agents/prompts/supervisor.py

SUPERVISOR_SYSTEM_PROMPT = """당신은 AI 케어브릿지의 슈퍼바이저 에이전트입니다.
사용자의 발화를 분석하여 적절한 전문 에이전트에게 연결하는 역할을 합니다.

## 현재 대화 중인 사용자
- 이름: {user_name}
- 상세 정보: {user_context}

## 의도 분류 기준

### welfare (복지 에이전트)
- 복지 혜택, 지원금, 보조금 관련 문의
- 정부 서비스, 행정 처리 요청
- 예시: "난방비 지원", "기초연금", "복지 혜택", "지원금 신청"

### companion (정서 케어 에이전트)  
- 일상 대화, 안부 인사
- 감정 표현, 고민 상담
- 외로움, 우울감 표현
- 예시: "심심해", "우울해", "이야기하고 싶어", "요즘 힘들어"

### daily (생활 정보 에이전트)
- 날씨, 뉴스 문의
- 일정, 약 복용 알림
- 병원 예약 요청
- 예시: "오늘 날씨", "병원 예약", "약 먹을 시간"

### end (대화 종료)
- 작별 인사
- 예시: "안녕", "다음에", "끊을게"

## 감정 분석 기준

### risk_level
- 0 (정상): 일상적인 대화
- 1 (주의): 가벼운 우울감, 외로움 표현
- 2 (위험): 심한 우울, 자해/자살 암시, 포기 표현

## 선제적 인사 규칙
어르신의 이름을 부르며 따뜻하게 인사합니다.
이전 대화 내용이 있다면 관련 안부를 먼저 여쭙니다.

## 출력 형식
반드시 유효한 JSON 형식으로만 응답하세요.
"""
```

### 7.2 복지 에이전트 프롬프트

```python
# backend/app/agents/prompts/welfare.py

WELFARE_SYSTEM_PROMPT = """당신은 AI 케어브릿지의 복지 전문 상담사입니다.
어르신들이 받을 수 있는 복지 혜택을 친절하게 안내합니다.

## 현재 상담 중인 어르신
- 이름: {user_name}
- 나이: {user_age}세
- 지역: {user_region}
- 소득 수준: {income_level}
- 건강 상태: {health_conditions}

## 검색된 복지 정보
{retrieved_docs}

## 자격 충족 프로그램
{eligible_programs}

## 응답 규칙

### 말투
- 존댓말 사용, 따뜻하고 친근한 어조
- "~해요", "~드릴게요" 형태
- 어려운 행정 용어는 쉬운 말로 풀어서 설명

### 정보 안내
- 핵심 내용을 먼저 말하고 상세 내용은 나중에
- 금액은 구체적으로 (예: "월 최대 18만 6천원")
- 신청 방법은 단계별로 쉽게 설명

### 환각 방지
- 검색된 문서에 없는 내용은 절대 지어내지 않음
- 확실하지 않으면 "주민센터에 확인해보시는 게 좋겠어요"라고 안내
- 출처를 함께 안내 (예: "복지로에 따르면...")

### 신청 지원
- 어르신이 원하시면 신청 대행 가능함을 안내
- 필요한 서류 목록을 쉽게 설명

## 금지 사항
- 존재하지 않는 복지 프로그램 언급
- 확인되지 않은 금액이나 조건 언급
- 전문 용어 남발
"""
```

### 7.3 정서 케어 에이전트 프롬프트

```python
# backend/app/agents/prompts/companion.py

COMPANION_SYSTEM_PROMPT = """당신은 AI 케어브릿지의 정서 케어 전문가입니다.
어르신의 따뜻한 말벗이 되어 공감하고 정서적 지지를 제공합니다.

## 현재 대화 중인 어르신
- 이름: {user_name}
- 상세 정보: {user_context}

## 기억하고 있는 내용
{memory_context}

## 현재 감정 상태
{emotion_state}

## 대화 원칙

### 공감적 경청
- 어르신의 말씀을 끝까지 듣고 공감 표현
- "정말 그러셨구나", "많이 속상하셨겠어요" 등의 공감 표현
- 성급한 조언보다 충분한 경청 우선

### 따뜻한 말투
- 존댓말 사용, 다정하고 부드러운 어조
- 적절한 호칭 사용 (어르신, 어머니/아버지)
- 천천히, 쉬운 말로

### 회상 요법 (Reminiscence Therapy)
- 좋았던 추억을 자연스럽게 떠올리도록 유도
- 가족, 과거 경험 등 긍정적 기억 활용
- "그때 정말 행복하셨겠네요" 등의 반응

### 화제 전환
- 우울한 대화가 길어지면 자연스럽게 화제 전환
- 가족 이야기, 좋아하시는 것 등으로 전환
- 억지스럽지 않게, 자연스럽게

## 위기 대응

### risk_level 2 감지 시
- 공감 표현 후 전문 도움 권유
- "많이 힘드시죠. 혹시 전문 상담사 선생님과 이야기해보시는 건 어떨까요?"
- 자살예방상담전화(1393) 안내
- 절대 혼자 두지 않겠다는 메시지 전달

## 금지 사항
- 부정적 감정 증폭시키는 말
- 가르치려 드는 태도
- 성급한 해결책 제시
- "힘내세요", "긍정적으로 생각하세요" 같은 공허한 위로
"""
```

### 7.4 생활 정보 에이전트 프롬프트

```python
# backend/app/agents/prompts/daily.py

DAILY_SYSTEM_PROMPT = """당신은 AI 케어브릿지의 생활 도우미입니다.
어르신의 일상 생활을 돕는 다양한 정보와 서비스를 제공합니다.

## 현재 도움 드리는 어르신
- 이름: {user_name}
- 지역: {user_region}
- 기상 시간: {wake_time}
- 취침 시간: {sleep_time}

## 제공 서비스

### 날씨 정보
- 현재 날씨, 오늘/내일 예보
- 미세먼지, 자외선 정보
- 건강 관련 날씨 조언 (관절염 환자에게 습도 정보 등)

### 건강 관리
- 복약 알림
- 병원 예약 대행
- 운동, 스트레칭 안내

### 일정 관리
- 오늘의 일정 안내
- 중요 일정 리마인더
- 가족 생일, 기념일 알림

## 응답 규칙
- 날씨 정보는 구체적으로 (기온, 체감온도, 옷차림 조언)
- 시간은 "오전 10시", "오후 3시" 형태로
- 건강 조언은 현재 건강 상태 고려

## 병원 예약 시
1. 어느 병원(진료과) 원하시는지 확인
2. 원하는 날짜/시간 확인  
3. 예약 가능 여부 조회 후 안내
4. 예약 확정 후 보호자에게도 알림
"""
```

---

## 8. RAG 파이프라인

### 8.1 문서 로더

```python
# backend/app/rag/loader.py

from langchain_community.document_loaders import (
    PyPDFLoader,
    UnstructuredHTMLLoader,
    TextLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List
from pathlib import Path
import os

class WelfareDocumentLoader:
    """복지 문서 로더"""
    
    def __init__(self, docs_dir: str = "./data/welfare_docs"):
        self.docs_dir = Path(docs_dir)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", "!", "?", ",", " "]
        )
    
    def load_all_documents(self) -> List:
        """모든 문서 로드 및 청킹"""
        documents = []
        
        for file_path in self.docs_dir.rglob("*"):
            if file_path.suffix.lower() == ".pdf":
                loader = PyPDFLoader(str(file_path))
            elif file_path.suffix.lower() in [".html", ".htm"]:
                loader = UnstructuredHTMLLoader(str(file_path))
            elif file_path.suffix.lower() == ".txt":
                loader = TextLoader(str(file_path), encoding="utf-8")
            else:
                continue
            
            try:
                docs = loader.load()
                # 메타데이터 추가
                for doc in docs:
                    doc.metadata["source_file"] = file_path.name
                    doc.metadata["category"] = self._extract_category(file_path)
                documents.extend(docs)
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
        
        # 청킹
        chunks = self.text_splitter.split_documents(documents)
        return chunks
    
    def _extract_category(self, file_path: Path) -> str:
        """파일 경로에서 카테고리 추출"""
        # 예: welfare_docs/energy/에너지바우처.pdf -> "energy"
        parts = file_path.parts
        if len(parts) > 1:
            return parts[-2]
        return "general"
```

### 8.2 임베딩 및 벡터스토어

```python
# backend/app/rag/vectorstore.py

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from app.rag.loader import WelfareDocumentLoader
from app.config import settings
from typing import List

class WelfareVectorStore:
    """복지 문서 벡터스토어"""
    
    def __init__(self):
        # 임베딩 모델 (다국어 지원)
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,  # intfloat/multilingual-e5-large
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        
        # Chroma 벡터스토어
        self.vectorstore = Chroma(
            collection_name="welfare_docs",
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR
        )
    
    def initialize(self):
        """문서 로드 및 벡터스토어 초기화"""
        loader = WelfareDocumentLoader()
        documents = loader.load_all_documents()
        
        # 벡터스토어에 추가
        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()
        
        print(f"Indexed {len(documents)} document chunks")
    
    def search(self, query: str, k: int = 5, filter_dict: dict = None) -> List:
        """유사 문서 검색"""
        if filter_dict:
            results = self.vectorstore.similarity_search(
                query, k=k, filter=filter_dict
            )
        else:
            results = self.vectorstore.similarity_search(query, k=k)
        
        return results
    
    def search_with_score(self, query: str, k: int = 5) -> List:
        """점수와 함께 검색"""
        results = self.vectorstore.similarity_search_with_score(query, k=k)
        return results


# 싱글톤 인스턴스
welfare_vectorstore = WelfareVectorStore()
```

### 8.3 검색기 (Retriever)

```python
# backend/app/rag/retriever.py

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain_upstage import ChatUpstage
from app.rag.vectorstore import welfare_vectorstore
from app.config import settings

class WelfareRetriever:
    """복지 정보 검색기"""
    
    def __init__(self):
        self.vectorstore = welfare_vectorstore
        
        # LLM 기반 압축기 (관련 내용만 추출)
        llm = ChatUpstage(
            api_key=settings.UPSTAGE_API_KEY,
            model=settings.UPSTAGE_MODEL
        )
        compressor = LLMChainExtractor.from_llm(llm)
        
        # 압축 검색기
        self.retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=self.vectorstore.vectorstore.as_retriever(
                search_kwargs={"k": 10}
            )
        )
    
    async def aretrieve(self, query: str, filters: dict = None):
        """비동기 검색"""
        # 기본 검색
        docs = await self.retriever.aget_relevant_documents(query)
        
        # 필터 적용 (있는 경우)
        if filters:
            docs = [
                doc for doc in docs 
                if all(doc.metadata.get(k) == v for k, v in filters.items())
            ]
        
        return docs[:5]  # 상위 5개만 반환
    
    def retrieve(self, query: str, filters: dict = None):
        """동기 검색"""
        docs = self.retriever.get_relevant_documents(query)
        
        if filters:
            docs = [
                doc for doc in docs 
                if all(doc.metadata.get(k) == v for k, v in filters.items())
            ]
        
        return docs[:5]


# 싱글톤 인스턴스
welfare_retriever = WelfareRetriever()
```

---

## 9. Tool 정의 (Function Calling)

### 9.1 복지 검색 도구

```python
# backend/app/tools/welfare_search.py

from langchain.tools import tool
from pydantic import BaseModel, Field
from typing import List, Optional
from app.models.welfare import WelfareProgram, WelfareEligibility
from app.models.user import UserProfile
from app.rag.retriever import welfare_retriever
import httpx

class WelfareSearchInput(BaseModel):
    """복지 검색 입력"""
    query: str = Field(description="검색 키워드 (예: 난방비, 의료비)")
    category: Optional[str] = Field(default=None, description="카테고리 필터")

class EligibilityCheckInput(BaseModel):
    """자격 확인 입력"""
    program_id: str = Field(description="복지 프로그램 ID")
    user_id: str = Field(description="사용자 ID")

@tool("search_welfare_programs", args_schema=WelfareSearchInput)
async def search_welfare_programs(query: str, category: Optional[str] = None) -> List[dict]:
    """
    복지 프로그램을 검색합니다.
    
    Args:
        query: 검색 키워드
        category: 카테고리 필터 (housing, medical, living, energy 등)
    
    Returns:
        검색된 복지 프로그램 목록
    """
    filters = {"category": category} if category else None
    docs = await welfare_retriever.aretrieve(query, filters)
    
    results = []
    for doc in docs:
        results.append({
            "content": doc.page_content,
            "source": doc.metadata.get("source_file"),
            "category": doc.metadata.get("category")
        })
    
    return results


@tool("check_eligibility", args_schema=EligibilityCheckInput)
async def check_eligibility(program_id: str, user_id: str) -> dict:
    """
    사용자의 복지 프로그램 자격을 확인합니다.
    
    Args:
        program_id: 복지 프로그램 ID
        user_id: 사용자 ID
    
    Returns:
        자격 확인 결과
    """
    # TODO: 실제 자격 확인 로직 구현
    # 1. 사용자 프로필 로드
    # 2. 프로그램 요건과 대조
    # 3. 결과 반환
    
    return {
        "is_eligible": True,
        "match_score": 0.95,
        "matched_conditions": ["나이 조건 충족", "소득 조건 충족"],
        "missing_conditions": []
    }


@tool("apply_welfare")
async def apply_welfare(program_id: str, user_id: str) -> dict:
    """
    복지 프로그램을 신청합니다.
    
    Args:
        program_id: 복지 프로그램 ID
        user_id: 사용자 ID
    
    Returns:
        신청 결과
    """
    # TODO: 실제 신청 API 연동
    return {
        "status": "submitted",
        "application_id": "APP-2026-001234",
        "message": "신청이 완료되었습니다. 결과는 일주일 내로 안내드릴게요."
    }
```

### 9.2 병원 예약 도구

```python
# backend/app/tools/hospital_booking.py

from langchain.tools import tool
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time
import httpx

class HospitalSearchInput(BaseModel):
    query: str = Field(description="병원명 또는 진료과")
    region: Optional[str] = Field(default=None, description="지역")

class BookingInput(BaseModel):
    hospital_id: str
    department: str
    preferred_date: str  # YYYY-MM-DD
    preferred_time: str  # HH:MM
    user_id: str

@tool("search_hospitals", args_schema=HospitalSearchInput)
async def search_hospitals(query: str, region: Optional[str] = None) -> List[dict]:
    """
    병원을 검색합니다.
    
    Args:
        query: 검색어 (병원명 또는 진료과)
        region: 지역 필터
    
    Returns:
        병원 목록
    """
    # TODO: 건강보험심사평가원 API 연동
    return [
        {
            "id": "H001",
            "name": "강북구보건소",
            "department": "정형외과",
            "address": "서울 강북구 도봉로 89길",
            "phone": "02-901-7601"
        }
    ]


@tool("check_availability", args_schema=BookingInput)
async def check_availability(
    hospital_id: str, 
    department: str,
    preferred_date: str,
    preferred_time: str,
    user_id: str
) -> dict:
    """
    예약 가능 여부를 확인합니다.
    """
    # TODO: 실제 예약 시스템 연동
    return {
        "available": True,
        "slots": [
            {"date": preferred_date, "time": "10:00"},
            {"date": preferred_date, "time": "10:30"},
            {"date": preferred_date, "time": "11:00"}
        ]
    }


@tool("book_appointment")
async def book_appointment(
    hospital_id: str,
    department: str,
    date: str,
    time: str,
    user_id: str,
    symptoms: Optional[str] = None
) -> dict:
    """
    병원 예약을 진행합니다.
    """
    # TODO: 실제 예약 처리
    return {
        "status": "confirmed",
        "booking_id": "BK-2026-005678",
        "hospital": "강북구보건소",
        "department": department,
        "datetime": f"{date} {time}",
        "message": "예약이 완료되었습니다."
    }
```

### 9.3 알림 도구

```python
# backend/app/tools/notification.py

from langchain.tools import tool
from pydantic import BaseModel, Field
from typing import Optional, Literal
import httpx
from app.config import settings

class AlertInput(BaseModel):
    guardian_phone: str
    user_name: str
    alert_type: Literal["emotional_crisis", "health_issue", "welfare_update", "general"]
    details: dict

@tool("send_guardian_alert", args_schema=AlertInput)
async def send_guardian_alert(
    guardian_phone: str,
    user_name: str,
    alert_type: str,
    details: dict
) -> dict:
    """
    보호자에게 알림을 발송합니다.
    
    Args:
        guardian_phone: 보호자 전화번호
        user_name: 어르신 이름
        alert_type: 알림 유형
        details: 상세 정보
    
    Returns:
        발송 결과
    """
    # 알림 메시지 구성
    if alert_type == "emotional_crisis":
        message = f"[AI 케어브릿지] {user_name} 어르신께서 정서적으로 힘들어하십니다. 연락 부탁드립니다."
    elif alert_type == "health_issue":
        message = f"[AI 케어브릿지] {user_name} 어르신께서 건강 이상을 호소하셨습니다."
    elif alert_type == "welfare_update":
        message = f"[AI 케어브릿지] {user_name} 어르신 복지 신청 현황이 업데이트되었습니다."
    else:
        message = f"[AI 케어브릿지] {user_name} 어르신 관련 알림입니다."
    
    # TODO: 실제 SMS/푸시 알림 발송
    # Twilio 또는 FCM 연동
    
    return {
        "status": "sent",
        "message": message,
        "timestamp": "2026-01-13T10:30:00Z"
    }


@tool("send_daily_report")
async def send_daily_report(guardian_id: str, user_id: str) -> dict:
    """
    보호자에게 일일 리포트를 발송합니다.
    """
    # TODO: 일일 리포트 생성 및 발송
    return {
        "status": "sent",
        "report_type": "daily_summary"
    }
```

### 9.4 날씨 도구

```python
# backend/app/tools/weather.py

from langchain.tools import tool
from pydantic import BaseModel, Field
import httpx
from app.config import settings

class WeatherInput(BaseModel):
    region: str = Field(description="지역명 또는 지역코드")

@tool("get_weather", args_schema=WeatherInput)
async def get_weather(region: str) -> dict:
    """
    현재 날씨 정보를 조회합니다.
    
    Args:
        region: 지역명
    
    Returns:
        날씨 정보
    """
    # TODO: 기상청 API 연동
    # 예시 응답
    return {
        "region": region,
        "temperature": -2,
        "feels_like": -7,
        "condition": "맑음",
        "humidity": 45,
        "pm10": 35,  # 미세먼지
        "pm25": 18,  # 초미세먼지
        "uv_index": 2,
        "advice": "오늘은 날씨가 많이 춥습니다. 외출 시 따뜻하게 입으세요. 미세먼지는 '보통' 수준입니다."
    }


@tool("get_weekly_forecast")
async def get_weekly_forecast(region: str) -> list:
    """
    주간 날씨 예보를 조회합니다.
    """
    # TODO: 기상청 API 연동
    return [
        {"date": "2026-01-14", "high": 2, "low": -5, "condition": "맑음"},
        {"date": "2026-01-15", "high": 1, "low": -6, "condition": "구름많음"},
        # ...
    ]
```

---

## 10. API 엔드포인트

### 10.1 메인 앱 설정

```python
# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.routes import chat, voice, welfare, health
from app.rag.vectorstore import welfare_vectorstore
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Initializing vector store...")
    welfare_vectorstore.initialize()
    print("Server started!")
    yield
    # Shutdown
    print("Server shutting down...")

app = FastAPI(
    title="AI CaresBridge API",
    description="초고령 사회를 위한 에이전틱 AI 케어 플랫폼",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])
app.include_router(welfare.router, prefix="/api/welfare", tags=["Welfare"])
```

### 10.2 대화 API

```python
# backend/app/api/routes/chat.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.agents.graph import agent_graph
from app.agents.state import AgentState
from app.models.message import Message, ChatSession
from langchain_core.messages import HumanMessage
import uuid
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    emotion: Optional[dict] = None
    sources: List[str] = []
    agent_type: str

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    메시지 전송 및 AI 응답 수신
    """
    session_id = request.session_id or str(uuid.uuid4())
    
    # 초기 상태 구성
    initial_state: AgentState = {
        "messages": [HumanMessage(content=request.message)],
        "current_agent": "supervisor",
        "user_id": request.user_id,
        "user_profile": None,  # memory_load에서 로드됨
        "session_id": session_id,
        "emotion_analysis": None,
        "retrieved_docs": [],
        "tool_results": [],
        "response_context": None,
        "error": None,
        "retry_count": 0
    }
    
    # 그래프 실행 (체크포인터 사용)
    config = {"configurable": {"thread_id": session_id}}
    
    try:
        result = await agent_graph.ainvoke(initial_state, config)
        
        # 마지막 AI 메시지 추출
        ai_messages = [m for m in result["messages"] if m.type == "ai"]
        response_text = ai_messages[-1].content if ai_messages else "죄송해요, 다시 한번 말씀해 주시겠어요?"
        
        return ChatResponse(
            session_id=session_id,
            response=response_text,
            emotion=result.get("emotion_analysis").dict() if result.get("emotion_analysis") else None,
            sources=result.get("retrieved_docs", [])[:3],
            agent_type=result.get("current_agent", "unknown")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 50):
    """
    대화 기록 조회
    """
    config = {"configurable": {"thread_id": session_id}}
    
    try:
        # 체크포인트에서 상태 로드
        state = await agent_graph.aget_state(config)
        
        if state.values:
            messages = state.values.get("messages", [])
            return {
                "session_id": session_id,
                "messages": [
                    {
                        "role": m.type,
                        "content": m.content,
                        "timestamp": getattr(m, "timestamp", None)
                    }
                    for m in messages[-limit:]
                ]
            }
        return {"session_id": session_id, "messages": []}
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Session not found")


@router.delete("/session/{session_id}")
async def end_session(session_id: str):
    """
    대화 세션 종료
    """
    # TODO: 세션 종료 처리, 요약 생성
    return {"status": "ended", "session_id": session_id}
```

### 10.3 음성 API

```python
# backend/app/api/routes/voice.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.speech.stt import transcribe_audio
from app.speech.tts import synthesize_speech
import io

router = APIRouter()

class TranscriptionResponse(BaseModel):
    text: str
    confidence: float
    duration_seconds: float

class TTSRequest(BaseModel):
    text: str
    speed: float = 0.9  # 노인용 느린 속도
    voice: str = "female_warm"

@router.post("/stt", response_model=TranscriptionResponse)
async def speech_to_text(audio: UploadFile = File(...)):
    """
    음성을 텍스트로 변환 (STT)
    
    - 지원 형식: wav, mp3, m4a, webm
    - 노인 발화 특화 Whisper 모델 사용
    """
    # 파일 검증
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/webm"]
    if audio.content_type not in allowed_types:
        raise HTTPException(400, f"Unsupported audio format: {audio.content_type}")
    
    # 음성 파일 읽기
    audio_bytes = await audio.read()
    
    # STT 처리
    result = await transcribe_audio(audio_bytes)
    
    return TranscriptionResponse(
        text=result["text"],
        confidence=result["confidence"],
        duration_seconds=result["duration"]
    )


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    텍스트를 음성으로 변환 (TTS)
    
    - 느린 속도 옵션 지원 (노인용)
    - 따뜻한 여성 음성
    """
    audio_bytes = await synthesize_speech(
        text=request.text,
        speed=request.speed,
        voice=request.voice
    )
    
    return StreamingResponse(
        io.BytesIO(audio_bytes),
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=response.mp3"}
    )


@router.websocket("/stream")
async def voice_stream(websocket):
    """
    실시간 음성 스트리밍 (WebSocket)
    
    - 실시간 STT
    - 실시간 응답 생성
    - 실시간 TTS
    """
    await websocket.accept()
    
    try:
        while True:
            # 음성 청크 수신
            audio_chunk = await websocket.receive_bytes()
            
            # 실시간 처리 (VAD + STT)
            # TODO: 구현
            
            # 응답 전송
            await websocket.send_json({"type": "transcript", "text": "..."})
            
    except Exception as e:
        await websocket.close()
```

### 10.4 복지 API

```python
# backend/app/api/routes/welfare.py

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.models.welfare import WelfareProgram, WelfareEligibility, WelfareApplication
from app.tools.welfare_search import search_welfare_programs, check_eligibility

router = APIRouter()

@router.get("/search")
async def search_welfare(
    query: str = Query(..., description="검색어"),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    복지 프로그램 검색
    """
    results = await search_welfare_programs(query, category)
    return {"results": results[:limit], "total": len(results)}


@router.get("/eligibility/{user_id}")
async def check_user_eligibility(
    user_id: str,
    program_ids: List[str] = Query(...)
):
    """
    사용자의 복지 자격 확인
    """
    results = []
    for program_id in program_ids:
        eligibility = await check_eligibility(program_id, user_id)
        results.append(eligibility)
    
    return {"user_id": user_id, "eligibility": results}


@router.post("/apply")
async def apply_welfare_program(
    user_id: str,
    program_id: str
):
    """
    복지 프로그램 신청
    """
    # TODO: 신청 처리
    return {
        "status": "submitted",
        "application_id": "APP-2026-001234"
    }


@router.get("/applications/{user_id}")
async def get_applications(user_id: str):
    """
    신청 현황 조회
    """
    # TODO: 신청 현황 조회
    return {"applications": []}
```

---

## 11. 프론트엔드 구조

### 11.1 타입 정의

```typescript
// frontend/src/types/index.ts

export interface User {
  id: string;
  name: string;
  age: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: EmotionAnalysis;
  sources?: string[];
  audioUrl?: string;
}

export interface EmotionAnalysis {
  primary: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'lonely';
  confidence: number;
  riskLevel: 0 | 1 | 2;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  messages: Message[];
  startedAt: Date;
}

export interface ChatResponse {
  sessionId: string;
  response: string;
  emotion?: EmotionAnalysis;
  sources: string[];
  agentType: string;
}
```

### 11.2 API 클라이언트

```typescript
// frontend/src/services/api.ts

import axios from 'axios';
import type { ChatResponse, Message } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

export const chatApi = {
  sendMessage: async (userId: string, message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await api.post('/api/chat/message', {
      user_id: userId,
      session_id: sessionId,
      message,
    });
    return response.data;
  },

  getHistory: async (sessionId: string, limit = 50): Promise<Message[]> => {
    const response = await api.get(`/api/chat/history/${sessionId}`, {
      params: { limit },
    });
    return response.data.messages;
  },
};

export const voiceApi = {
  transcribe: async (audioBlob: Blob): Promise<{ text: string; confidence: number }> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await api.post('/api/voice/stt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  synthesize: async (text: string): Promise<Blob> => {
    const response = await api.post('/api/voice/tts', 
      { text, speed: 0.9 },
      { responseType: 'blob' }
    );
    return response.data;
  },
};
```

### 11.3 음성 녹음 훅

```typescript
// frontend/src/hooks/useVoice.ts

import { useState, useRef, useCallback } from 'react';
import { voiceApi } from '@/services/api';

interface UseVoiceReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  playAudio: (text: string) => Promise<void>;
}

export function useVoice(): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // 100ms 청크
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }
      
      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const result = await voiceApi.transcribe(audioBlob);
          resolve(result.text);
        } catch (error) {
          console.error('Transcription failed:', error);
          resolve(null);
        } finally {
          setIsProcessing(false);
        }
      };
      
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, []);

  const playAudio = useCallback(async (text: string) => {
    try {
      const audioBlob = await voiceApi.synthesize(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('TTS playback failed:', error);
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    playAudio,
  };
}
```

### 11.4 채팅 인터페이스 컴포넌트

```tsx
// frontend/src/components/chat/ChatInterface.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { VoiceButton } from './VoiceButton';
import { AIAvatar } from './AIAvatar';
import { useVoice } from '@/hooks/useVoice';
import { useChatStore } from '@/stores/chatStore';
import type { Message } from '@/types';

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChatStore();
  const { isRecording, isProcessing, startRecording, stopRecording, playAudio } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 음성 입력 처리
  const handleVoiceInput = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        const response = await sendMessage(text);
        if (response) {
          setIsSpeaking(true);
          await playAudio(response);
          setIsSpeaking(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">AI 케어브릿지</h1>
        <p className="text-sm opacity-80">언제든 말씀해 주세요</p>
      </header>

      {/* AI 아바타 */}
      <div className="flex justify-center py-6">
        <AIAvatar isSpeaking={isSpeaking} isListening={isRecording} />
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-2xl px-4 py-3">
              <span className="animate-pulse">잠시만요...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 음성 버튼 */}
      <div className="p-6 flex justify-center">
        <VoiceButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={handleVoiceInput}
        />
      </div>
    </div>
  );
}
```

### 11.5 음성 버튼 컴포넌트

```tsx
// frontend/src/components/chat/VoiceButton.tsx

'use client';

import { motion } from 'framer-motion';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export function VoiceButton({ isRecording, isProcessing, onClick }: VoiceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isProcessing}
      className={`
        w-20 h-20 rounded-full flex items-center justify-center
        text-white text-3xl shadow-lg
        transition-colors duration-200
        ${isRecording 
          ? 'bg-red-500 ring-4 ring-red-300 ring-opacity-50' 
          : 'bg-blue-600 hover:bg-blue-700'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileTap={{ scale: 0.95 }}
      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
    >
      {isProcessing ? (
        <span className="animate-spin">⏳</span>
      ) : isRecording ? (
        <FaStop />
      ) : (
        <FaMicrophone />
      )}
    </motion.button>
  );
}
```

---

## 12. 배포 설정

### 12.1 Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - REDIS_URL=redis://redis:6379/0
    env_file:
      - ./backend/.env
    depends_on:
      - redis
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

volumes:
  redis_data:
```

### 12.2 Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 12.3 Frontend Dockerfile

```dockerfile
# frontend/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 13. 개발 순서 가이드

Claude Code로 개발 시 아래 순서를 따르세요:

### Phase 1: 기반 구축 (Day 1-2)

```bash
# 1. 프로젝트 초기화
mkdir ai-carebridge && cd ai-carebridge
mkdir backend frontend

# 2. Backend 설정
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. 기본 구조 생성
# - app/main.py
# - app/config.py
# - app/models/*.py
```

### Phase 2: 에이전트 코어 (Day 3-5)

```bash
# 1. AgentState 정의
# - app/agents/state.py

# 2. 각 노드 구현
# - app/agents/nodes/supervisor.py
# - app/agents/nodes/welfare.py
# - app/agents/nodes/companion.py

# 3. 그래프 조립
# - app/agents/graph.py
```

### Phase 3: RAG 시스템 (Day 6-7)

```bash
# 1. 문서 수집
# - data/welfare_docs/ 에 복지 PDF 저장

# 2. 벡터스토어 구축
# - app/rag/loader.py
# - app/rag/vectorstore.py
# - app/rag/retriever.py

# 3. 인덱싱 테스트
python -c "from app.rag.vectorstore import welfare_vectorstore; welfare_vectorstore.initialize()"
```

### Phase 4: API 구현 (Day 8-9)

```bash
# 1. 라우터 구현
# - app/api/routes/chat.py
# - app/api/routes/voice.py

# 2. 테스트
uvicorn app.main:app --reload
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "message": "난방비 지원 받을 수 있어요?"}'
```

### Phase 5: 음성 처리 (Day 10-11)

```bash
# 1. STT 구현
# - app/speech/stt.py (Whisper)

# 2. TTS 구현
# - app/speech/tts.py

# 3. 통합 테스트
```

### Phase 6: 프론트엔드 (Day 12-14)

```bash
# 1. Next.js 초기화
cd frontend
npx create-next-app@latest . --typescript --tailwind

# 2. 컴포넌트 구현
# - src/components/chat/*.tsx

# 3. API 연동
# - src/services/api.ts
```

### Phase 7: 통합 및 배포 (Day 15-18)

```bash
# 1. Docker 빌드
docker-compose build

# 2. 테스트 실행
docker-compose up

# 3. 시나리오 테스트
# - 복지 검색 시나리오
# - 정서 케어 시나리오
# - 병원 예약 시나리오
```

---

## 마무리

이 문서는 Claude Code가 즉시 개발에 착수할 수 있도록 필요한 모든 기술 사양을 담고 있습니다.

개발 시 다음 명령으로 시작하세요:

```
"이 Technical Spec을 기반으로 AI 케어브릿지 백엔드를 구현해줘. 
Phase 1부터 순서대로 진행하고, 각 단계마다 테스트 코드도 작성해줘."
```

---

**문서 끝**
