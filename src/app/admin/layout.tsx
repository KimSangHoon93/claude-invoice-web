// 관리자 전용 중첩 레이아웃 — 사이드바(데스크톱) + 모바일 드로어
// 루트 layout.tsx의 헤더/푸터는 렌더링되지 않음 (admin은 (main) 그룹 밖)
import type { Metadata } from "next";
import {
  AdminSidebarDesktop,
  AdminSidebarMobile,
} from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s | InvoiceHub Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 전체 화면 높이 채우기 — flex-col(모바일) → lg:flex-row(데스크톱)
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* 데스크톱 고정 사이드바 */}
      <AdminSidebarDesktop />

      {/* 오른쪽 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col">
        {/* 모바일 상단 바 (사이드바 드로어 트리거 포함) */}
        <AdminSidebarMobile />

        {/* 페이지 본문 */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
