// 청구서 상태 배지 컴포넌트 — 상태별 색상 구분
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

// 상태별 스타일 맵 (테일윈드 유틸리티 직접 적용)
const statusClasses: Record<InvoiceStatus, string> = {
  대기: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  승인: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  거절: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

// 상태별 레이블 (스크린 리더용)
const statusLabels: Record<InvoiceStatus, string> = {
  대기: "대기 중",
  승인: "승인됨",
  거절: "거절됨",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        statusClasses[status],
        className
      )}
      aria-label={statusLabels[status]}
    >
      {status}
    </span>
  );
}
