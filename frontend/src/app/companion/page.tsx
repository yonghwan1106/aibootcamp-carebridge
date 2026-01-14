"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Heart,
  Smile,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { sendChatMessage, textToSpeech } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "initial",
  role: "assistant",
  content:
    "안녕하세요! 저는 AI 케어브릿지 말벗이에요. 오늘 기분이 어떠세요? 어떤 이야기든 편하게 나눠주세요.",
  timestamp: new Date(),
};

const SUGGESTED_MESSAGES = [
  "오늘 날씨가 좋네요",
  "요즘 좀 심심해요",
  "건강이 걱정돼요",
  "옛날 이야기 해주세요",
];

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = async (text: string) => {
    if (!audioEnabled) return;

    try {
      setIsSpeaking(true);
      const audioBlob = await textToSpeech(text);
      if (audioBlob.size > 0) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsSpeaking(false);
        await audioRef.current.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS 오류:", error);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // TTS 재생
      playAudio(response.response);
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해 주시겠어요?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-warm-50">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-pink-100"
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center
                           hover:bg-pink-100 transition-colors"
                aria-label="홈으로"
              >
                <ArrowLeft className="w-6 h-6 text-text-secondary" />
              </Link>
              <div>
                <h1 className="font-display text-senior-xl text-text-primary font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  말벗 대화
                </h1>
                <p className="text-sm text-text-muted">
                  편하게 이야기 나눠요
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (isSpeaking) stopAudio();
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center
                         transition-colors ${
                           audioEnabled
                             ? "bg-pink-100 text-pink-600"
                             : "bg-gray-100 text-gray-400"
                         }`}
            >
              {audioEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary-500 text-white rounded-br-md"
                      : "bg-white shadow-soft rounded-bl-md"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        <Smile className="w-5 h-5 text-pink-500" />
                      </div>
                      <span className="text-xs text-text-muted">AI 케어브릿지</span>
                    </div>
                  )}
                  <p
                    className={`text-senior-sm leading-relaxed ${
                      message.role === "user" ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-text-muted"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white shadow-soft rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                  <span className="text-sm text-text-muted">생각하고 있어요...</span>
                </div>
              </div>
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <button
                onClick={stopAudio}
                className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 text-sm"
              >
                <Volume2 className="w-4 h-4 animate-pulse" />
                음성 재생 중... (멈추기)
              </button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 추천 메시지 */}
      {messages.length <= 2 && (
        <div className="px-6 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-text-muted mb-2">이런 말씀을 해보세요:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(msg)}
                  className="px-4 py-2 bg-white rounded-full text-sm text-text-secondary
                             border border-pink-200 hover:bg-pink-50 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="sticky bottom-0 bg-white border-t border-pink-100 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="말씀해 주세요..."
              className="flex-1 h-14 px-5 bg-pink-50 rounded-xl text-senior-sm text-text-primary
                         placeholder:text-text-muted outline-none focus:ring-2 focus:ring-pink-300"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-14 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600
                         text-white flex items-center justify-center shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </main>
  );
}
