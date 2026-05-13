// 청구서 목록 홈 페이지 — 요약 통계 + 상태 필터 탭 + 검색 + 카드 그리드
// ISR: 60초 revalidate, 서버 컴포넌트
import type { Metadata } from "next";
import { Suspense } from "react";
import type { InvoiceStatus } from "@/types/invoice";
import { fetchInvoices, formatAmount, searchInvoices } from "@/lib/notion";
import { InvoiceCard } from "@/components/invoice/InvoiceCard";
import { EmptyState } from "@/components/invoice/EmptyState";
import { StatusFilter } from "@/components/invoice/StatusFilter";
import { SearchBar } from "@/components/invoice/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "청구서 목록",
  description: "Notion 기반 청구서 관리 시스템 — 전체 청구서를 조회하고 상태를 관리합니다.",
  openGraph: {
    title: "InvoiceHub — 청구서 목록",
    description: "Notion 기반 청구서 관리 시스템",
  },
};

// searchParams 타입 — Next.js 16에서 Promise로 전달됨
interface HomePageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

// 유효한 InvoiceStatus 값 목록
const VALID_STATUSES: InvoiceStatus[] = ["대기", "승인", "거절"];

// 문자열이 유효한 InvoiceStatus인지 확인
function parseStatus(value: string | undefined): InvoiceStatus | undefined {
  if (!value) return undefined;
  return VALID_STATUSES.includes(value as InvoiceStatus)
    ? (value as InvoiceStatus)
    : undefined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { status: rawStatus, q } = await searchParams;
  const currentStatus = parseStatus(rawStatus);
  const searchQuery = q?.trim() ?? "";

  // 전체 청구서 한 번 조회 — 통계와 필터링에 모두 사용
  const allInvoices = await fetchInvoices();

  // 요약 통계 계산 (항상 전체 기준)
  const totalCount = allInvoices.length;
  const approvedAmount = allInvoices
    .filter((inv) => inv.status === "승인")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingCount = allInvoices.filter((inv) => inv.status === "대기").length;

  // 상태 필터 + 검색어 순서로 적용
  const statusFiltered = currentStatus
    ? allInvoices.filter((inv) => inv.status === currentStatus)
    : allInvoices;
  const filteredInvoices = searchQuery
    ? searchInvoices(statusFiltered, searchQuery)
    : statusFiltered;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* 페이지 헤더 */}
      <section className="mb-8">
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          청구서 목록
        </h1>
        <p className="text-muted-foreground">
          전체 청구서를 조회하고 상태를 확인합니다.
        </p>
      </section>

      {/* 요약 통계 카드 3개 */}
      <section
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="청구서 요약 통계"
      >
        {/* 전체 건수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 건수
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
            <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
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

      {/* 상태 탭 필터 + 검색 바 */}
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="청구서 필터 및 검색">
        <StatusFilter currentStatus={currentStatus} />
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </section>

      {/* 청구서 카드 그리드 — 모바일 1열, sm:2열, lg:3열 */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          title={
            currentStatus
              ? `'${currentStatus}' 상태의 청구서가 없습니다`
              : "등록된 청구서가 없습니다"
          }
          description={
            currentStatus
              ? "다른 상태 탭을 선택하거나 새 청구서를 등록해 보세요."
              : "새 청구서를 등록하면 이 곳에 표시됩니다."
          }
        />
      ) : (
        <section aria-label="청구서 목록">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>

          {/* 결과 건수 표시 */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {currentStatus
              ? `${currentStatus} 청구서 ${filteredInvoices.length}건`
              : `전체 ${filteredInvoices.length}건`}
          </p>
        </section>
      )}
    </div>
  );
}
