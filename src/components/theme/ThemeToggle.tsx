// 라이트/다크 모드 전환 토글 버튼 (클라이언트 컴포넌트)
// useTheme의 resolvedTheme으로 SSR/CSR 불일치 방지
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // resolvedTheme이 undefined인 SSR 단계에서는 빈 공간으로 레이아웃 유지
  // next-themes는 suppressHydrationWarning과 함께 hydration mismatch를 자동 처리
  if (!resolvedTheme) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
