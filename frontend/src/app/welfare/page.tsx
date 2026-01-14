"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Heart
} from "lucide-react";
import Link from "next/link";
import { searchWelfare } from "@/lib/api";

interface WelfareProgram {
  program_id: string;
  name: string;
  category: string;
  description: string;
  benefit: string;
  eligibility: string[];
  how_to_apply: string;
  contact: string;
  score: number;
}

// 샘플 데이터 (API 연결 전 사용)
const SAMPLE_PROGRAMS: WelfareProgram[] = [
  {
    program_id: "welfare_001",
    name: "기초연금",
    category: "소득지원",
    description: "소득 하위 70%에 해당하는 어르신에게 매월 기초연금을 지급하여 노후 생활 안정을 돕는 제도입니다.",
    benefit: "단독가구 최대 월 334,810원, 부부가구 최대 월 535,680원",
    eligibility: ["만 65세 이상", "대한민국 국적 보유", "국내 거주", "소득인정액이 선정기준액 이하"],
    how_to_apply: "주소지 읍면동 주민센터 방문 또는 복지로 온라인 신청",
    contact: "국민연금공단 1355",
    score: 0.1,
  },
  {
    program_id: "welfare_002",
    name: "노인장기요양보험",
    category: "돌봄서비스",
    description: "고령이나 노인성 질병으로 일상생활이 어려운 분들에게 신체활동, 가사활동 등을 지원하는 사회보험제도입니다.",
    benefit: "재가급여(방문요양, 방문목욕, 방문간호 등), 시설급여(요양원 입소)",
    eligibility: ["만 65세 이상 또는 노인성 질병", "6개월 이상 혼자 일상생활 어려움", "장기요양등급 판정"],
    how_to_apply: "국민건강보험공단 지사 방문 또는 온라인 신청",
    contact: "국민건강보험공단 1577-1000",
    score: 0.15,
  },
  {
    program_id: "welfare_006",
    name: "치매검진 및 치매안심센터",
    category: "건강관리",
    description: "치매 조기 발견을 위한 무료 검진과 치매 환자 및 가족에게 상담, 돌봄, 프로그램 등을 제공합니다.",
    benefit: "무료 치매 선별검사, 진단검사비 지원, 치료비 지원(월 3만원)",
    eligibility: ["치매검진: 만 60세 이상", "치료비지원: 치매 진단 + 기준 중위소득 120% 이하"],
    how_to_apply: "보건소 또는 치매안심센터 방문",
    contact: "치매상담콜센터 1899-9988 (24시간)",
    score: 0.2,
  },
];

const categoryColors: Record<string, string> = {
  "소득지원": "bg-blue-100 text-blue-700",
  "돌봄서비스": "bg-green-100 text-green-700",
  "건강관리": "bg-purple-100 text-purple-700",
  "일자리": "bg-amber-100 text-amber-700",
  "긴급지원": "bg-red-100 text-red-700",
  "여가활동": "bg-pink-100 text-pink-700",
  "의료지원": "bg-teal-100 text-teal-700",
  "주거지원": "bg-indigo-100 text-indigo-700",
  "할인혜택": "bg-orange-100 text-orange-700",
  "안전": "bg-rose-100 text-rose-700",
};

export default function WelfarePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programs, setPrograms] = useState<WelfareProgram[]>(SAMPLE_PROGRAMS);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 검색 실행
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPrograms(SAMPLE_PROGRAMS);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchWelfare(searchQuery, 5);
      if (result.results && result.results.length > 0) {
        setPrograms(result.results);
      } else {
        // API 실패 시 로컬 검색
        const filtered = SAMPLE_PROGRAMS.filter(
          (p) =>
            p.name.includes(searchQuery) ||
            p.description.includes(searchQuery) ||
            p.category.includes(searchQuery)
        );
        setPrograms(filtered.length > 0 ? filtered : SAMPLE_PROGRAMS);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      // 오류 시 로컬 검색
      const filtered = SAMPLE_PROGRAMS.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.description.includes(searchQuery)
      );
      setPrograms(filtered.length > 0 ? filtered : SAMPLE_PROGRAMS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-8">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-warm-50/95 backdrop-blur-sm border-b border-warm-200"
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="w-12 h-12 rounded-xl bg-white shadow-soft flex items-center justify-center
                         hover:bg-warm-100 transition-colors"
              aria-label="홈으로"
            >
              <ArrowLeft className="w-6 h-6 text-text-secondary" />
            </Link>
            <div>
              <h1 className="font-display text-senior-xl text-text-primary font-bold">
                복지 정보
              </h1>
              <p className="text-sm text-text-muted">
                받을 수 있는 복지 혜택을 찾아보세요
              </p>
            </div>
          </div>

          {/* 검색창 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 shadow-soft">
              <Search className="w-6 h-6 text-text-muted mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="어떤 복지가 궁금하세요?"
                className="flex-1 bg-transparent outline-none text-senior-sm text-text-primary
                           placeholder:text-text-muted"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="h-14 px-6 bg-gradient-to-r from-primary-500 to-primary-600
                         text-white rounded-xl font-semibold shadow-warm
                         hover:from-primary-600 hover:to-primary-700 transition-all
                         disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "검색"
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* 복지 프로그램 목록 */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        <p className="text-senior-sm text-text-secondary mb-4">
          {programs.length}개의 복지 프로그램을 찾았어요
        </p>

        <div className="space-y-4">
          <AnimatePresence>
            {programs.map((program, index) => (
              <motion.div
                key={program.program_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                {/* 카드 헤더 */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === program.program_id ? null : program.program_id
                    )
                  }
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${categoryColors[program.category] || "bg-gray-100 text-gray-700"}`}
                        >
                          {program.category}
                        </span>
                      </div>
                      <h3 className="text-senior-base font-bold text-text-primary mb-2">
                        {program.name}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {program.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedId === program.program_id ? (
                        <ChevronUp className="w-6 h-6 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-text-muted" />
                      )}
                    </div>
                  </div>
                </button>

                {/* 상세 내용 */}
                <AnimatePresence>
                  {expandedId === program.program_id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-warm-100 pt-4">
                        {/* 혜택 */}
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-primary-500" />
                            혜택
                          </h4>
                          <p className="text-senior-sm text-text-secondary bg-primary-50 rounded-xl p-4">
                            {program.benefit}
                          </p>
                        </div>

                        {/* 자격요건 */}
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            자격요건
                          </h4>
                          <ul className="space-y-2">
                            {program.eligibility.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-text-secondary"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 신청방법 */}
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            신청방법
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {program.how_to_apply}
                          </p>
                        </div>

                        {/* 연락처 */}
                        <div className="flex items-center justify-between bg-warm-100 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary-500" />
                            <span className="text-senior-sm font-medium text-text-primary">
                              {program.contact}
                            </span>
                          </div>
                          <a
                            href={`tel:${program.contact.replace(/[^0-9]/g, "")}`}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium
                                       hover:bg-primary-600 transition-colors"
                          >
                            전화하기
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
