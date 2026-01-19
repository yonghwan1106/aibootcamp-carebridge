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
        // 한옥 컬러 팔레트 - Hanok Color Palette
        hanok: {
          cream: "#FDF8F3",
          "warm-white": "#FAF6F1",
          ochre: "#D4A574",
          terracotta: "#C67B5C",
          "deep-red": "#8B4744",
          jade: "#5B8A72",
          pine: "#3D5A4C",
          ink: "#2C3E50",
          charcoal: "#1A2530",
          gold: "#D4AF37",
          sky: "#87CEEB",
        },
        // 프라이머리 - 단청 적갈색 계열
        primary: {
          50: "#FEF7F5",
          100: "#FCEBE6",
          200: "#F9D4C9",
          300: "#F2B09D",
          400: "#E88A6D",
          500: "#C67B5C",
          600: "#A65D42",
          700: "#8B4744",
          800: "#6E3836",
          900: "#5A2E2D",
        },
        // 세컨더리 - 옥색 계열
        secondary: {
          50: "#F2F8F5",
          100: "#E0EDE6",
          200: "#C2DCD0",
          300: "#96C4AD",
          400: "#6AA689",
          500: "#5B8A72",
          600: "#476F5B",
          700: "#3D5A4C",
          800: "#33493F",
          900: "#2B3D35",
        },
        // 배경 - 한지 계열
        warm: {
          50: "#FEFDFB",
          100: "#FDF8F3",
          200: "#F5EBE0",
          300: "#EDE0D4",
          400: "#DBC9B0",
          500: "#D4A574",
        },
        // 텍스트 컬러
        text: {
          primary: "#2C3E50",
          secondary: "#4A5568",
          muted: "#8B9AAF",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        serif: ["var(--font-noto-serif)", "Noto Serif KR", "Georgia", "Times New Roman", "serif"],
        display: ["var(--font-noto-serif)", "Noto Serif KR", "Georgia", "serif"],
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
        "senior-4xl": ["3.75rem", { lineHeight: "1.2" }],
      },
      spacing: {
        // 넉넉한 터치 타겟
        "touch": "48px",
        "touch-lg": "56px",
        "touch-xl": "64px",
      },
      borderRadius: {
        "hanok": "20px",
        "hanok-sm": "14px",
        "hanok-lg": "28px",
        "soft": "1rem",
        "softer": "1.5rem",
        "pill": "9999px",
      },
      boxShadow: {
        // 한옥 스타일 그림자
        "hanok": "0 4px 24px -4px rgba(139, 71, 68, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
        "hanok-hover": "0 16px 48px -8px rgba(139, 71, 68, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)",
        "hanok-glow": "0 0 60px -10px rgba(198, 123, 92, 0.5), 0 0 100px -20px rgba(212, 165, 116, 0.3)",
        "warm": "0 4px 20px -2px rgba(139, 71, 68, 0.12)",
        "soft": "0 4px 30px -4px rgba(0, 0, 0, 0.08)",
        "elevated": "0 8px 40px -8px rgba(139, 71, 68, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)",
      },
      backgroundImage: {
        // 한옥 그라디언트
        "hanok-primary": "linear-gradient(135deg, #C67B5C 0%, #8B4744 100%)",
        "hanok-secondary": "linear-gradient(135deg, #5B8A72 0%, #3D5A4C 100%)",
        "hanok-ochre": "linear-gradient(135deg, #D4A574 0%, #C67B5C 100%)",
        "hanji": "linear-gradient(165deg, #FDF8F3 0%, #F5EBE0 40%, #EDE0D4 100%)",
        "hanji-card": "linear-gradient(145deg, rgba(253, 248, 243, 0.95) 0%, rgba(245, 235, 224, 0.9) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "wave": "wave 2.5s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
        "breath": "breath 3s ease-in-out infinite",
        "sway": "sway 4s ease-in-out infinite",
        "fade-in": "fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(25deg)" },
          "75%": { transform: "rotate(-15deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "breath": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "sway": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "fade-in": {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "from": { opacity: "0", transform: "translateY(40px) rotate(-1deg)" },
          "to": { opacity: "1", transform: "translateY(0) rotate(0deg)" },
        },
        "scale-in": {
          "from": { opacity: "0", transform: "scale(0.92)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        "hanok": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
