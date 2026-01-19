"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Heart,
  FileText,
  Sun,
  Phone,
  Cloud,
  Calendar,
  Bell,
  Clock,
  Leaf,
  Sparkles,
  ArrowRight
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
    <main className="min-h-screen flex flex-col relative">
      {/* 배경 장식 요소 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 좌측 상단 장식 원 */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-hanok-ochre/5 rounded-full blur-3xl" />
        {/* 우측 하단 장식 원 */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-hanok-jade/5 rounded-full blur-3xl" />
        {/* 중앙 상단 장식 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-hanok-terracotta/3 rounded-full blur-3xl" />
      </div>

      <Header />

      {/* 데스크탑: 3컬럼 레이아웃 / 모바일: 단일 컬럼 */}
      <div className="flex-1 flex flex-col lg:flex-row lg:gap-8 lg:px-8 lg:py-6 xl:px-16 relative z-10">

        {/* 좌측 사이드 패널 - 데스크탑 전용 */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-5"
        >
          {/* 시간/날짜 카드 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-hanok-primary rounded-hanok-sm flex items-center justify-center shadow-warm">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-medium text-hanok-ochre">현재 시간</span>
            </div>
            <p className="font-serif text-5xl xl:text-6xl font-bold text-hanok-ink mb-2 tracking-tight">
              {formatTime(currentTime)}
            </p>
            <p className="text-senior-base text-text-secondary">{formatDate(currentTime)}</p>

            {/* 장식 요소 */}
            <div className="absolute top-4 right-4 opacity-10">
              <Sparkles className="w-8 h-8 text-hanok-gold" />
            </div>
          </motion.div>

          {/* 오늘의 날씨 카드 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6 relative overflow-hidden"
          >
            {/* 배경 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-br from-hanok-sky/10 via-transparent to-hanok-jade/5" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-hanok-secondary rounded-hanok-sm flex items-center justify-center shadow-soft">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-medium text-hanok-jade">오늘의 날씨</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-5xl font-bold text-hanok-ink">18°</p>
                  <p className="text-senior-base text-text-secondary mt-1">맑음</p>
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sun className="w-20 h-20 text-hanok-gold drop-shadow-lg" />
                </motion.div>
              </div>

              <div className="mt-5 p-3 bg-hanok-jade/10 rounded-hanok-sm border border-hanok-jade/20">
                <p className="text-sm text-hanok-pine flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  오늘 하루 외출하기 좋은 날씨예요
                </p>
              </div>
            </div>
          </motion.div>

          {/* 오늘의 일정 카드 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6 flex-1"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-hanok-ochre rounded-hanok-sm flex items-center justify-center shadow-warm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-medium text-hanok-ochre">오늘의 일정</span>
            </div>

            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-hanok-jade/10 rounded-hanok-sm
                          border-l-4 border-hanok-jade cursor-pointer transition-colors hover:bg-hanok-jade/15"
              >
                <div className="w-3 h-3 bg-hanok-jade rounded-full animate-breath" />
                <div>
                  <p className="text-senior-sm font-semibold text-hanok-ink">오전 10:00</p>
                  <p className="text-sm text-text-secondary">건강 체조 시간</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-hanok-ochre/10 rounded-hanok-sm
                          border-l-4 border-hanok-ochre cursor-pointer transition-colors hover:bg-hanok-ochre/15"
              >
                <div className="w-3 h-3 bg-hanok-ochre rounded-full" />
                <div>
                  <p className="text-senior-sm font-semibold text-hanok-ink">오후 2:00</p>
                  <p className="text-sm text-text-secondary">복지관 프로그램</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.aside>

        {/* 중앙 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 lg:py-0">
          {/* 인사말 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-senior-2xl md:text-senior-3xl lg:text-senior-4xl text-hanok-ink mb-4">
              {greeting}!{" "}
              <motion.span
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-senior-base lg:text-senior-lg text-text-secondary max-w-md lg:max-w-lg">
              무엇이든 물어보세요.<br />
              <span className="hanok-gradient-text font-semibold">아래 버튼</span>을 누르고 말씀해 주세요.
            </p>
          </motion.div>

          {/* 중앙 음성 버튼 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-14"
          >
            {/* 배경 글로우 레이어들 */}
            <div className="absolute inset-0 bg-hanok-terracotta/20 rounded-full blur-3xl scale-150 animate-breath" />
            <div className="absolute inset-0 bg-hanok-ochre/15 rounded-full blur-2xl scale-125" />

            {/* 펄스 링들 */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 bg-hanok-terracotta/30 rounded-full scale-110"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              className="absolute inset-0 bg-hanok-ochre/20 rounded-full scale-105"
            />

            {/* 메인 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceChatOpen(true)}
              className="relative w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-72 xl:h-72
                         bg-hanok-primary rounded-full voice-glow
                         flex items-center justify-center
                         hover:shadow-hanok-glow transition-all duration-500
                         focus:outline-none focus:ring-4 focus:ring-hanok-ochre/50"
              aria-label="음성 대화 시작"
            >
              {/* 내부 테두리 장식 */}
              <div className="absolute inset-3 rounded-full border-2 border-white/20" />
              <div className="absolute inset-6 rounded-full border border-white/10" />

              <Mic className="w-18 h-18 md:w-22 md:h-22 lg:w-26 lg:h-26 xl:w-32 xl:h-32 text-white drop-shadow-lg" strokeWidth={2} />

              {/* 장식 요소 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/30 rounded-full" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* 버튼 안내 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-senior-sm lg:text-senior-base text-text-muted mb-14 flex items-center gap-2"
          >
            <span className="inline-block w-2 h-2 bg-hanok-jade rounded-full animate-breath" />
            버튼을 누르면 대화가 시작됩니다
          </motion.p>

          {/* 빠른 메뉴 */}
          <QuickMenu />
        </div>

        {/* 우측 사이드 패널 - 데스크탑 전용 */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-5"
        >
          {/* 알림 카드 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-11 h-11 bg-hanok-deep-red rounded-hanok-sm flex items-center justify-center shadow-warm">
                <Bell className="w-5 h-5 text-white" />
                <span className="notification-dot" />
              </div>
              <span className="text-base font-medium text-hanok-deep-red">알림</span>
              <span className="ml-auto hanok-badge text-xs">2</span>
            </div>

            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 bg-hanok-deep-red/10 rounded-hanok-sm border-l-4 border-hanok-deep-red
                          cursor-pointer transition-colors hover:bg-hanok-deep-red/15"
              >
                <p className="text-senior-sm font-semibold text-hanok-ink">약 복용 시간</p>
                <p className="text-sm text-text-secondary">오후 12:00 혈압약</p>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 bg-hanok-jade/10 rounded-hanok-sm border-l-4 border-hanok-jade
                          cursor-pointer transition-colors hover:bg-hanok-jade/15"
              >
                <p className="text-senior-sm font-semibold text-hanok-ink">새로운 복지 정보</p>
                <p className="text-sm text-text-secondary">기초연금 인상 안내</p>
              </motion.div>
            </div>
          </motion.div>

          {/* 자주 사용하는 기능 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6"
          >
            <h3 className="text-base font-medium text-text-secondary mb-5">자주 사용하는 기능</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone, label: "가족 전화", color: "terracotta" },
                { icon: Heart, label: "건강 체크", color: "jade" },
                { icon: FileText, label: "복지 신청", color: "ochre" },
                { icon: Calendar, label: "일정 관리", color: "pine" },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-hanok-sm transition-all duration-300 text-center
                             ${item.color === "terracotta" ? "bg-hanok-terracotta/10 hover:bg-hanok-terracotta/20" :
                               item.color === "jade" ? "bg-hanok-jade/10 hover:bg-hanok-jade/20" :
                               item.color === "ochre" ? "bg-hanok-ochre/10 hover:bg-hanok-ochre/20" :
                               "bg-hanok-pine/10 hover:bg-hanok-pine/20"}`}
                >
                  <item.icon className={`w-6 h-6 mx-auto mb-2
                                        ${item.color === "terracotta" ? "text-hanok-terracotta" :
                                          item.color === "jade" ? "text-hanok-jade" :
                                          item.color === "ochre" ? "text-hanok-ochre" :
                                          "text-hanok-pine"}`} />
                  <span className="text-sm font-medium text-hanok-ink">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 긴급 연락 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hanok-card hanok-card-hover p-6 flex-1 relative overflow-hidden"
          >
            {/* 긴급 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-hanok-deep-red/5 to-transparent" />

            <div className="relative">
              <h3 className="text-base font-medium text-hanok-deep-red mb-5">긴급 연락</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-white rounded-hanok-sm hover:bg-hanok-deep-red/5
                            transition-all duration-300 flex items-center gap-4 shadow-soft"
                >
                  <div className="w-14 h-14 bg-hanok-deep-red rounded-full flex items-center justify-center shadow-warm">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-serif text-2xl font-bold text-hanok-deep-red">119</p>
                    <p className="text-sm text-text-secondary">응급 신고</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-hanok-deep-red/50" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-white rounded-hanok-sm hover:bg-hanok-jade/5
                            transition-all duration-300 flex items-center gap-4 shadow-soft"
                >
                  <div className="w-14 h-14 bg-hanok-jade rounded-full flex items-center justify-center shadow-soft">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-serif text-2xl font-bold text-hanok-jade">129</p>
                    <p className="text-sm text-text-secondary">보건복지콜센터</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-hanok-jade/50" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.aside>
      </div>

      {/* 하단 안내 - 모바일 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-8 text-center lg:hidden relative z-10"
      >
        <div className="hanok-divider max-w-xs mx-auto mb-6" />
        <p className="text-sm text-text-muted">
          도움이 필요하시면 <span className="hanok-gradient-text font-semibold">129</span>로 전화해 주세요
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
