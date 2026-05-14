// 관리자 사이드바 — 데스크톱: 고정 세로 메뉴 / 모바일: Sheet 드로어
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// 사이드바 네비게이션 항목 정의
const NAV_ITEMS = [
  {
    href: "/admin",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/invoices",
    label: "견적서 관리",
    icon: FileText,
  },
  {
    href: "/admin/settings",
    label: "설정",
    icon: Settings,
  },
] as const;

// 개별 네비게이션 링크 — 현재 경로 활성화 표시
function NavItem({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  // /admin 은 정확히 일치, 하위 경로는 startsWith로 확인
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

// 사이드바 내용 — 로고 + 네비게이션 목록
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="관리자 네비게이션">
      {/* 관리자 브랜드 헤더 */}
      <div className="mb-4 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Admin
        </p>
        <p className="text-base font-bold text-foreground">InvoiceHub</p>
      </div>

      {/* 네비게이션 항목 목록 */}
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} onClick={onNavClick} />
      ))}
    </nav>
  );
}

// 데스크톱 사이드바 — 왼쪽 고정 패널
export function AdminSidebarDesktop() {
  return (
    <aside
      className="hidden w-56 shrink-0 border-r border-border bg-background lg:block"
      aria-label="관리자 사이드바"
    >
      <SidebarContent />
    </aside>
  );
}

// 모바일 사이드바 — 상단 바 + Sheet 드로어
export function AdminSidebarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-14 items-center border-b border-border bg-background px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>관리자 메뉴</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 모바일 헤더 타이틀 */}
      <span className="ml-3 text-base font-semibold text-foreground">
        InvoiceHub Admin
      </span>

      {/* 닫기 버튼 (Sheet 내부에 이미 있으나 헤더 우측에도 표시) */}
      {open && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
