// ThemeProvider — next-themes 래퍼 (클라이언트 컴포넌트)
// attribute="class": html 태그에 class="dark" 토글 방식
// defaultTheme="system": OS 설정 자동 감지
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
