# AI 케어브릿지 (AI Care Bridge)

> 초고령 사회를 위한 에이전틱(Agentic) AI 케어 플랫폼

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.26-orange.svg)](https://langchain-ai.github.io/langgraph)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)

## 프로젝트 소개

AI 케어브릿지는 시니어 사용자에게 **음성 기반 복지 안내, 정서 케어, 생활 지원 서비스**를 제공하는 LangGraph 기반 멀티 에이전트 시스템입니다.

### 핵심 기능

| 기능 | 설명 |
|------|------|
| **복지 정보 안내** | RAG 기반 맞춤형 복지 혜택 검색 (15개 프로그램) |
| **정서 케어** | 공감 대화, 회상 요법, 위기 상황 감지 |
| **생활 지원** | 날씨, 일정 관리 등 일상 도움 |
| **음성 인터페이스** | 노인 친화적 TTS (느린 속도, 따뜻한 톤) |

## 기술 스택

| 영역 | 기술 |
|------|------|
| **LLM** | Upstage Solar Pro 2 (한국어 특화) |
| **Embedding** | Upstage Solar Embedding Large |
| **Agent Framework** | LangGraph |
| **Vector DB** | ChromaDB |
| **TTS** | Edge TTS (ko-KR-SunHiNeural) |
| **Backend** | FastAPI (Python 3.11+) |
| **Frontend** | Next.js 14 + Tailwind CSS + Framer Motion |

## 에이전트 아키텍처

```
[사용자 발화]
     ↓
[memory_load] → 사용자 프로필 로드
     ↓
[supervisor] → 의도 분류 + 감정 분석
     ↓ (조건부 라우팅)
┌────┼────┬────┐
↓    ↓    ↓    ↓
[welfare] [companion] [daily] [end]
     │         │         │
     └─────────┴─────────┘
             ↓
      [memory_save]
             ↓
        [TTS 응답]
```

### 에이전트 역할

- **Supervisor**: 사용자 의도 분류 (welfare/companion/daily/end) + 감정 분석
- **Welfare Agent**: RAG 기반 복지 정보 검색 및 안내
- **Companion Agent**: 정서 케어, 공감 대화, 위기 상황 대응
- **Daily Agent**: 날씨, 일정 등 일상 정보 제공

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/yonghwan1106/aibootcamp-carebridge.git
cd aibootcamp-carebridge
```

### 2. Backend 설정

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 UPSTAGE_API_KEY 설정
```

### 3. Backend 서버 실행

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# API 문서 확인: http://localhost:8000/docs
```

### 4. Frontend 설정 및 실행

```bash
cd frontend

npm install
npm run dev

# 접속: http://localhost:3000
```

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/chat/send` | 메시지 전송 (LangGraph 에이전트 호출) |
| GET | `/api/chat/history/{session_id}` | 대화 기록 조회 |
| POST | `/api/voice/tts/senior` | 노인 친화적 TTS |
| POST | `/api/welfare/rag/search` | 복지 정보 RAG 검색 |
| POST | `/api/welfare/rag/initialize` | RAG 벡터 DB 초기화 |
| GET | `/health` | 서버 상태 확인 |

## 환경 변수

```env
# 필수
UPSTAGE_API_KEY=your_upstage_api_key

# 선택 (TTS 폴백용)
OPENAI_API_KEY=your_openai_api_key

# Upstage 모델
UPSTAGE_MODEL=solar-pro2
UPSTAGE_EMBEDDING_MODEL=solar-embedding-1-large-passage
```

## 프로젝트 구조

```
aibootcamp-carebridge/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI 앱
│   │   ├── config.py         # 환경 설정
│   │   ├── agents/           # LangGraph 에이전트
│   │   │   ├── graph.py      # 멀티 에이전트 그래프
│   │   │   ├── nodes/        # 각 에이전트 노드
│   │   │   └── prompts/      # 시스템 프롬프트
│   │   ├── api/routes/       # API 라우터
│   │   ├── services/         # 비즈니스 로직
│   │   └── models/           # Pydantic 모델
│   └── data/
│       └── welfare_programs.json  # 복지 데이터 (15개)
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js 페이지
│   │   │   ├── companion/    # 말벗 대화
│   │   │   ├── welfare/      # 복지 정보
│   │   │   ├── daily/        # 일상 정보
│   │   │   └── emergency/    # 긴급 연락
│   │   ├── components/       # React 컴포넌트
│   │   └── lib/              # 유틸리티
│   └── package.json
├── CLAUDE.md                  # 개발 가이드
├── DEMO_SCENARIO.md           # 데모 시나리오
└── README.md
```

## 노인 친화적 UI/UX

- **큰 글씨**: 기본 18px 이상
- **큰 버튼**: 터치 타겟 48px 이상
- **높은 대비**: 명확한 색상 구분
- **따뜻한 색상**: 오렌지 (#F97316) + 베이지 (#FFF8F0) 조합
- **느린 TTS**: 0.85x 속도, 따뜻한 한국어 음성

## 데모데이 정보

- **일시**: 2026년 2월 6일
- **장소**: 서울 강남구 미왕빌딩
- **행사**: 커널 아카데미 AI 부트캠프 15기 데모데이

## 라이선스

MIT License

## 연락처

- GitHub: [@yonghwan1106](https://github.com/yonghwan1106)

---

*AI 케어브릿지 - 따뜻한 기술로 연결되는 시니어 케어*
