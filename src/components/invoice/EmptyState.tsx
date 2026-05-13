// 빈 상태 UI 컴포넌트 — 청구서 목록이 없을 때 표시
import { FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "청구서가 없습니다",
  description = "조건에 맞는 청구서가 없습니다.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 px-4 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileSearch className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* 제목 */}
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>

      {/* 설명 */}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
