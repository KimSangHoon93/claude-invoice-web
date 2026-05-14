// 루트 레이아웃 — html/body/폰트/ThemeProvider/Toaster 담당
// Header, Footer는 (main)/layout.tsx 에서 관리
// Admin 레이아웃은 app/admin/layout.tsx 에서 관리
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

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
    // suppressHydrationWarning — next-themes가 class="dark" 주입 시 hydration 경고 방지
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* 전역 Toast 알림 — Sonner 기반 */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
