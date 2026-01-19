"use client";

import { motion } from "framer-motion";
import { Heart, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-6 py-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 min-h-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl
                          flex items-center justify-center shadow-warm">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display text-xl text-text-primary font-bold">
              케어브릿지
            </h1>
            <p className="text-xs text-text-muted">AI 복지 도우미</p>
          </div>
        </Link>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-2">
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
