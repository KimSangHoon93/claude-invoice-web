// 빈 상태 UI 컴포넌트 — 글이 없거나 검색 결과가 없을 때 표시
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "글이 없습니다",
  description = "아직 발행된 글이 없습니다. 곧 새로운 글이 올라올 예정입니다.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* 아이콘 */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* 제목 */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>

      {/* 설명 */}
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
