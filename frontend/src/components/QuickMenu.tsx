"use client";

import { motion } from "framer-motion";
import { FileText, Heart, Sun, Phone, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    icon: FileText,
    label: "복지 정보",
    description: "받을 수 있는 복지 찾기",
    href: "/welfare",
    color: "jade",
    iconBg: "bg-hanok-secondary",
  },
  {
    icon: Heart,
    label: "말벗 대화",
    description: "이야기 나누기",
    href: "/companion",
    color: "terracotta",
    iconBg: "bg-hanok-primary",
  },
  {
    icon: Sun,
    label: "오늘의 정보",
    description: "날씨, 일정 확인",
    href: "/daily",
    color: "ochre",
    iconBg: "bg-hanok-ochre",
  },
  {
    icon: Phone,
    label: "긴급 연락",
    description: "가족, 119 연결",
    href: "/emergency",
    color: "deep-red",
    iconBg: "bg-hanok-deep-red",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function QuickMenu() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl lg:max-w-4xl mx-auto"
    >
      {/* 타이틀 with 장식 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center mb-6 lg:mb-8"
      >
        <h2 className="text-senior-sm lg:text-senior-base text-text-secondary font-medium inline-flex items-center gap-2">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-hanok-ochre/50" />
          원하시는 메뉴를 선택하세요
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-hanok-ochre/50" />
        </h2>
      </motion.div>

      {/* 모바일: 2열 / 데스크탑: 4열 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {menuItems.map((item, index) => (
          <motion.div key={item.label} variants={itemVariants}>
            <Link href={item.href}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="hanok-card hanok-card-hover p-5 lg:p-6 cursor-pointer
                           flex flex-col gap-4 min-h-[140px] lg:min-h-[180px] relative group"
              >
                {/* 호버 시 상단 액센트 라인 */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-hanok opacity-0 group-hover:opacity-100 transition-opacity duration-300
                             ${item.color === "jade" ? "bg-hanok-jade" :
                               item.color === "terracotta" ? "bg-hanok-terracotta" :
                               item.color === "ochre" ? "bg-hanok-ochre" :
                               "bg-hanok-deep-red"}`}
                />

                {/* 배경 장식 */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-5 transition-opacity duration-500
                             ${item.color === "jade" ? "bg-hanok-jade" :
                               item.color === "terracotta" ? "bg-hanok-terracotta" :
                               item.color === "ochre" ? "bg-hanok-ochre" :
                               "bg-hanok-deep-red"}`}
                />

                {/* 아이콘 */}
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`relative w-14 h-14 lg:w-16 lg:h-16 ${item.iconBg} rounded-hanok-sm
                             flex items-center justify-center shadow-warm`}
                >
                  {/* 아이콘 내부 장식 테두리 */}
                  <div className="absolute inset-1 rounded-[10px] border border-white/20" />
                  <item.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white relative z-10" />

                  {/* 반짝임 효과 - 첫 번째 카드만 */}
                  {index === 0 && (
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-4 h-4 text-hanok-gold" />
                    </motion.div>
                  )}
                </motion.div>

                {/* 텍스트 */}
                <div className="flex-1">
                  <h3
                    className={`text-senior-base lg:text-senior-lg font-bold mb-1.5 transition-colors duration-300
                               ${item.color === "jade" ? "text-hanok-ink group-hover:text-hanok-jade" :
                                 item.color === "terracotta" ? "text-hanok-ink group-hover:text-hanok-terracotta" :
                                 item.color === "ochre" ? "text-hanok-ink group-hover:text-hanok-ochre" :
                                 "text-hanok-ink group-hover:text-hanok-deep-red"}`}
                  >
                    {item.label}
                  </h3>
                  <p className="text-sm lg:text-base text-text-secondary">
                    {item.description}
                  </p>
                </div>

                {/* 화살표 */}
                <div className="flex justify-end">
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ x: 4 }}
                  >
                    <span
                      className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                 ${item.color === "jade" ? "text-hanok-jade" :
                                   item.color === "terracotta" ? "text-hanok-terracotta" :
                                   item.color === "ochre" ? "text-hanok-ochre" :
                                   "text-hanok-deep-red"}`}
                    >
                      바로가기
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 lg:w-6 lg:h-6 transition-all duration-300
                                 ${item.color === "jade" ? "text-hanok-jade/40 group-hover:text-hanok-jade" :
                                   item.color === "terracotta" ? "text-hanok-terracotta/40 group-hover:text-hanok-terracotta" :
                                   item.color === "ochre" ? "text-hanok-ochre/40 group-hover:text-hanok-ochre" :
                                   "text-hanok-deep-red/40 group-hover:text-hanok-deep-red"}`}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
