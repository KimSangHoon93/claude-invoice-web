import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    default: "InvoiceHub — 청구서 관리",
    template: "%s | InvoiceHub",
  },
  description: "Notion CMS 기반 청구서 관리 애플리케이션",
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
        {/* 헤더 — Phase 2에서 컴포넌트로 교체 완료 */}
        <Header />
        <main className="flex-1">{children}</main>
        {/* 푸터 — Phase 2에서 컴포넌트로 교체 완료 */}
        <Footer />
      </body>
    </html>
  );
}
