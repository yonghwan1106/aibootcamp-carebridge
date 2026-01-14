"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Send,
  RefreshCw
} from "lucide-react";
import { sendVoiceMessage, textToSpeech, sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VoiceChatProps {
  onClose: () => void;
}

export default function VoiceChat({ onClose }: VoiceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 초기 인사
  useEffect(() => {
    const greeting: Message = {
      id: "greeting",
      role: "assistant",
      content: "안녕하세요! 저는 케어브릿지 AI 도우미예요. 복지 정보, 일상 도움, 또는 그냥 이야기를 나누고 싶으시면 말씀해 주세요. 어떻게 도와드릴까요?",
      timestamp: new Date(),
    };
    setMessages([greeting]);

    // 인사 TTS 재생
    playTTS(greeting.content);
  }, []);

  // TTS 재생
  const playTTS = async (text: string) => {
    try {
      setIsSpeaking(true);
      const audioBlob = await textToSpeech(text);

      if (audioBlob && audioBlob.size > 0) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS 오류:", err);
      setIsSpeaking(false);
    }
  };

  // TTS 중지
  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("마이크 접근 오류:", err);
      setError("마이크를 사용할 수 없습니다. 권한을 확인해 주세요.");
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 오디오 처리 (STT -> AI -> TTS)
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      // STT
      const result = await sendVoiceMessage(audioBlob);

      if (result.user_text) {
        // 사용자 메시지 추가
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content: result.user_text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // AI 응답
        const aiResponse = await sendChatMessage(result.user_text);

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: aiResponse.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // TTS 재생
        await playTTS(aiResponse.response);
      }
    } catch (err) {
      console.error("처리 오류:", err);
      setError("죄송해요, 문제가 생겼어요. 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 텍스트 전송
  const handleTextSubmit = async () => {
    if (!inputText.trim() || isProcessing) return;

    const text = inputText.trim();
    setInputText("");
    setIsProcessing(true);
    setError(null);

    try {
      // 사용자 메시지 추가
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // AI 응답
      const aiResponse = await sendChatMessage(text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // TTS 재생
      await playTTS(aiResponse.response);
    } catch (err) {
      console.error("처리 오류:", err);
      setError("죄송해요, 문제가 생겼어요. 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-warm-50 rounded-t-3xl sm:rounded-3xl
                   shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-warm-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600
                            rounded-xl flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">음성 대화</h2>
              <p className="text-xs text-text-muted">말씀해 주세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-warm-100 hover:bg-warm-200
                       flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  message.role === "user"
                    ? "bg-primary-500 text-white rounded-br-md"
                    : "bg-white shadow-soft rounded-bl-md"
                }`}
              >
                <p className="text-senior-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {/* 처리 중 표시 */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white shadow-soft rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="text-senior-sm text-text-secondary">생각하고 있어요...</span>
              </div>
            </motion.div>
          )}

          {/* 에러 표시 */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-3"
            >
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-primary-500 text-sm flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                다시 시도
              </button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-5 border-t border-warm-200 space-y-4">
          {/* 음성 파형 (말하는 중) */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="voice-wave">
                <span /><span /><span /><span /><span />
              </div>
              <span className="text-sm text-text-secondary">말하는 중...</span>
              <button
                onClick={stopTTS}
                className="ml-2 p-2 rounded-lg bg-warm-100 hover:bg-warm-200"
                aria-label="말하기 중지"
              >
                <VolumeX className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          )}

          {/* 녹음 버튼 */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center
                         transition-all duration-300 shadow-lg
                         ${isRecording
                           ? "bg-red-500 hover:bg-red-600 recording-pulse"
                           : "bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700"
                         }
                         disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? "녹음 중지" : "녹음 시작"}
            >
              {isRecording ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </motion.button>

            {/* 텍스트 입력 */}
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-soft">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
                placeholder="글로 입력하기..."
                className="flex-1 bg-transparent outline-none text-senior-sm text-text-primary
                           placeholder:text-text-muted"
                disabled={isProcessing}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!inputText.trim() || isProcessing}
                className="w-10 h-10 rounded-lg bg-primary-500 hover:bg-primary-600
                           flex items-center justify-center transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="전송"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 녹음 상태 표시 */}
          {isRecording && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 text-sm font-medium"
            >
              🔴 녹음 중... 말씀이 끝나면 버튼을 누르세요
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
