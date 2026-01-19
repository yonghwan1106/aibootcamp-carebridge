"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  Heart,
  FileText,
  Sun,
  Phone,
  Mic,
  MessageCircle,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FEATURES = [
  {
    icon: Heart,
    title: "말벗 대화",
    description: "외로울 때 편하게 대화를 나눌 수 있어요. AI가 따뜻하게 이야기를 들어드려요.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: FileText,
    title: "복지 정보",
    description: "받을 수 있는 복지 혜택을 알려드려요. 기초연금, 돌봄 서비스 등을 안내해 드려요.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Sun,
    title: "일상 정보",
    description: "오늘 날씨, 일정 관리 등 생활에 필요한 정보를 알려드려요.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Phone,
    title: "긴급 연락",
    description: "급할 때 보호자나 119에 빠르게 연락할 수 있어요.",
    color: "bg-red-100 text-red-600",
  },
];

const FAQ_LIST: FAQItem[] = [
  {
    question: "어떻게 말을 걸면 되나요?",
    answer: "홈 화면의 큰 마이크 버튼을 누르시면 돼요. 버튼을 누르고 편하게 말씀하시면 AI가 알아듣고 대답해 드려요.",
  },
  {
    question: "음성이 안 들려요",
    answer: "설정에서 '음성 재생'이 켜져 있는지 확인해 주세요. 스마트폰 볼륨도 확인해 주세요.",
  },
  {
    question: "글씨가 작아서 잘 안 보여요",
    answer: "우측 상단 설정(톱니바퀴) 버튼을 눌러 글씨 크기를 '크게' 또는 '아주 크게'로 바꿀 수 있어요.",
  },
  {
    question: "개인정보는 안전한가요?",
    answer: "네, 안전해요. 대화 내용은 서비스 개선 목적으로만 사용되며, 외부에 공개되지 않아요.",
  },
  {
    question: "인터넷이 안 되면 어떻게 하나요?",
    answer: "케어브릿지는 인터넷이 필요해요. Wi-Fi나 데이터가 연결되어 있는지 확인해 주세요.",
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border-b border-gray-100 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="text-senior-sm text-text-primary font-medium pr-4">
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-senior-sm text-text-secondary leading-relaxed">
          {item.answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-warm-50">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-purple-100"
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center
                         hover:bg-purple-100 transition-colors"
              aria-label="홈으로"
            >
              <ArrowLeft className="w-6 h-6 text-text-secondary" />
            </Link>
            <div>
              <h1 className="font-display text-senior-xl text-text-primary font-bold flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-purple-500" />
                도움말
              </h1>
              <p className="text-sm text-text-muted">사용 방법을 알려드려요</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-8">
        {/* 사용법 안내 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-senior-lg font-bold">사용법</h2>
                <p className="text-white/80 text-sm">간단하게 시작해요</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-senior-sm">홈 화면의 <strong>큰 마이크 버튼</strong>을 눌러요</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-senior-sm">원하는 것을 <strong>말씀하세요</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-senior-sm">AI가 <strong>음성으로 답변</strong>해 드려요</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 기능 소개 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-senior-lg text-text-primary font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            주요 기능
          </h2>
          <div className="grid gap-4">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-senior-base text-text-primary font-bold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-senior-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 자주 묻는 질문 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-senior-lg text-text-primary font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            자주 묻는 질문
          </h2>
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            {FAQ_LIST.map((item, index) => (
              <FAQAccordion key={index} item={item} />
            ))}
          </div>
        </motion.section>

        {/* 문의하기 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-8"
        >
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <Volume2 className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <h3 className="font-display text-senior-base text-text-primary font-bold mb-2">
              더 도움이 필요하신가요?
            </h3>
            <p className="text-senior-sm text-text-secondary mb-4">
              복지 상담은 <strong className="text-primary-500">129</strong>로 전화해 주세요
            </p>
            <a
              href="tel:129"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white
                         rounded-xl font-medium text-senior-sm hover:bg-primary-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              129 전화하기
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
