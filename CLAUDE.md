# AI 케어브릿지 (AI CareBridge)

초고령 사회를 위한 에이전틱(Agentic) AI 케어 플랫폼

## 프로젝트 개요

AI 케어브릿지는 65세 이상 시니어를 위한 음성 기반 AI 복지 도우미입니다.
LangGraph 멀티 에이전트 아키텍처를 활용하여 복지 정보 안내, 정서 케어, 일상 도움을 제공합니다.

### 주요 기능
- 🎤 **음성 대화**: STT/TTS 기반 자연스러운 음성 인터페이스
- 📋 **복지 정보**: RAG 기반 맞춤형 복지 프로그램 검색 및 안내
- 💬 **정서 케어**: 공감 대화 및 위기 상황 감지
- 📍 **생활 정보**: 날씨, 일정, 병원 예약 등 일상 도움

## 기술 스택

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **LLM**: Upstage Solar Pro 2 (한국어 특화)
- **Agent**: LangGraph (멀티 에이전트 오케스트레이션)
- **Vector DB**: ChromaDB (복지 정보 RAG)
- **STT**: Upstage Whisper / OpenAI Whisper
- **TTS**: OpenAI TTS / Edge TTS (한국어)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 프로젝트 구조

```
ai-carebridge/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 엔트리포인트
│   │   ├── config.py            # 환경 설정
│   │   ├── agents/              # LangGraph 에이전트
│   │   │   ├── graph.py         # 에이전트 그래프 정의
│   │   │   ├── state.py         # 상태 스키마
│   │   │   ├── nodes/           # 에이전트 노드
│   │   │   │   ├── supervisor.py
│   │   │   │   ├── welfare.py   # 복지 에이전트 (RAG)
│   │   │   │   ├── companion.py # 정서 케어 에이전트
│   │   │   │   ├── daily.py     # 일상 정보 에이전트
│   │   │   │   └── memory.py    # 메모리 관리
│   │   │   └── prompts/         # 시스템 프롬프트
│   │   ├── api/routes/          # API 라우트
│   │   │   ├── chat.py
│   │   │   ├── voice.py         # STT/TTS API
│   │   │   ├── welfare.py       # 복지 정보 API
│   │   │   └── health.py
│   │   ├── services/            # 서비스 레이어
│   │   │   ├── vectorstore.py   # ChromaDB
│   │   │   ├── embedding.py     # 임베딩
│   │   │   ├── rag.py           # RAG 검색
│   │   │   ├── stt.py           # 음성 인식
│   │   │   └── tts.py           # 음성 합성
│   │   └── models/              # Pydantic 모델
│   ├── data/
│   │   └── welfare_programs.json # 복지 프로그램 데이터
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx         # 메인 페이지
    │   │   ├── layout.tsx
    │   │   ├── globals.css
    │   │   └── welfare/         # 복지 정보 페이지
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── QuickMenu.tsx
    │   │   └── VoiceChat.tsx    # 음성 대화 컴포넌트
    │   └── lib/
    │       └── api.ts           # API 클라이언트
    ├── tailwind.config.ts
    └── package.json
```

## 실행 방법

### 1. 환경 설정

```bash
# Backend 환경변수 설정
cd backend
cp .env.example .env
# .env 파일에서 UPSTAGE_API_KEY 설정
```

### 2. Backend 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 4. 접속
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## API 엔드포인트

### Chat
- `POST /api/chat/` - 텍스트 대화

### Voice
- `POST /api/voice/stt` - 음성 → 텍스트
- `POST /api/voice/tts` - 텍스트 → 음성
- `POST /api/voice/tts/senior` - 노인 친화적 TTS
- `POST /api/voice/conversation` - 음성 대화 통합

### Welfare (RAG)
- `POST /api/welfare/rag/search` - 복지 정보 검색
- `POST /api/welfare/rag/initialize` - RAG 초기화
- `GET /api/welfare/rag/categories` - 카테고리 목록

### Health
- `GET /health` - 서버 상태 확인

## 환경 변수

```env
# 필수
UPSTAGE_API_KEY=your_upstage_api_key

# 선택 (TTS용)
OPENAI_API_KEY=your_openai_api_key

# 기타
APP_ENV=development
DEBUG=true
```

## 개발 가이드

### 새로운 에이전트 추가
1. `backend/app/agents/nodes/`에 새 노드 파일 생성
2. `backend/app/agents/prompts/`에 시스템 프롬프트 추가
3. `backend/app/agents/graph.py`에서 그래프에 노드 연결

### 복지 데이터 추가
1. `backend/data/welfare_programs.json` 파일 수정
2. `POST /api/welfare/rag/initialize` 호출하여 재인덱싱

### 프론트엔드 페이지 추가
1. `frontend/src/app/` 디렉토리에 새 폴더/page.tsx 생성
2. `frontend/src/components/QuickMenu.tsx`에 메뉴 항목 추가

## 테스트

```bash
# Backend 테스트
cd backend
pytest

# Frontend 빌드 테스트
cd frontend
npm run build
```

## 디자인 시스템

### 색상
- Primary: `#F97316` (따뜻한 오렌지)
- Secondary: `#22C55E` (차분한 그린)
- Background: `#FFF8F0` (따뜻한 베이지)

### 폰트
- 본문: Pretendard Variable
- 제목: GmarketSans

### 노인 친화적 UI 원칙
- 최소 글씨 크기: 18px (1.125rem)
- 최소 터치 타겟: 48px
- 높은 색상 대비
- 명확한 피드백 애니메이션

## 라이선스

MIT License

## 팀

- AI Bootcamp 2026

---

Demo Day: 2026년 2월 6일
