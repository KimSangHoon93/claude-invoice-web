// 배지 컴포넌트 — shadcn/ui new-york 스타일 간소 버전
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

// 변형별 스타일 맵
const variantClasses: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border text-foreground",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
