import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 케어브릿지 - 따뜻한 AI 동반자",
  description: "어르신을 위한 AI 복지 도우미. 복지 정보 안내, 정서 케어, 일상 도움을 음성으로 편리하게 제공합니다.",
  keywords: ["노인 복지", "AI 케어", "복지 정보", "시니어 케어", "음성 AI"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
