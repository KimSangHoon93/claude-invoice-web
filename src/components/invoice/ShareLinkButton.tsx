// 공유 링크 복사 버튼 — Clipboard API 기반 클라이언트 컴포넌트
// 복사 성공 시 2초간 Check 아이콘으로 전환 + Toast 피드백
// Clipboard API 미지원 시 execCommand('copy') fallback
"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareLinkButtonProps {
  invoiceId: string;
  // variant: "icon" — 카드용 아이콘만 표시 / "text" — 상세 페이지용 텍스트+아이콘
  variant?: "icon" | "text";
  className?: string;
}

export function ShareLinkButton({
  invoiceId,
  variant = "icon",
  className,
}: ShareLinkButtonProps) {
  // 복사 완료 상태 (2초간 유지)
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // NEXT_PUBLIC_BASE_URL 환경 변수로 절대 URL 구성
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${baseUrl}/invoice/${invoiceId}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Clipboard API 지원 환경
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback — execCommand 방식 (구형 브라우저/비 HTTPS 환경)
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // 복사 성공 피드백
      setCopied(true);
      toast.success("링크가 복사되었습니다", {
        description: url,
        duration: 2500,
      });

      // 2초 후 아이콘 원래대로 복귀
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("링크 복사에 실패했습니다", {
        description: "직접 URL을 복사해 주세요.",
      });
    }
  }

  if (variant === "text") {
    // 상세 페이지 헤더 액션 영역용 — 텍스트 라벨 포함
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className={cn("gap-1.5", className)}
        aria-label="청구서 링크 복사"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{copied ? "복사됨" : "링크 복사"}</span>
      </Button>
    );
  }

  // 카드용 — 아이콘만 표시
  return (
    <button
      type="button"
      onClick={(e) => {
        // 카드 클릭(상세 이동)과 이벤트 충돌 방지
        e.preventDefault();
        e.stopPropagation();
        handleCopy();
      }}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="링크 복사"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
