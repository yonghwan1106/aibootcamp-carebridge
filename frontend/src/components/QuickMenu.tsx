"use client";

import { motion } from "framer-motion";
import { FileText, Heart, Sun, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    icon: FileText,
    label: "복지 정보",
    description: "받을 수 있는 복지 찾기",
    href: "/welfare",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Heart,
    label: "말벗 대화",
    description: "이야기 나누기",
    href: "/companion",
    color: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Sun,
    label: "오늘의 정보",
    description: "날씨, 일정 확인",
    href: "/daily",
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Phone,
    label: "긴급 연락",
    description: "가족, 119 연결",
    href: "/emergency",
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
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
      <h2 className="text-senior-sm lg:text-senior-base text-text-secondary text-center mb-4 lg:mb-6 font-medium">
        원하시는 메뉴를 선택하세요
      </h2>

      {/* 모바일: 2열 / 데스크탑: 4열 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {menuItems.map((item) => (
          <motion.div key={item.label} variants={itemVariants}>
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`${item.bgColor} rounded-2xl p-5 lg:p-6 cursor-pointer
                           border border-white/50 shadow-soft card-hover
                           flex flex-col gap-3 min-h-[120px] lg:min-h-[160px]`}
              >
                {/* 아이콘 */}
                <div
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${item.color}
                             flex items-center justify-center shadow-lg`}
                >
                  <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>

                {/* 텍스트 */}
                <div className="flex-1">
                  <h3 className="text-senior-base lg:text-senior-lg font-bold text-text-primary mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm lg:text-base text-text-secondary">
                    {item.description}
                  </p>
                </div>

                {/* 화살표 */}
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
