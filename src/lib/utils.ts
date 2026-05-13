// Tailwind 클래스 병합 유틸리티 (clsx/tailwind-merge 미사용 간소 버전)
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
