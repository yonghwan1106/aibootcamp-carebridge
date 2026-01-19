"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Volume2,
  VolumeX,
  Type,
  Gauge,
  User,
  Bell,
  Moon,
  Sun,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SettingsState {
  fontSize: "normal" | "large" | "xlarge";
  voiceEnabled: boolean;
  voiceSpeed: "slow" | "normal" | "fast";
  notifications: boolean;
  darkMode: boolean;
  userName: string;
  userAge: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  fontSize: "large",
  voiceEnabled: true,
  voiceSpeed: "slow",
  notifications: true,
  darkMode: false,
  userName: "",
  userAge: "",
};

const FONT_SIZES = [
  { value: "normal", label: "보통", size: "text-base" },
  { value: "large", label: "크게", size: "text-lg" },
  { value: "xlarge", label: "아주 크게", size: "text-xl" },
];

const VOICE_SPEEDS = [
  { value: "slow", label: "느리게", description: "천천히 또박또박" },
  { value: "normal", label: "보통", description: "일반 속도" },
  { value: "fast", label: "빠르게", description: "조금 빠르게" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  // 저장된 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem("carebridge-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 설정 저장
  const saveSettings = () => {
    localStorage.setItem("carebridge-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-warm-50">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center
                           hover:bg-gray-200 transition-colors"
                aria-label="홈으로"
              >
                <ArrowLeft className="w-6 h-6 text-text-secondary" />
              </Link>
              <div>
                <h1 className="font-display text-senior-xl text-text-primary font-bold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-gray-600" />
                  설정
                </h1>
                <p className="text-sm text-text-muted">앱을 내게 맞게 바꿔요</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 글씨 크기 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Type className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-display text-senior-base text-text-primary font-bold">
                글씨 크기
              </h2>
              <p className="text-sm text-text-muted">읽기 편한 크기를 선택하세요</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => updateSetting("fontSize", size.value as SettingsState["fontSize"])}
                className={`py-4 rounded-xl border-2 transition-all ${
                  settings.fontSize === size.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <span className={`${size.size} font-medium block mb-1`}>가</span>
                <span className="text-sm text-text-muted">{size.label}</span>
                {settings.fontSize === size.value && (
                  <Check className="w-4 h-4 text-primary-500 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* 음성 설정 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-display text-senior-base text-text-primary font-bold">
                음성 설정
              </h2>
              <p className="text-sm text-text-muted">AI 음성을 설정하세요</p>
            </div>
          </div>

          {/* 음성 켜기/끄기 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {settings.voiceEnabled ? (
                <Volume2 className="w-5 h-5 text-green-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-senior-sm text-text-primary">음성 재생</span>
            </div>
            <button
              onClick={() => updateSetting("voiceEnabled", !settings.voiceEnabled)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                settings.voiceEnabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow ${
                  settings.voiceEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 음성 속도 */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-muted">음성 속도</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {VOICE_SPEEDS.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => updateSetting("voiceSpeed", speed.value as SettingsState["voiceSpeed"])}
                  disabled={!settings.voiceEnabled}
                  className={`py-3 px-2 rounded-xl border-2 transition-all ${
                    !settings.voiceEnabled
                      ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                      : settings.voiceSpeed === speed.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <span className="text-senior-sm font-medium block">{speed.label}</span>
                  <span className="text-xs text-text-muted">{speed.description}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 알림 설정 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-display text-senior-base text-text-primary font-bold">
                  알림
                </h2>
                <p className="text-sm text-text-muted">복지 소식, 일정 알림</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting("notifications", !settings.notifications)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                settings.notifications ? "bg-amber-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow ${
                  settings.notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </motion.section>

        {/* 내 정보 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-display text-senior-base text-text-primary font-bold">
                내 정보
              </h2>
              <p className="text-sm text-text-muted">맞춤 서비스를 위해 알려주세요</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">이름 (별명)</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => updateSetting("userName", e.target.value)}
                placeholder="예: 홍길동"
                className="w-full h-12 px-4 bg-gray-50 rounded-xl text-senior-sm text-text-primary
                           placeholder:text-text-muted outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">연령대</label>
              <div className="grid grid-cols-4 gap-2">
                {["60대", "70대", "80대", "90대 이상"].map((age) => (
                  <button
                    key={age}
                    onClick={() => updateSetting("userAge", age)}
                    className={`py-3 rounded-xl border-2 text-sm transition-all ${
                      settings.userAge === age
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 bg-gray-50 text-text-secondary hover:border-gray-300"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 저장 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-8"
        >
          <button
            onClick={saveSettings}
            className={`w-full py-4 rounded-xl font-display text-senior-base font-bold
                       transition-all flex items-center justify-center gap-2 ${
                         saved
                           ? "bg-green-500 text-white"
                           : "bg-primary-500 text-white hover:bg-primary-600"
                       }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                저장되었습니다!
              </>
            ) : (
              "설정 저장하기"
            )}
          </button>
        </motion.div>

        {/* 앱 정보 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pb-8"
        >
          <div className="text-center text-sm text-text-muted">
            <p>AI 케어브릿지 v1.0.0</p>
            <p className="mt-1">커널 아카데미 AI 부트캠프 15기</p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
