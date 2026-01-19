"use client";

import { motion } from "framer-motion";
import { Heart, Settings, HelpCircle, FileText, Sun, Phone, User } from "lucide-react";
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
      className="w-full px-6 py-4 lg:px-8 lg:py-5 bg-white/50 backdrop-blur-sm lg:border-b lg:border-white/50"
    >
      <div className="max-w-4xl lg:max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 min-h-0">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl
                          flex items-center justify-center shadow-warm">
            <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display text-xl lg:text-2xl text-text-primary font-bold">
              케어브릿지
            </h1>
            <p className="text-xs lg:text-sm text-text-muted">AI 복지 도우미</p>
          </div>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                           hover:bg-white/80 transition-colors cursor-pointer"
              >
                <item.icon className="w-5 h-5 text-primary-500" />
                <span className="text-base font-medium text-text-primary">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* 데스크탑 전용: 사용자 프로필 */}
          <Link href="/profile" className="hidden lg:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-50 hover:bg-primary-100
                         transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full
                              flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">홍길동님</p>
                <p className="text-xs text-text-muted">내 정보</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/help">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-white/50 hover:bg-white/80
                         flex items-center justify-center transition-colors
                         shadow-soft cursor-pointer"
              aria-label="도움말"
            >
              <HelpCircle className="w-6 h-6 text-text-secondary" />
            </motion.div>
          </Link>
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-white/50 hover:bg-white/80
                         flex items-center justify-center transition-colors
                         shadow-soft cursor-pointer"
              aria-label="설정"
            >
              <Settings className="w-6 h-6 text-text-secondary" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
