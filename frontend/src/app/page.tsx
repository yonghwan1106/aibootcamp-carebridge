"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Heart,
  FileText,
  Sun,
  Phone,
  Volume2,
  Loader2,
  Cloud,
  Calendar,
  Bell,
  Clock
} from "lucide-react";
import VoiceChat from "@/components/VoiceChat";
import QuickMenu from "@/components/QuickMenu";
import Header from "@/components/Header";

export default function Home() {
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "안녕하세요";
    return "좋은 저녁이에요";
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* 데스크탑: 3컬럼 레이아웃 / 모바일: 단일 컬럼 */}
      <div className="flex-1 flex flex-col lg:flex-row lg:gap-8 lg:px-8 lg:py-6 xl:px-16">

        {/* 좌측 사이드 패널 - 데스크탑 전용 */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-4"
        >
          {/* 시간/날짜 카드 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-senior-sm text-text-secondary">현재 시간</span>
            </div>
            <p className="text-4xl xl:text-5xl font-bold text-text-primary mb-2">{formatTime(currentTime)}</p>
            <p className="text-senior-base text-text-secondary">{formatDate(currentTime)}</p>
          </div>

          {/* 오늘의 날씨 카드 */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-6 shadow-soft border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-senior-sm text-text-secondary">오늘의 날씨</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-text-primary">18°</p>
                <p className="text-senior-base text-text-secondary">맑음</p>
              </div>
              <Sun className="w-16 h-16 text-amber-400" />
            </div>
            <p className="mt-4 text-sm text-text-muted">오늘 하루 외출하기 좋은 날씨예요</p>
          </div>

          {/* 오늘의 일정 카드 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-senior-sm text-text-secondary">오늘의 일정</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <div>
                  <p className="text-senior-sm font-medium text-text-primary">오전 10:00</p>
                  <p className="text-sm text-text-secondary">건강 체조 시간</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-senior-sm font-medium text-text-primary">오후 2:00</p>
                  <p className="text-sm text-text-secondary">복지관 프로그램</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* 중앙 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 lg:py-0">
          {/* 인사말 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-senior-2xl md:text-senior-3xl lg:text-[3.5rem] text-text-primary mb-3">
              {greeting}! 👋
            </h1>
            <p className="text-senior-base lg:text-senior-lg text-text-secondary max-w-md lg:max-w-lg">
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
              className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-gradient-to-br from-primary-400 to-primary-600
                         rounded-full shadow-glow flex items-center justify-center
                         hover:from-primary-500 hover:to-primary-700 transition-all duration-300
                         focus:outline-none focus:ring-4 focus:ring-primary-300"
              aria-label="음성 대화 시작"
            >
              <Mic className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-white" strokeWidth={2.5} />
            </motion.button>
          </motion.div>

          {/* 버튼 안내 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-senior-sm lg:text-senior-base text-text-muted mb-12"
          >
            버튼을 누르면 대화가 시작됩니다
          </motion.p>

          {/* 빠른 메뉴 */}
          <QuickMenu />
        </div>

        {/* 우측 사이드 패널 - 데스크탑 전용 */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-4"
        >
          {/* 알림 카드 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-senior-sm text-text-secondary">알림</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-xl border-l-4 border-red-400">
                <p className="text-senior-sm font-medium text-text-primary">약 복용 시간</p>
                <p className="text-sm text-text-secondary">오후 12:00 혈압약</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <p className="text-senior-sm font-medium text-text-primary">새로운 복지 정보</p>
                <p className="text-sm text-text-secondary">기초연금 인상 안내</p>
              </div>
            </div>
          </div>

          {/* 자주 사용하는 기능 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50">
            <h3 className="text-senior-sm text-text-secondary mb-4">자주 사용하는 기능</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors text-center">
                <Phone className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <span className="text-sm text-text-primary">가족 전화</span>
              </button>
              <button className="p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors text-center">
                <Heart className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
                <span className="text-sm text-text-primary">건강 체크</span>
              </button>
              <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center">
                <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <span className="text-sm text-text-primary">복지 신청</span>
              </button>
              <button className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-center">
                <Calendar className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <span className="text-sm text-text-primary">일정 관리</span>
              </button>
            </div>
          </div>

          {/* 긴급 연락 */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-soft border border-red-200 flex-1">
            <h3 className="text-senior-sm text-text-secondary mb-4">긴급 연락</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white rounded-xl hover:bg-red-50 transition-colors flex items-center gap-3 shadow-sm">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-senior-base font-bold text-red-600">119</p>
                  <p className="text-sm text-text-secondary">응급 신고</p>
                </div>
              </button>
              <button className="w-full p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-3 shadow-sm">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-senior-base font-bold text-blue-600">129</p>
                  <p className="text-sm text-text-secondary">보건복지콜센터</p>
                </div>
              </button>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* 하단 안내 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="py-6 text-center lg:hidden"
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
