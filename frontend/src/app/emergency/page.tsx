"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  Heart,
  Shield,
  Users,
  Siren,
  MessageCircle,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  priority: "high" | "medium" | "low";
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "1",
    name: "119 응급신고",
    number: "119",
    description: "화재, 구급, 구조 신고",
    icon: <Siren className="w-8 h-8" />,
    color: "bg-red-500",
    priority: "high",
  },
  {
    id: "2",
    name: "112 경찰신고",
    number: "112",
    description: "범죄, 치안 관련 신고",
    icon: <Shield className="w-8 h-8" />,
    color: "bg-blue-600",
    priority: "high",
  },
  {
    id: "3",
    name: "129 보건복지콜",
    number: "129",
    description: "복지 상담 및 긴급지원",
    icon: <Heart className="w-8 h-8" />,
    color: "bg-green-500",
    priority: "medium",
  },
  {
    id: "4",
    name: "1577-0199 정신건강위기",
    number: "15770199",
    description: "정신건강 위기상담 (24시간)",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "bg-purple-500",
    priority: "medium",
  },
  {
    id: "5",
    name: "1899-9988 치매상담",
    number: "18999988",
    description: "치매 관련 상담 (24시간)",
    icon: <Users className="w-8 h-8" />,
    color: "bg-teal-500",
    priority: "medium",
  },
  {
    id: "6",
    name: "1577-1389 노인학대신고",
    number: "15771389",
    description: "노인 학대 상담 및 신고",
    icon: <AlertTriangle className="w-8 h-8" />,
    color: "bg-orange-500",
    priority: "medium",
  },
];

const FAMILY_CONTACTS = [
  { name: "아들 (김철수)", number: "010-1234-5678", relation: "자녀" },
  { name: "딸 (김영희)", number: "010-2345-6789", relation: "자녀" },
  { name: "이웃 (박순자)", number: "010-3456-7890", relation: "이웃" },
];

export default function EmergencyPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <main className="min-h-screen pb-8 bg-gradient-to-b from-red-50 to-warm-50">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-red-500 text-white"
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center
                         hover:bg-white/30 transition-colors"
              aria-label="홈으로"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="font-display text-senior-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-8 h-8" />
                긴급 연락
              </h1>
              <p className="text-sm text-red-100">
                도움이 필요하시면 버튼을 누르세요
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* SOS 버튼 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCall("119")}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-red-600
                       shadow-lg shadow-red-300 flex flex-col items-center justify-center
                       border-4 border-red-400"
          >
            <Siren className="w-16 h-16 text-white mb-2" />
            <span className="text-2xl font-bold text-white">SOS</span>
            <span className="text-sm text-red-100">119 신고</span>
          </motion.button>
        </motion.div>

        {/* 긴급 연락처 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-senior-base font-semibold text-text-primary px-2">
            긴급 전화번호
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS.map((contact, index) => (
              <motion.button
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCall(contact.number)}
                className={`${contact.color} text-white rounded-2xl p-4 shadow-soft
                           flex flex-col items-center text-center min-h-[140px] justify-center`}
              >
                {contact.icon}
                <span className="text-senior-sm font-bold mt-2">{contact.name}</span>
                <span className="text-xs opacity-80 mt-1">{contact.description}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 가족 연락처 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-senior-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" />
            가족 연락처
          </h2>
          <div className="space-y-3">
            {FAMILY_CONTACTS.map((contact, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCall(contact.number.replace(/-/g, ""))}
                className="w-full flex items-center justify-between p-4 bg-warm-50 rounded-xl
                           hover:bg-warm-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="text-left">
                    <p className="text-senior-sm font-medium text-text-primary">
                      {contact.name}
                    </p>
                    <p className="text-sm text-text-muted">{contact.relation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{contact.number}</span>
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 현재 위치 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-amber-800">현재 위치 (신고 시 알려주세요)</p>
              <p className="text-senior-sm text-amber-900 font-bold mt-1">
                서울특별시 종로구 종로1가 1-1
              </p>
              <p className="text-xs text-amber-700 mt-1">
                정확한 위치는 GPS 기반으로 자동 전송됩니다
              </p>
            </div>
          </div>
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-muted text-sm p-4"
        >
          <p>위급한 상황이 아닌 경우</p>
          <p>
            <Link href="/" className="text-primary-500 font-medium underline">
              메인 화면으로 돌아가기
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
