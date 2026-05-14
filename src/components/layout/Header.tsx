// 헤더 컴포넌트 — InvoiceHub 로고 + 다크모드 토글 + 새 청구서 버튼
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* 로고 — 홈(청구서 목록)으로 이동 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
          aria-label="InvoiceHub 홈으로 이동"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
          <span className="text-base">InvoiceHub</span>
        </Link>

        {/* 글로벌 네비게이션 */}
        <nav className="flex items-center gap-2" aria-label="글로벌 네비게이션">
          {/* 다크모드 토글 버튼 */}
          <ThemeToggle />

          {/* 새 청구서 버튼 — 시각 UI, href만 연결 (기능 없음) */}
          {/* TODO: /invoice/new 페이지 구현 필요 */}
          <Link
            href="/invoice/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="새 청구서 작성"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">새 청구서</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
