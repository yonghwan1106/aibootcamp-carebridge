import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// API 클라이언트
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// 음성 메시지 전송 (STT)
export async function sendVoiceMessage(audioBlob: Blob): Promise<{
  session_id: string;
  user_text: string;
  assistant_text: string;
  confidence: number;
}> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await api.post("/api/voice/conversation", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// 텍스트 메시지 전송 (채팅)
export async function sendChatMessage(message: string): Promise<{
  response: string;
  session_id: string;
  emotion?: string;
}> {
  try {
    const response = await api.post("/api/chat/send", {
      message,
      user_id: "demo_user",
    });
    // API 응답 형식 변환
    return {
      response: response.data.message?.content || response.data.response || "",
      session_id: response.data.session_id,
      emotion: response.data.emotion,
    };
  } catch (error) {
    // 백엔드가 없을 때 임시 응답
    console.warn("Chat API 연결 실패, 임시 응답 사용");
    return {
      response: getTemporaryResponse(message),
      session_id: "temp_session",
    };
  }
}

// TTS (텍스트 -> 음성)
export async function textToSpeech(text: string): Promise<Blob> {
  try {
    const response = await api.post(
      "/api/voice/tts/senior",
      new URLSearchParams({
        text,
        emotion: "comfort",
      }),
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.warn("TTS API 연결 실패");
    return new Blob();
  }
}

// 복지 정보 검색 (RAG)
export async function searchWelfare(query: string, nResults: number = 3): Promise<{
  query: string;
  results: Array<{
    program_id: string;
    name: string;
    category: string;
    description: string;
    benefit: string;
    eligibility: string[];
    how_to_apply: string;
    contact: string;
    score: number;
  }>;
  total: number;
}> {
  const response = await api.post("/api/welfare/rag/search", {
    query,
    n_results: nResults,
  });
  return response.data;
}

// 복지 카테고리 목록
export async function getWelfareCategories(): Promise<{
  categories: string[];
}> {
  const response = await api.get("/api/welfare/rag/categories");
  return response.data;
}

// 건강 상태 확인
export async function checkHealth(): Promise<{
  status: string;
  service: string;
}> {
  const response = await api.get("/health");
  return response.data;
}

// 임시 응답 (백엔드 없을 때)
function getTemporaryResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("복지") || lowerMessage.includes("지원")) {
    return "복지 정보를 찾아드릴게요. 어떤 복지 혜택이 궁금하신가요? 기초연금, 장기요양, 노인일자리 등 다양한 복지 프로그램이 있어요.";
  }

  if (lowerMessage.includes("날씨")) {
    return "오늘 날씨를 확인해 드릴게요. 지금 서울은 맑고 기온은 5도예요. 따뜻하게 입고 나가세요!";
  }

  if (lowerMessage.includes("안녕") || lowerMessage.includes("반가")) {
    return "안녕하세요! 오늘 하루 어떠셨어요? 궁금한 게 있으시면 편하게 말씀해 주세요.";
  }

  if (lowerMessage.includes("고마") || lowerMessage.includes("감사")) {
    return "천만에요! 도움이 되어서 기뻐요. 또 필요한 게 있으시면 언제든 말씀해 주세요.";
  }

  if (lowerMessage.includes("힘들") || lowerMessage.includes("외로") || lowerMessage.includes("걱정")) {
    return "그런 마음이 드셨군요. 제가 곁에 있어요. 이야기 나누고 싶으시면 편하게 말씀해 주세요. 어떤 이야기라도 괜찮아요.";
  }

  return "네, 말씀 잘 들었어요. 제가 어떻게 도와드리면 좋을까요? 복지 정보가 궁금하시면 '복지'라고 말씀해 주시고, 그냥 이야기를 나누고 싶으시면 편하게 말씀해 주세요.";
}
