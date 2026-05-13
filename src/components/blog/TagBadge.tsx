// 태그 배지 컴포넌트 — 단순 표시 전용
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/notion";

interface TagBadgeProps {
  tag: Tag;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background",
        "px-2.5 py-0.5 text-xs text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      # {tag.name}
    </span>
  );
}
