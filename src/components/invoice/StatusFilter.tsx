// 상태 탭 필터 컴포넌트 — 서버 컴포넌트, Link 기반 URL 파라미터 방식
// 'use client' 불필요 — searchParams는 상위 페이지(서버)에서 내려받음
import Link from "next/link";
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

// 탭 목록 정의 (undefined = 전체)
const FILTER_TABS: { label: string; value: InvoiceStatus | undefined }[] = [
  { label: "전체", value: undefined },
  { label: "대기", value: "대기" },
  { label: "승인", value: "승인" },
  { label: "거절", value: "거절" },
];

interface StatusFilterProps {
  currentStatus?: InvoiceStatus;
}

export function StatusFilter({ currentStatus }: StatusFilterProps) {
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="청구서 상태 필터"
    >
      {FILTER_TABS.map(({ label, value }) => {
        // 현재 탭 여부 확인
        const isActive = currentStatus === value;

        // 탭별 URL 생성 (전체는 쿼리 파라미터 없음)
        const href = value ? `/?status=${encodeURIComponent(value)}` : "/";

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "inline-flex items-center rounded-md border px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
