"use client";

import { motion } from "framer-motion";
import { Heart, Settings, HelpCircle, FileText, Sun, Phone, User, Sparkles } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/welfare", label: "복지 정보", icon: FileText },
  { href: "/companion", label: "말벗 대화", icon: Heart },
  { href: "/daily", label: "오늘의 정보", icon: Sun },
  { href: "/emergency", label: "긴급 연락", icon: Phone },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full px-6 py-4 lg:px-8 lg:py-5 relative z-10"
    >
      {/* 전통 문양 상단 장식선 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-hanok-ochre to-transparent opacity-30" />

      <div className="max-w-4xl lg:max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-4 min-h-0 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 lg:w-16 lg:h-16 bg-hanok-primary rounded-hanok
                        flex items-center justify-center shadow-hanok
                        transition-shadow duration-300 group-hover:shadow-hanok-hover"
          >
            {/* 전통 문양 테두리 장식 */}
            <div className="absolute inset-0 rounded-hanok border-2 border-hanok-ochre/30" />
            <Heart className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="white" strokeWidth={0} />

            {/* 반짝임 효과 */}
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-4 h-4 text-hanok-gold" />
            </motion.div>
          </motion.div>

          <div className="flex flex-col">
            <h1 className="font-serif text-2xl lg:text-[1.75rem] text-hanok-ink font-bold tracking-tight">
              케어브릿지
            </h1>
            <p className="text-sm lg:text-base text-hanok-ochre font-medium">
              AI 복지 도우미
            </p>
          </div>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2.5 px-5 py-3 rounded-hanok-sm
                           hover:bg-warm-200/50 transition-all duration-300 cursor-pointer group"
              >
                {/* 호버 시 하단 장식 */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5
                               bg-gradient-to-r from-hanok-terracotta to-hanok-ochre
                               group-hover:w-8 transition-all duration-300 rounded-full" />

                <item.icon className="w-5 h-5 text-hanok-terracotta group-hover:text-hanok-deep-red
                                     transition-colors duration-300" />
                <span className="text-base font-medium text-hanok-ink group-hover:text-hanok-deep-red
                               transition-colors duration-300">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* 데스크탑 전용: 사용자 프로필 */}
          <Link href="/profile" className="hidden lg:block">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-5 py-2.5 rounded-hanok
                         hanok-card hanok-card-hover cursor-pointer"
            >
              <div className="relative w-11 h-11 bg-hanok-secondary rounded-full
                              flex items-center justify-center shadow-soft">
                <User className="w-5 h-5 text-white" />
                {/* 온라인 상태 표시 */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                               bg-hanok-jade border-2 border-white rounded-full" />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-hanok-ink">홍길동님</p>
                <p className="text-sm text-hanok-ochre">내 정보</p>
              </div>
            </motion.div>
          </Link>

          {/* 도움말 버튼 */}
          <Link href="/help">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-12 h-12 lg:w-13 lg:h-13 rounded-hanok-sm
                         hanok-card flex items-center justify-center
                         hover:shadow-hanok-hover transition-shadow duration-300 cursor-pointer"
              aria-label="도움말"
            >
              <HelpCircle className="w-6 h-6 text-hanok-jade" />
            </motion.div>
          </Link>

          {/* 설정 버튼 */}
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -90 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative w-12 h-12 lg:w-13 lg:h-13 rounded-hanok-sm
                         hanok-card flex items-center justify-center
                         hover:shadow-hanok-hover transition-shadow duration-300 cursor-pointer"
              aria-label="설정"
            >
              <Settings className="w-6 h-6 text-hanok-terracotta" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* 하단 장식선 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.4) 20%, rgba(198, 123, 92, 0.5) 50%, rgba(212, 165, 116, 0.4) 80%, transparent 100%)"
        }}
      />
    </motion.header>
  );
}
