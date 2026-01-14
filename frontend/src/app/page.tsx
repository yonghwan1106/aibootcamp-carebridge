"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Heart,
  FileText,
  Sun,
  Phone,
  Volume2,
  Loader2
} from "lucide-react";
import VoiceChat from "@/components/VoiceChat";
import QuickMenu from "@/components/QuickMenu";
import Header from "@/components/Header";

export default function Home() {
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "안녕하세요";
    return "좋은 저녁이에요";
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* 인사말 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-senior-2xl md:text-senior-3xl text-text-primary mb-3">
            {greeting}! 👋
          </h1>
          <p className="text-senior-base text-text-secondary max-w-md">
            무엇이든 물어보세요.<br />
            <span className="text-primary-500 font-semibold">아래 버튼</span>을 누르고 말씀해 주세요.
          </p>
        </motion.div>

        {/* 중앙 음성 버튼 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-12"
        >
          {/* 배경 글로우 */}
          <div className="absolute inset-0 bg-primary-400/30 rounded-full blur-3xl scale-150" />

          {/* 펄스 링 */}
          <div className="absolute inset-0 bg-primary-300/40 rounded-full animate-pulse-slow scale-125" />

          {/* 메인 버튼 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVoiceChatOpen(true)}
            className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-primary-400 to-primary-600
                       rounded-full shadow-glow flex items-center justify-center
                       hover:from-primary-500 hover:to-primary-700 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-primary-300"
            aria-label="음성 대화 시작"
          >
            <Mic className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* 버튼 안내 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-senior-sm text-text-muted mb-12"
        >
          버튼을 누르면 대화가 시작됩니다
        </motion.p>

        {/* 빠른 메뉴 */}
        <QuickMenu />
      </div>

      {/* 하단 안내 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="py-6 text-center"
      >
        <p className="text-sm text-text-muted">
          도움이 필요하시면 <span className="text-primary-500 font-semibold">129</span>로 전화해 주세요
        </p>
      </motion.footer>

      {/* 음성 채팅 모달 */}
      <AnimatePresence>
        {isVoiceChatOpen && (
          <VoiceChat onClose={() => setIsVoiceChatOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
