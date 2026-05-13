import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "개인 개발 블로그",
    template: "%s | 개인 개발 블로그",
  },
  description: "Notion CMS 기반 1인 개발자 기술 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 헤더 슬롯 — Phase 2에서 Header 컴포넌트로 교체 */}
        <header />
        <main className="flex-1">{children}</main>
        {/* 푸터 슬롯 — Phase 2에서 Footer 컴포넌트로 교체 */}
        <footer />
      </body>
    </html>
  );
}
