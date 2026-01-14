# **커널 아카데미 AI 창업 부트캠프 데모데이 전략 보고서: 초고령 사회를 위한 에이전틱(Agentic) AI 플랫폼 'AI 케어브릿지' 사업화 및 프로토타입 구현 전략**

## **1\. 서론: 2026년 AI 창업 생태계의 대전환과 아이템 선정의 배경**

### **1.1 데모데이의 전략적 중요성 및 환경 분석**

2026년 2월 6일 서울 강남구 미왕빌딩에서 개최되는 커널 아카데미 AI 부트캠프 15기 데모데이는 단순한 수료식이 아닌, 예비 창업가들이 실제 투자 시장(VC)에 데뷔하는 결정적인 모멘텀입니다. 제공된 정보에 따르면, 이번 행사에는 VC 관련 업체 대표 및 담당자가 직접 참여하여 피칭에 대한 피드백을 제공할 예정입니다. 이는 단순한 기술적 완성도를 넘어, 시장성(Marketability), 확장성(Scalability), 그리고 시의성(Timeliness)을 갖춘 비즈니스 모델이 요구됨을 시사합니다. 특히 2026년 초입의 벤처 투자 환경은 '플랫폼의 시대'에서 실질적인 문제를 해결하는 '딥테크(Deep Tech) 및 에이전틱 AI(Agentic AI)의 시대'로 급격히 재편되고 있습니다.1

### **1.2 대상 아이템 선정: 'AI 케어브릿지' (AI Care Bridge)**

본 보고서는 업로드된 '수상내역(2025).xlsx' 데이터를 정밀 분석한 결과, 2025년 12월 30일 한국지능정보사회진흥원(NIA) 주관 'AI 에이전트 서비스 시나리오 공모전'에서 최우수상을 수상한 \*\*'AI 케어브릿지'\*\*를 최적의 창업 아이템으로 선정하였습니다.3

선정의 핵심 근거는 다음과 같습니다:

1. **메가트렌드 부합성:** 2026년 대한민국은 초고령 사회 진입과 동시에 디지털 돌봄 수요가 폭발하는 '에이지테크(AgeTech)'의 중흥기를 맞이하고 있습니다. 'AI 케어브릿지'는 이러한 인구통계학적 위기를 AI 기술로 해결하는 솔루션으로서, 정부의 정책 자금(B2G)과 민간 시장의 구매력(B2B/B2C)을 동시에 공략할 수 있는 잠재력을 보유하고 있습니다.4  
2. **기술적 차별성 (Agentic AI):** 단순한 챗봇이 아닌, 사용자의 의도를 파악하고 외부 도구(Tool)를 사용하여 실질적인 과업(복지 신청, 병원 예약 등)을 수행하는 '에이전트(Agent)' 기술이 2026년 AI 시장의 핵심 키워드입니다.2 이 아이템은 '시나리오' 단계에서 검증된 아이디어를 최신 기술인 랭그래프(LangGraph)와 소버린(Sovereign) LLM으로 구현하기에 최적화된 구조를 가지고 있습니다.  
3. **검증된 우수성:** 이미 NIA(한국지능정보사회진흥원)라는 공신력 있는 기관의 공모전에서 최우수상을 수상함으로써, 아이디어의 논리적 타당성과 공익적 가치를 일차적으로 검증받았습니다. 이는 데모데이 심사위원들에게 강력한 신뢰 기제(Trust Mechanism)로 작용할 것입니다.

## ---

**2\. 시장 분석 및 비즈니스 기회: 왜 지금 'AI 케어브릿지'인가?**

### **2.1 2026년 대한민국 시니어 산업의 구조적 변화**

2026년은 대한민국 시니어 산업, 즉 '실버 이코노미'가 양적 팽창을 넘어 질적 고도화 단계로 진입하는 원년입니다. 케어닥(CareDoc) 등 주요 업계 리더들이 선정한 2026년의 키워드는 'INFRA'로, 이는 통합 돌봄(Integrated Care), 차세대 노인의학(Next-Gen Senior Healthcare), 그리고 AI 기반 돌봄(AI for Care)의 본격적인 인프라 구축을 의미합니다.4

기존의 시니어 케어 시장은 요양보호사 중개나 단순 모니터링 디바이스(IoT)에 국한되어 있었습니다. 그러나 2026년에 이르러 베이비부머 세대의 본격적인 은퇴와 함께, 능동적이고 개인화된 디지털 헬스케어 서비스에 대한 니즈가 급증하고 있습니다. 특히 정부의 '제4차 저출산·고령사회 기본계획' 및 각종 지자체의 스마트 경로당 사업 등은 AI 기반의 비대면 돌봄 서비스에 막대한 예산을 투입하고 있어, 스타트업에게는 B2G 시장 진입의 기회가 활짝 열려 있습니다.5

### **2.2 '돌봄 절벽'과 디지털 격차의 심화**

가장 시급한 문제는 '돌봄 인력의 부족'과 노인들의 '디지털 소외' 현상입니다. 요양보호사 1인이 감당해야 할 노인 수가 급증하면서 인력 중심의 돌봄은 한계에 봉착했습니다. 동시에, 키오스크, 모바일 뱅킹, 정부24 등 생활 필수 서비스가 급격히 디지털화되면서, 이를 다루지 못하는 고령층은 생존권적 위협을 받고 있습니다.

'AI 케어브릿지'는 바로 이 지점, 즉 \*\*'인력 부족'과 '디지털 장벽' 사이의 간극(Gap)\*\*을 메우는 기술적 가교 역할을 수행합니다. 이는 단순한 말벗 서비스를 넘어, 복잡한 디지털 과업을 노인 대신 수행해주는 '대리인(Agent)'으로서의 가치를 제안합니다.

### **2.3 경쟁사 분석 및 차별화 전략**

현재 시장에는 '효돌(Hyodol)'과 같은 AI 반려 로봇이나 '케어닥'과 같은 인력 매칭 플랫폼이 존재합니다.

* **효돌(Hyodol):** 봉제 인형 형태의 하드웨어 기반 서비스로, 정서적 교감에는 강점이 있으나, 높은 도입 비용(하드웨어)과 제한적인 확장성(단순 시나리오 기반 대화)이 한계로 지적됩니다.10  
* **케어닥/케어네이션:** 오프라인 요양 보호사 매칭에 집중되어 있어, 일상적인 비대면 케어와 디지털 생활 지원 영역에는 공백이 존재합니다.4

**AI 케어브릿지의 차별화 포인트:**

1. **Asset-Light (Software Only):** 고가의 전용 로봇 대신, 보급률이 높은 스마트폰, 태블릿, 또는 기존 AI 스피커(NUGU, GiGA Genie 등)를 활용하는 소프트웨어 에이전트 형태를 지향하여 초기 진입 장벽을 낮춥니다.  
2. **Hyper-Personalized (초개인화):** LangGraph의 장기 기억(Long-term Memory) 기술을 활용하여 사용자의 건강 상태, 가족 관계, 선호도를 지속적으로 학습하고 기억합니다.13  
3. **Task-Oriented (과업 중심):** 단순 대화를 넘어, "난방비 지원금 신청해줘"와 같은 구체적인 생활 과업을 수행하는 에이전틱 워크플로우를 탑재합니다.

## ---

**3\. 핵심 기술 전략: 실서비스 수준의 프로토타입 구현을 위한 아키텍처**

데모데이에서 심사위원들을 사로잡기 위해서는 단순한 '데모용 영상'이 아닌, 실제 작동하는 코드와 아키텍처를 보여주어야 합니다. 특히 'AI 케어브릿지'와 같은 에이전트 서비스는 **환각(Hallucination) 제어**, **장기 기억 유지**, 그리고 \*\*정확한 도구 사용(Tool Use)\*\*이 기술적 해자(Moat)가 됩니다.

### **3.1 LLM 모델 선정: 국산화 및 보안을 위한 'Upstage Solar Pro'**

공공 데이터 및 시니어의 민감한 개인정보(PHI)를 다루는 서비스 특성상, 데이터 주권(Data Sovereignty)과 한국어 처리 능력은 필수적입니다. 따라서, 글로벌 빅테크 모델(GPT-4, Claude)보다는 한국어 성능이 압도적이며, 2026년 기준 '프런티어 모델'로 인정받은 **업스테이지(Upstage)의 Solar Pro (Solar-Pro-2)** 모델을 메인 LLM으로 선정합니다.15

* **선정 이유:**  
  * **한국어 특화 성능:** 한국어 뉘앙스, 높임말, 사투리 처리에 있어 외산 모델 대비 탁월한 성능을 보이며, 한국어 벤치마크(Ko-MMLU 등)에서 GPT-4를 상회하는 결과를 입증했습니다.17  
  * **문서 처리 능력 (Document Parse):** 노인 복지 혜택 등은 복잡한 공문서(HWP, PDF) 형태로 제공됩니다. Solar Pro의 강력한 문서 파싱 및 구조화 능력(Layout Analysis)은 복지 정보를 정확히 추출하여 RAG(검색 증강 생성) 시스템을 구축하는 데 핵심적입니다.19  
  * **비용 효율성:** 30B 파라미터 규모의 경량화된 모델(SLM)로서, 스타트업이 감당 가능한 추론 비용으로 고성능을 낼 수 있는 'Depth-Up Scaling' 기술이 적용되어 있습니다.17

### **3.2 에이전트 오케스트레이션: 'LangGraph' 기반의 다중 에이전트 시스템**

2026년 AI 개발 트렌드의 핵심인 **LangGraph**를 활용하여 복잡한 시니어 케어 시나리오를 제어 가능한 그래프(State Graph) 형태로 구현합니다.21 LangChain의 선형적(Chain) 구조는 복잡한 예외 상황이 많은 노인과의 대화에서 한계를 보입니다. 반면, LangGraph는 순환(Cycle)과 분기(Branching)가 가능한 그래프 구조를 통해, 사용자가 말을 못 알아들었을 때 다시 묻거나, 대화 도중 주제가 바뀌어도 유연하게 대응할 수 있습니다.

#### **\[시스템 아키텍처 설계: 계층적 에이전트 모델\]**

1. **슈퍼바이저 에이전트 (Supervisor Node):** 사용자의 발화 의도를 분류(Router)하고, 적절한 하위 에이전트에게 제어권을 넘기는 관제탑 역할을 합니다.  
   * *예시:* "허리가 아파서 병원 가야겠어" \-\> 의료 에이전트 호출 / "오늘 날씨 어때?" \-\> 생활 에이전트 호출.  
2. **복지 전문 에이전트 (Welfare Specialist):** RAG(검색 증강 생성)를 통해 최신 정부 복지 공고를 검색하고, 사용자의 자격 요건을 대조하여 맞춤형 혜택을 안내합니다.  
3. **정서 케어 에이전트 (Companion Specialist):** 페르소나(Persona)가 부여된 에이전트로, 공감적 대화를 수행하며 사용자의 정서 상태를 분석하여 우울증 징후를 조기에 감지합니다.  
4. **기억 관리자 (Memory Manager):** LangGraph의 체크포인트(Checkpointer) 기능을 활용하여, 단기 대화 맥락뿐만 아니라 장기적인 사용자 정보(지병, 가족 관계, 기호 등)를 데이터베이스(Redis/MongoDB)에 저장하고 불러옵니다.13

### **3.3 음성 인식(STT) 고도화: 노인 음성 특화 파이프라인**

노인들의 발화는 발음이 부정확하거나, 속도가 느리고, 사투리가 섞여 있는 경우가 많아 일반적인 STT(Speech-to-Text) 모델로는 인식률이 현저히 떨어집니다. 이를 극복하기 위해 **파인튜닝된 Whisper 모델**을 적용합니다.23

* **구현 전략:** OpenAI의 Whisper Large-v3 모델을 베이스로, AI Hub 등에 공개된 '한국어 노인 발화 데이터셋(KsponSpeech 등)'을 활용하여 LoRA(Low-Rank Adaptation) 방식으로 미세 조정(Fine-tuning)합니다. 이를 통해 '사투리'와 '어눌한 발음'에 대한 인식 정확도를 획기적으로 개선하여 기술적 차별성을 확보합니다.24

## ---

**4\. 실서비스 프로토타입 구현 가이드 (Step-by-Step)**

부트캠프의 마지막 4주 동안 구현 가능한 현실적이고 구체적인 개발 로드맵입니다.

### **4.1 1주차: 데이터 구축 및 백엔드 설계**

* **복지 데이터베이스 구축 (RAG용):** '복지로', '정부24', 각 지자체 홈페이지의 2026년 노인 복지 정책 PDF/HWP 문서를 수집합니다. 이를 **Upstage Document Parse API**를 사용하여 구조화된 마크다운(Markdown)이나 JSON 형태로 변환하고, 벡터 데이터베이스(Pinecone 또는 ChromaDB)에 임베딩하여 저장합니다.19 이는 할루시네이션 없는 정확한 정보 제공의 기반이 됩니다.  
* **LangGraph 상태 스키마(State Schema) 정의:** 에이전트 간에 공유할 상태(State)를 정의합니다.  
  Python  
  from typing import TypedDict, Annotated, List  
  from langgraph.graph.message import add\_messages

  class AgentState(TypedDict):  
      messages: Annotated\[List\[dict\], add\_messages\] \# 대화 기록  
      user\_profile: dict \# 사용자 정보 (나이, 주소, 질환 등)  
      current\_intent: str \# 현재 의도 (복지상담, 잡담, 응급 등)  
      welfare\_data: str \# 검색된 복지 정보  
      risk\_score: float \# 정서적 위험도 점수

### **4.2 2주차: 핵심 에이전트 로직 구현 (LangGraph & Solar Pro)**

* **Supervisor(Router) 구현:** Solar Pro API를 사용하여 사용자의 발화를 분석하고 다음 실행할 에이전트를 결정하는 프롬프트를 작성합니다.  
  * *프롬프트 예시:* "당신은 시니어 케어 매니저입니다. 사용자의 발화를 분석하여 중 하나의 카테고리로 분류하세요."  
* **복지 에이전트 (RAG) 연결:** 사용자의 질문을 쿼리로 변환하여 벡터 DB를 검색하고, 검색된 문서를 컨텍스트로 Solar Pro에게 답변을 생성하도록 합니다. 이때 'Groundedness Check' API를 활용하여 답변의 근거가 문서에 있는지 검증하는 단계를 추가하여 신뢰도를 높입니다.27  
* **도구(Tool) 구현:** 실제 기능을 수행하는 함수(Python Function)를 정의하고 Solar Pro의 Function Calling 기능과 연결합니다.29  
  * search\_welfare(keyword): 복지 정보 검색  
  * send\_alert\_to\_guardian(message): 보호자에게 카카오톡/문자 알림 전송  
  * record\_health\_log(blood\_pressure, symptoms): 건강 기록 저장

### **4.3 3주차: 프론트엔드 및 음성 인터페이스 연동**

* **UI/UX 디자인:** 시니어를 위한 'Big & Simple' UI를 적용합니다. 복잡한 메뉴 대신 거대한 마이크 버튼과 직관적인 카드 뉴스 형태의 정보를 제공합니다. 프레임워크로는 빠른 개발이 가능한 **Streamlit** (웹 프로토타입용) 또는 **Flutter** (모바일 앱용)를 권장합니다. 데모데이 시연을 위해 태블릿(iPad/Galaxy Tab) 환경에 최적화된 키오스크 모드 UI를 구성합니다.  
* **음성 파이프라인 통합:**  
  * Input: 마이크 입력 \-\> 파인튜닝된 Whisper 모델 \-\> 텍스트 변환.  
  * Processing: LangGraph 에이전트 처리.  
  * Output: 텍스트 답변 \-\> TTS (ElevenLabs 또는 네이버 클로바 더빙 등 자연스러운 한국어 음성) \-\> 스피커 출력.  
  * *Latency 최적화:* 사용자가 답답함을 느끼지 않도록, STT가 완료되는 즉시 "잠시만요, 찾아보고 있어요"와 같은 필러(Filler) 음성을 송출하거나, 스트리밍(Streaming) 방식으로 답변을 생성하여 반응 속도를 높입니다.31

### **4.4 4주차: 테스트 및 데모 시나리오 최적화**

* **페르소나 테스트:** 다양한 노인 페르소나(독거노인, 치매 초기 환자 등)를 설정하여 시뮬레이션을 반복합니다.  
* **데모 시나리오 확정:** 데모데이 당일 시연할 '골든 시나리오'를 작성합니다. 가장 극적인 효과를 줄 수 있는 '복지 사각지대 해소' 사례를 연출합니다.  
  * *예시 시나리오:* 사용자가 "요즘 난방비가 너무 많이 나와서 걱정이야"라고 무심코 말했을 때, AI가 이를 캐치하여 "어르신, 혹시 에너지 바우처 아직 신청 안 하셨나요? 제가 확인해 드릴까요?"라고 먼저 제안(Proactive)하고, 신청 자격을 확인해주는 과정.

## ---

**5\. 데모데이 피칭 전략: 투자자의 마음을 여는 스토리텔링**

### **5.1 오프닝: 문제의식의 구체화 (Hook)**

"2026년, 대한민국에는 1천만 명의 노인이 살고 있습니다. 하지만 이들 중 60%는 키오스크 앞에서 발길을 돌리고, 스마트폰 앱으로 택시를 부르지 못해 추운 길가에서 떨고 있습니다. 우리는 이들을 '디지털 난민'이라 부릅니다. 더 심각한 것은, 받아야 할 복지 혜택조차 신청 방법이 복잡해 놓치고 있다는 사실입니다. 'AI 케어브릿지'는 바로 이 디지털 절벽에 놓인 어르신들을 위한, 세상에서 가장 따뜻하고 똑똑한 디지털 손자입니다."

### **5.2 솔루션: 기술적 우위 강조 (Why Us?)**

단순한 아이디어 제시가 아니라, **'어떻게(How)'** 구현했는지에 집중합니다.

* **Sovereign AI:** "우리는 한국의 행정 용어와 복지 시스템을 가장 잘 이해하는 업스테이지의 Solar Pro 모델을 사용하여, 외산 모델이 흉내 낼 수 없는 정확한 행정 처리를 지원합니다."  
* **Agentic Workflow:** "단순히 대화만 하는 챗봇이 아닙니다. LangGraph 기반의 자율 에이전트가 어르신을 대신해 복지 사이트에 접속하고, 정보를 찾고, 신청서를 작성하는 '행동하는 AI'입니다."  
* **장기 기억:** "어제 어르신이 '무릎이 아프다'고 했다면, 오늘 아침에는 '무릎은 좀 어떠세요?'라고 먼저 안부를 묻습니다. 이것이 기술이 인간을 이해하는 방식입니다."

### **5.3 비즈니스 모델: 지속 가능성 (Scalability)**

명확한 수익 모델을 제시하여 투자가치를 증명합니다.

* **B2G (1차 타겟):** 지자체 및 보건소 대상의 '스마트 돌봄 사업' 수주. 효돌과 같은 하드웨어 도입 예산을 소프트웨어 라이선스(SaaS) 형태로 전환 유도. (조달청 혁신시제품 등록 목표).32  
* **B2B (2차 타겟):** 민간 보험사 및 상조 회사. 시니어 헬스케어 데이터를 활용한 맞춤형 보험 상품 개발 및 리스크 관리 솔루션 제공. 보험사 앱 내 '인앱(In-app) 에이전트' 형태로 공급.34  
* **B2C (장기 타겟):** 자녀(보호자) 대상의 프리미엄 구독 서비스. 부모님의 안부 리포트, 응급 상황 알림, 병원 동행 예약 서비스 등을 월 구독료 모델로 제공.

### **5.4 클로징: 비전 제시**

"AI 케어브릿지는 단순한 앱이 아닙니다. 초고령 사회 대한민국의 지속 가능한 복지를 지탱하는 디지털 인프라입니다. 기술이 가장 필요한 곳에 가장 따뜻하게 쓰일 수 있도록, AI 케어브릿지가 그 다리가 되겠습니다."

## ---

**6\. 결론 및 제언**

'AI 케어브릿지'는 \*\*시장성(초고령 사회 수요), 기술성(Agentic AI & Solar Pro), 공익성(디지털 포용)\*\*의 삼박자를 고루 갖춘 최상의 창업 아이템입니다. 특히 커널 아카데미가 지향하는 실무 중심의 AI 교육 성과를 보여주기에 가장 적합한 프로젝트입니다.

이 보고서에서 제안한 **LangGraph 기반의 멀티 에이전트 아키텍처**와 **업스테이지 Solar Pro를 활용한 한국형 특화 전략**을 충실히 이행한다면, 데모데이에서 심사위원(VC)들에게 깊은 인상을 남기고 실제 투자 유치 및 창업으로 이어질 가능성이 매우 높습니다. 남은 기간 동안 기술적 완성도를 높이는 것뿐만 아니라, 실제 시니어 사용자를 대상으로 한 필드 테스트(FGI) 결과나 사용성 평가 데이터를 피칭에 포함시킨다면 금상첨화가 될 것입니다.

1. ---

   **즉시:** 팀 구성 및 역할 분담 (PM, 백엔드/AI 엔지니어, 프론트엔드, 디자이너).  
2. **D-25:** 핵심 기능(복지 검색 RAG, 기본 대화) 프로토타입 완성 (MVP).  
3. **D-15:** 실제 데이터(2026 복지 정책) 탑재 및 LangGraph 시나리오 고도화.  
4. **D-7:** UI/UX 폴리싱 및 데모 시나리오 리허설 (돌발 상황 대비).  
5. **D-Day:** 완벽한 시연과 자신감 있는 피칭으로 청중을 압도.

### ---

**부록: 예상 질의응답 (Q\&A) 대비**

Q1. 기존 AI 스피커나 효돌과 무엇이 다른가요?  
A1. "기존 제품은 하드웨어 중심의 '반응형' 기기입니다. AI 케어브릿지는 하드웨어에 구애받지 않는 '지능형 소프트웨어'로, 복잡한 추론과 도구 사용(Tool Use)이 가능한 '에이전트'라는 점이 다릅니다. 특히 공공 데이터와 실시간 연동되어 실질적인 생활 지원(행정 처리 등)이 가능하다는 점이 핵심 차별점입니다."  
Q2. 할루시네이션(거짓 답변) 문제는 어떻게 해결하나요?  
A2. "두 가지 안전장치를 마련했습니다. 첫째, RAG 기술을 통해 검증된 정부 문서를 근거로만 답변하도록 제한합니다. 둘째, 업스테이지의 'Groundedness Check' API를 도입하여, 생성된 답변이 근거 문서와 일치하는지 2차 검증 후 사용자에게 전달합니다."  
Q3. 수익 모델이 구체적으로 무엇입니까?  
A3. "초기에는 정부의 스마트 경로당 및 독거노인 응급안전안심서비스 사업을 타겟으로 한 B2G 모델로 안정적인 매출을 확보하고, 이후 확보된 시니어 라이프로그 데이터를 비식별화하여 보험사나 헬스케어 기업에 제공하는 B2B 데이터 비즈니스로 확장할 계획입니다."

#### **참고 자료**

1. From Nobel Materials to AI CareTech, Investors Return to Fundamentals: Korea's Deep Tech and AI Startups Capture Early 2026 Momentum \- KoreaTechDesk, 1월 13, 2026에 액세스, [https://koreatechdesk.com/investor-trends-startups-early-2026](https://koreatechdesk.com/investor-trends-startups-early-2026)  
2. VC Investment Trends for 2026: From Experimentation to Execution \- GoHub Ventures, 1월 13, 2026에 액세스, [https://gohub.vc/vc-investment-trends-2026/](https://gohub.vc/vc-investment-trends-2026/)  
3. 수상내역(2025).xlsx  
4. 케어닥, 올해 시니어 키워드 돌봄·AI 등 '인프라 전환' 제시 \- 중소기업신문, 1월 13, 2026에 액세스, [https://www.smedaily.co.kr/news/articleView.html?idxno=348391](https://www.smedaily.co.kr/news/articleView.html?idxno=348391)  
5. 2026년 대한민국 시니어 케어 산업의 대전환, 정책 혁신과 AI 기술 융합을 통한 초고령사회 대응 전략 보고서, 1월 13, 2026에 액세스, [https://www.aid-promise.com/%EC%97%90%EC%9D%B4%EB%93%9C-%ED%98%84%EC%9E%A5/%EC%8B%9C%EB%8B%88%EC%96%B4-%EC%BC%80%EC%96%B4-%EC%B4%88%EA%B3%A0%EB%A0%B9%EC%82%AC%ED%9A%8C](https://www.aid-promise.com/%EC%97%90%EC%9D%B4%EB%93%9C-%ED%98%84%EC%9E%A5/%EC%8B%9C%EB%8B%88%EC%96%B4-%EC%BC%80%EC%96%B4-%EC%B4%88%EA%B3%A0%EB%A0%B9%EC%82%AC%ED%9A%8C)  
6. SAS, 2026년 AI 산업을 이끌 8가지 전망 공개···책임성·ROI 중요성 커져 | CIO, 1월 13, 2026에 액세스, [https://www.cio.com/article/4102194/sas-2026%EB%85%84-ai-%EC%82%B0%EC%97%85%EC%9D%84-%EC%9D%B4%EB%81%8C-8%EA%B0%80%EC%A7%80-%EC%A0%84%EB%A7%9D-%EA%B3%B5%EA%B0%9C%C2%B7%C2%B7%C2%B7%EC%B1%85%EC%9E%84%EC%84%B1%C2%B7roi-%EC%A4%91%EC%9A%94.html](https://www.cio.com/article/4102194/sas-2026%EB%85%84-ai-%EC%82%B0%EC%97%85%EC%9D%84-%EC%9D%B4%EB%81%8C-8%EA%B0%80%EC%A7%80-%EC%A0%84%EB%A7%9D-%EA%B3%B5%EA%B0%9C%C2%B7%C2%B7%C2%B7%EC%B1%85%EC%9E%84%EC%84%B1%C2%B7roi-%EC%A4%91%EC%9A%94.html)  
7. Google의 '2026년 AI 에이전트 트렌드' \- 네이버 프리미엄콘텐츠, 1월 13, 2026에 액세스, [https://contents.premium.naver.com/aidx/aix/contents/251221163912594ch](https://contents.premium.naver.com/aidx/aix/contents/251221163912594ch)  
8. 케어닥, 2026 시니어 산업 키워드 'INFRA' 선정… “돌봄부터 AI까지 인프라 전환 본격화”, 1월 13, 2026에 액세스, [https://www.venturesquare.net/1031121/](https://www.venturesquare.net/1031121/)  
9. Busan Turns Aging Society into a New Growth Engine… Establishes “Age-Tech Strategy for Super-Aged Busan” : News \> AI-translated Press Releases, 1월 13, 2026에 액세스, [https://www.busan.go.kr/eng/ai-translated-press-releases/1693869](https://www.busan.go.kr/eng/ai-translated-press-releases/1693869)  
10. South Korea Distributes AI Dolls to Solitary Elderly for 24/7 Companionship and Health Monitoring \- 36氪, 1월 13, 2026에 액세스, [https://eu.36kr.com/en/p/3447852812391808](https://eu.36kr.com/en/p/3447852812391808)  
11. HYODOL: AI Care Platform, 1월 13, 2026에 액세스, [http://en.hyodol.com/](http://en.hyodol.com/)  
12. “요양·돌봄도 DX가 대세”…스타트업 투자유치·M\&A 활발 \- 전자신문, 1월 13, 2026에 액세스, [https://m.etnews.com/20250922000342?obj=Tzo4OiJzdGRDbGFzcyI6Mjp7czo3OiJyZWZlcmVyIjtOO3M6NzoiZm9yd2FyZCI7czoxMzoid2ViIHRvIG1vYmlsZSI7fQ%3D%3D](https://m.etnews.com/20250922000342?obj=Tzo4OiJzdGRDbGFzcyI6Mjp7czo3OiJyZWZlcmVyIjtOO3M6NzoiZm9yd2FyZCI7czoxMzoid2ViIHRvIG1vYmlsZSI7fQ%3D%3D)  
13. LangGraph & Redis: Build smarter AI agents with memory & persistence, 1월 13, 2026에 액세스, [https://redis.io/blog/langgraph-redis-build-smarter-ai-agents-with-memory-persistence/](https://redis.io/blog/langgraph-redis-build-smarter-ai-agents-with-memory-persistence/)  
14. Powering Long-Term Memory for Agents With LangGraph and MongoDB, 1월 13, 2026에 액세스, [https://www.mongodb.com/company/blog/product-release-announcements/powering-long-term-memory-for-agents-langgraph](https://www.mongodb.com/company/blog/product-release-announcements/powering-long-term-memory-for-agents-langgraph)  
15. AWS Marketplace: Solar Pro 2, 1월 13, 2026에 액세스, [https://aws.amazon.com/marketplace/pp/prodview-yar5lgioxenj4](https://aws.amazon.com/marketplace/pp/prodview-yar5lgioxenj4)  
16. Solar Pro 2 Breaks Into Global Frontier AI \- Upstage AI, 1월 13, 2026에 액세스, [https://www.upstage.ai/news/solar-pro-2-frontier](https://www.upstage.ai/news/solar-pro-2-frontier)  
17. 2025-0818 Korean Frontier Model joins the competition \- follow the idea \- Obsidian Publish, 1월 13, 2026에 액세스, [https://publish.obsidian.md/followtheidea/Content/AI/2025-0818++Korean+Frontier+Model+joins+the+competition](https://publish.obsidian.md/followtheidea/Content/AI/2025-0818++Korean+Frontier+Model+joins+the+competition)  
18. Meet South Korea's LLM Powerhouses: HyperClova, AX, Solar Pro, and More, 1월 13, 2026에 액세스, [https://www.marktechpost.com/2025/08/21/meet-south-koreas-llm-powerhouses-hyperclova-ax-solar-pro-and-more/](https://www.marktechpost.com/2025/08/21/meet-south-koreas-llm-powerhouses-hyperclova-ax-solar-pro-and-more/)  
19. How to use 'Solar' LLM vol. 1 \- Tips for writing an effective project proposal \- Upstage AI, 1월 13, 2026에 액세스, [https://www.upstage.ai/blog/en/solar-llm-for-writing-project-proposals](https://www.upstage.ai/blog/en/solar-llm-for-writing-project-proposals)  
20. Solar Pro: The most intelligent LLM on a single GPU—supporting more tasks, languages, and domains \- Upstage AI, 1월 13, 2026에 액세스, [https://www.upstage.ai/blog/en/solar-pro](https://www.upstage.ai/blog/en/solar-pro)  
21. LangGraph overview \- Docs by LangChain, 1월 13, 2026에 액세스, [https://docs.langchain.com/oss/python/langgraph/overview](https://docs.langchain.com/oss/python/langgraph/overview)  
22. LangGraph Multi-Agent Systems Tutorial 2026, 1월 13, 2026에 액세스, [https://langchain-tutorials.github.io/langgraph-multi-agent-systems-2026/](https://langchain-tutorials.github.io/langgraph-multi-agent-systems-2026/)  
23. DESAMO: A Device for Elder-Friendly Smart Homes Powered by Embedded LLM with Audio Modality \- arXiv, 1월 13, 2026에 액세스, [https://arxiv.org/html/2508.18918v1](https://arxiv.org/html/2508.18918v1)  
24. Small Models, Big Heat — Conquering Korean ASR with Low-bit Whisper | by ENERZAi, 1월 13, 2026에 액세스, [https://medium.com/@enerzai/small-models-big-heat-conquering-korean-asr-with-low-bit-whisper-5836ccd476dd](https://medium.com/@enerzai/small-models-big-heat-conquering-korean-asr-with-low-bit-whisper-5836ccd476dd)  
25. sooftware/kospeech: Open-Source Toolkit for End-to-End Korean Automatic Speech Recognition leveraging PyTorch and Hydra. \- GitHub, 1월 13, 2026에 액세스, [https://github.com/sooftware/kospeech](https://github.com/sooftware/kospeech)  
26. Upstage | LangChain Reference, 1월 13, 2026에 액세스, [https://reference.langchain.com/python/integrations/langchain\_upstage/](https://reference.langchain.com/python/integrations/langchain_upstage/)  
27. Upstage \- Docs by LangChain, 1월 13, 2026에 액세스, [https://docs.langchain.com/oss/python/integrations/providers/upstage](https://docs.langchain.com/oss/python/integrations/providers/upstage)  
28. Mastering AI with Upstage Solar LLM: From Use Cases to Agent tutorial \- Lablab.ai, 1월 13, 2026에 액세스, [https://lablab.ai/t/upstage-tutorial](https://lablab.ai/t/upstage-tutorial)  
29. Enable Function Calling with LLMs | Upstage AI Agents that Take Action, 1월 13, 2026에 액세스, [https://console.upstage.ai/docs/capabilities/generate/function-calling](https://console.upstage.ai/docs/capabilities/generate/function-calling)  
30. Function calling | OpenAI API, 1월 13, 2026에 액세스, [https://platform.openai.com/docs/guides/function-calling](https://platform.openai.com/docs/guides/function-calling)  
31. Get Started with Upstage AI's Solar LLM in 10 Minutes \- YouTube, 1월 13, 2026에 액세스, [https://www.youtube.com/watch?v=PfUHqDoL5mM](https://www.youtube.com/watch?v=PfUHqDoL5mM)  
32. '라면 1000개로 배우는 조달청' 홍보영상, 「2025 조금 특별한 AI 조달 공모전」 대상, 1월 13, 2026에 액세스, [https://www.korea.kr/common/download.do?fileId=198308550\&tblKey=GMN](https://www.korea.kr/common/download.do?fileId=198308550&tblKey=GMN)  
33. Upstage Becomes Korea's First Public-Sector Generative AI Provider, Redefining Government Digital Transformation \- KoreaTechDesk | Korean Startup and Technology News, 1월 13, 2026에 액세스, [https://koreatechdesk.com/upstage-korea-first-public-generative-ai-provider](https://koreatechdesk.com/upstage-korea-first-public-generative-ai-provider)  
34. 2026 Fintech Predictions: Key Trends in Payments, Banking, and Financial Infrastructure, 1월 13, 2026에 액세스, [https://www.moderntreasury.com/journal/2026-fintech-predictions-key-trends-in-payments-banking-and-financial-infrastructure](https://www.moderntreasury.com/journal/2026-fintech-predictions-key-trends-in-payments-banking-and-financial-infrastructure)  
35. 타이거 리서치 "2026 디지털자산 시장, 기관 자금 흐름과사업 지속성이 주요 변수", 1월 13, 2026에 액세스, [https://zdnet.co.kr/view/?no=20251231013915](https://zdnet.co.kr/view/?no=20251231013915)