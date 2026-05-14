// 관리자 대시보드 진입 페이지 (/admin)
// ISR 60초 — 통계 카드 + 최근 견적서 5건 표시
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { fetchInvoices, formatAmount } from "@/lib/notion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminInvoiceTable } from "@/components/admin/AdminInvoiceTable";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "대시보드",
};

export default async function AdminDashboardPage() {
  // 전체 견적서 조회
  const allInvoices = await fetchInvoices();

  // 통계 계산
  const totalCount = allInvoices.length;
  const approvedAmount = allInvoices
    .filter((inv) => inv.status === "승인")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingCount = allInvoices.filter((inv) => inv.status === "대기").length;

  // 최근 견적서 5건 (이미 발행일 내림차순 정렬 가정)
  const recentInvoices = allInvoices.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          대시보드
        </h1>
        <p className="text-sm text-muted-foreground">
          견적서 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* 요약 통계 카드 3종 */}
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="견적서 요약 통계"
      >
        {/* 전체 건수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 건수
            </CardTitle>
            <FileText
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {totalCount.toLocaleString("ko-KR")}건
            </p>
          </CardContent>
        </Card>

        {/* 승인 금액 합계 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              승인 금액 합계
            </CardTitle>
            <CheckCircle
              className="h-4 w-4 text-green-500"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatAmount(approvedAmount)}
            </p>
          </CardContent>
        </Card>

        {/* 대기 건수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              대기 건수
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {pendingCount.toLocaleString("ko-KR")}건
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 최근 견적서 5건 */}
      <section aria-label="최근 견적서">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            최근 견적서
          </h2>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            전체 보기
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <AdminInvoiceTable invoices={recentInvoices} />
      </section>
    </div>
  );
}
