// (main) 그룹 레이아웃 — 공개 페이지 공통 셸
// Header(상단 네비) + main 콘텐츠 영역 + Footer
// URL에는 영향 없음 (라우트 그룹)
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 공통 헤더 */}
      <Header />
      {/* 페이지 콘텐츠 */}
      <main className="flex-1">{children}</main>
      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}
