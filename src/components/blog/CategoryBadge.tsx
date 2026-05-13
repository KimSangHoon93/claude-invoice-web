// 카테고리 배지 컴포넌트 — Link로 카테고리 페이지 이동
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/notion";

// 카테고리별 색상 맵
const categoryColorMap: Record<string, string> = {
  react: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  typescript: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  nextjs: "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  /** true이면 Link 없이 span으로만 렌더링 */
  static?: boolean;
}

export function CategoryBadge({
  category,
  className,
  static: isStatic = false,
}: CategoryBadgeProps) {
  const colorClass =
    categoryColorMap[category.slug] ??
    "bg-secondary text-secondary-foreground hover:bg-secondary/80";

  const baseClass = cn(
    "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
    colorClass,
    className
  );

  if (isStatic) {
    return <span className={baseClass}>{category.name}</span>;
  }

  return (
    <Link href={`/category/${category.slug}`} className={baseClass}>
      {category.name}
    </Link>
  );
}
