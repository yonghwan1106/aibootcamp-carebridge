# AI 케어브릿지 (AI Care Bridge)

> 초고령 사회를 위한 에이전틱(Agentic) AI 케어 플랫폼

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.26-orange.svg)](https://langchain-ai.github.io/langgraph)

## 프로젝트 소개

AI 케어브릿지는 시니어 사용자에게 **음성 기반 복지 안내, 정서 케어, 생활 지원 서비스**를 제공하는 LangGraph 기반 멀티 에이전트 시스템입니다.

### 핵심 기능

- **복지 정보 안내**: RAG 기반 맞춤형 복지 혜택 검색 및 신청 대행
- **정서 케어**: 따뜻한 대화와 정서적 지지, 위기 상황 감지
- **생활 지원**: 날씨, 병원 예약, 일정 관리 등
- **음성 인터페이스**: 노인 발화 특화 STT/TTS

## 기술 스택

| 영역 | 기술 |
|------|------|
| LLM | Upstage Solar Pro 2 |
| Agent Framework | LangGraph |
| STT | Whisper Large-v3 |
| TTS | OpenAI TTS / VITS |
| Vector DB | ChromaDB |
| Memory | Redis |
| Backend | FastAPI (Python 3.11+) |
| Frontend | Next.js 14 + React |

## 프로젝트 구조

```
ai-carebridge/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── config.py            # 환경 설정
│   │   ├── api/routes/          # API 라우터
│   │   ├── agents/              # LangGraph 에이전트
│   │   │   ├── graph.py         # 멀티 에이전트 그래프
│   │   │   ├── state.py         # AgentState 정의
│   │   │   ├── nodes/           # 각 에이전트 노드
│   │   │   └── prompts/         # 시스템 프롬프트
│   │   ├── models/              # Pydantic 모델
│   │   ├── rag/                 # RAG 파이프라인
│   │   ├── memory/              # Redis 기억 저장
│   │   ├── speech/              # STT/TTS 처리
│   │   └── tools/               # Function Calling 도구
│   ├── data/                    # 복지 문서, 벡터 DB
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js 페이지
│   │   ├── components/          # React 컴포넌트
│   │   ├── hooks/               # Custom Hooks
│   │   └── stores/              # Zustand 상태 관리
│   └── package.json
└── README.md
```

## 시작하기

### 1. 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/yonghwan1106/ai-carebridge.git
cd ai-carebridge

# Backend 설정
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 입력
```

### 2. 서버 실행

```bash
# Backend 서버 실행
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# API 문서 확인
# http://localhost:8000/docs
```

### 3. Frontend 실행 (개발 예정)

```bash
cd frontend
npm install
npm run dev
```

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/chat/send` | 메시지 전송 |
| GET | `/api/chat/history/{session_id}` | 대화 기록 조회 |
| POST | `/api/voice/stt` | 음성 → 텍스트 |
| POST | `/api/voice/tts` | 텍스트 → 음성 |
| POST | `/api/welfare/search` | 복지 정보 검색 |
| GET | `/health` | 서버 상태 확인 |

## 에이전트 아키텍처

```
[사용자 발화]
     ↓
[memory_load] → 사용자 프로필 로드
     ↓
[supervisor] → 의도 분류 + 감정 분석
     ↓ (조건부 라우팅)
┌────┼────┐
↓    ↓    ↓
[welfare] [companion] [daily]
     ↓
[memory_save] → 대화 기록 저장
     ↓
  [응답]
```

## 환경 변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `UPSTAGE_API_KEY` | Upstage Solar Pro API 키 | O |
| `OPENAI_API_KEY` | OpenAI API 키 (TTS용) | △ |
| `REDIS_URL` | Redis 연결 URL | △ |

## 데모데이 정보

- **일시**: 2026년 2월 6일
- **장소**: 서울 강남구 미왕빌딩
- **행사**: 커널 아카데미 AI 부트캠프 15기 데모데이

## 라이선스

MIT License

## 연락처

- GitHub: [@yonghwan1106](https://github.com/yonghwan1106)
