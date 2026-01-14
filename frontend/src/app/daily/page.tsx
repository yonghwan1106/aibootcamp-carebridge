"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Calendar,
  Clock,
  Pill,
  Bell,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  description: string;
}

interface Schedule {
  id: string;
  time: string;
  title: string;
  type: "medication" | "appointment" | "activity";
}

// 샘플 데이터
const SAMPLE_WEATHER: WeatherInfo = {
  temperature: 5,
  condition: "sunny",
  humidity: 45,
  wind: 12,
  description: "맑고 건조한 날씨입니다. 외출 시 따뜻하게 입으세요.",
};

const SAMPLE_SCHEDULES: Schedule[] = [
  { id: "1", time: "08:00", title: "아침 약 복용", type: "medication" },
  { id: "2", time: "10:00", title: "경로당 체조", type: "activity" },
  { id: "3", time: "14:00", title: "병원 진료 예약", type: "appointment" },
  { id: "4", time: "18:00", title: "저녁 약 복용", type: "medication" },
];

const QUICK_CALLS = [
  { name: "보건소", number: "02-1234-5678", icon: "🏥" },
  { name: "주민센터", number: "02-2345-6789", icon: "🏛️" },
  { name: "약국", number: "02-3456-7890", icon: "💊" },
];

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="w-16 h-16 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="w-16 h-16 text-gray-500" />;
    case "rainy":
      return <CloudRain className="w-16 h-16 text-blue-500" />;
    default:
      return <Sun className="w-16 h-16 text-yellow-500" />;
  }
};

const getScheduleIcon = (type: string) => {
  switch (type) {
    case "medication":
      return <Pill className="w-5 h-5 text-red-500" />;
    case "appointment":
      return <Calendar className="w-5 h-5 text-blue-500" />;
    case "activity":
      return <Bell className="w-5 h-5 text-green-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getScheduleColor = (type: string) => {
  switch (type) {
    case "medication":
      return "bg-red-50 border-red-200";
    case "appointment":
      return "bg-blue-50 border-blue-200";
    case "activity":
      return "bg-green-50 border-green-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export default function DailyPage() {
  const [weather] = useState<WeatherInfo>(SAMPLE_WEATHER);
  const [schedules] = useState<Schedule[]>(SAMPLE_SCHEDULES);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return date.toLocaleDateString("ko-KR", options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <div className="flex items-center gap-4">
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
                오늘의 정보
              </h1>
              <p className="text-sm text-text-muted">{formatDate(currentTime)}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 현재 시간 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <p className="text-6xl font-bold text-text-primary font-display">
            {formatTime(currentTime)}
          </p>
        </motion.div>

        {/* 날씨 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-senior-base font-semibold text-text-primary mb-2">
                오늘 날씨
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-6 h-6 text-red-500" />
                <span className="text-4xl font-bold text-text-primary">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Wind className="w-4 h-4" /> {weather.wind}m/s
                </span>
                <span>습도 {weather.humidity}%</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              {getWeatherIcon(weather.condition)}
              <span className="text-sm text-text-secondary mt-2">맑음</span>
            </div>
          </div>
          <p className="mt-4 text-senior-sm text-text-secondary bg-white/50 rounded-xl p-3">
            {weather.description}
          </p>
        </motion.div>

        {/* 오늘 일정 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-senior-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-500" />
            오늘 일정
          </h2>
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getScheduleColor(
                  schedule.type
                )}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-senior-base font-bold text-text-primary min-w-[60px]">
                    {schedule.time}
                  </span>
                  {getScheduleIcon(schedule.type)}
                </div>
                <span className="text-senior-sm text-text-secondary">
                  {schedule.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 빠른 연락 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-senior-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary-500" />
            자주 쓰는 연락처
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_CALLS.map((call) => (
              <a
                key={call.name}
                href={`tel:${call.number.replace(/-/g, "")}`}
                className="flex flex-col items-center p-4 bg-warm-50 rounded-xl
                           hover:bg-warm-100 transition-colors"
              >
                <span className="text-3xl mb-2">{call.icon}</span>
                <span className="text-sm font-medium text-text-primary">
                  {call.name}
                </span>
                <span className="text-xs text-text-muted">{call.number}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* 위치 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-warm-100 rounded-2xl p-4 flex items-center gap-3"
        >
          <MapPin className="w-6 h-6 text-primary-500" />
          <div>
            <p className="text-sm text-text-muted">현재 위치</p>
            <p className="text-senior-sm text-text-primary font-medium">
              서울특별시 종로구
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
