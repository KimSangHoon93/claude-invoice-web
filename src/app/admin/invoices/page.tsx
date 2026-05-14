// 관리자 견적서 목록 페이지 (/admin/invoices)
// 테이블 형식 — 카드 그리드(공개 홈)와 별개 뷰
import type { Metadata } from "next";
import { fetchInvoices } from "@/lib/notion";
import { AdminInvoiceTable } from "@/components/admin/AdminInvoiceTable";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "견적서 관리",
};

export default async function AdminInvoicesPage() {
  const invoices = await fetchInvoices();

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          견적서 관리
        </h1>
        <p className="text-sm text-muted-foreground">
          전체 {invoices.length.toLocaleString("ko-KR")}건의 견적서
        </p>
      </div>

      {/* 전체 견적서 테이블 */}
      <AdminInvoiceTable invoices={invoices} />
    </div>
  );
}
