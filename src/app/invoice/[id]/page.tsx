// 청구서 상세 페이지 — 항목 테이블, 클라이언트 정보, 상태 배지 표시
// ISR: 3600초 revalidate, 서버 컴포넌트
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar, CalendarCheck, Receipt } from "lucide-react";
import { fetchInvoiceById, formatAmount } from "@/lib/notion";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

// params는 Next.js 16에서 Promise 타입
interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

// 날짜 포맷 — YYYY년 M월 D일 형식
function formatDate(isoDate: string): string {
  if (!isoDate) return "–";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await fetchInvoiceById(id);

  if (!invoice) {
    return { title: "청구서를 찾을 수 없음" };
  }

  return {
    title: `${invoice.invoiceNumber} — ${invoice.clientName}`,
  };
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;

  // 청구서 단건 조회 (항목 포함)
  const invoice = await fetchInvoiceById(id);

  // 존재하지 않는 ID 접근 시 404 처리
  if (!invoice) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          청구서 목록으로 돌아가기
        </Link>
      </div>

      {/* 페이지 헤더 — 견적서 번호 + 상태 배지 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Receipt className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {invoice.invoiceNumber}
          </h1>
        </div>
        <StatusBadge status={invoice.status} className="text-sm px-3 py-1" />
      </div>

      <div className="space-y-6">
        {/* 청구서 기본 정보 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">청구서 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* 클라이언트명 */}
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  클라이언트
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {invoice.clientName}
                </dd>
              </div>

              {/* 총금액 */}
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                  총금액
                </dt>
                <dd className="text-base font-bold text-foreground">
                  {formatAmount(invoice.totalAmount)}
                </dd>
              </div>

              {/* 발행일 */}
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  발행일
                </dt>
                <dd className="text-sm text-foreground">
                  {formatDate(invoice.issueDate)}
                </dd>
              </div>

              {/* 유효기간 */}
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  유효기간
                </dt>
                <dd className="text-sm text-foreground">
                  {formatDate(invoice.validUntil)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 청구서 항목 테이블 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">청구 항목</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {invoice.items.length > 0 ? (
              <InvoiceTable items={invoice.items} />
            ) : (
              <p className="px-6 pb-6 text-sm text-muted-foreground">
                등록된 항목이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 하단 뒤로가기 버튼 */}
        <div className="flex pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
