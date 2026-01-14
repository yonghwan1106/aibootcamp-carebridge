import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 따뜻한 메인 컬러
        primary: {
          50: "#FFF8F0",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        // 차분한 세컨더리 컬러
        secondary: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        // 배경 베이지
        warm: {
          50: "#FEFDFB",
          100: "#FBF7F0",
          200: "#F5EEE1",
          300: "#EDE0CA",
          400: "#DBC9A6",
          500: "#C9B282",
        },
        // 텍스트 컬러
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        display: ["var(--font-gmarket)", "GmarketSans", "sans-serif"],
      },
      fontSize: {
        // 노인 친화적 큰 글씨
        "senior-xs": ["1rem", { lineHeight: "1.5" }],
        "senior-sm": ["1.125rem", { lineHeight: "1.6" }],
        "senior-base": ["1.25rem", { lineHeight: "1.7" }],
        "senior-lg": ["1.5rem", { lineHeight: "1.6" }],
        "senior-xl": ["1.875rem", { lineHeight: "1.5" }],
        "senior-2xl": ["2.25rem", { lineHeight: "1.4" }],
        "senior-3xl": ["3rem", { lineHeight: "1.3" }],
      },
      spacing: {
        // 넉넉한 터치 타겟
        "touch": "48px",
        "touch-lg": "56px",
        "touch-xl": "64px",
      },
      borderRadius: {
        "soft": "1rem",
        "softer": "1.5rem",
        "pill": "9999px",
      },
      boxShadow: {
        "warm": "0 4px 20px -2px rgba(249, 115, 22, 0.15)",
        "soft": "0 4px 30px -4px rgba(0, 0, 0, 0.08)",
        "glow": "0 0 40px -10px rgba(249, 115, 22, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "wave": "wave 2.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(20deg)" },
          "75%": { transform: "rotate(-15deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
