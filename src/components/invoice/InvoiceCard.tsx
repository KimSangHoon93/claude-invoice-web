// 청구서 카드 컴포넌트 — 목록 페이지에서 개별 청구서 정보 표시
// 오버레이 링크 패턴: <Link>를 absolute 오버레이로 배치해 <button> 중첩 HTML 오류 방지
import Link from "next/link";
import { Calendar, CalendarCheck, User } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { formatAmount } from "@/lib/notion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { ShareLinkButton } from "@/components/invoice/ShareLinkButton";

interface InvoiceCardProps {
  invoice: Invoice;
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

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    // relative 컨테이너 — 오버레이 링크와 인터랙티브 버튼을 z-index로 분리
    <div className="relative rounded-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* 카드 전체를 덮는 절대 위치 링크 (z-0) — 키보드 포커스 포함 */}
      <Link
        href={`/invoice/${invoice.id}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none"
        aria-label={`${invoice.invoiceNumber} — ${invoice.clientName} 청구서 상세 보기`}
        tabIndex={0}
      />

      {/* 카드 콘텐츠 — pointer-events-none으로 링크 클릭 통과, 버튼만 z-10으로 복원 */}
      <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md pointer-events-none">
        <CardHeader className="pb-3">
          {/* 견적서 번호 + 상태 배지 + 공유 버튼 */}
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {invoice.invoiceNumber}
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={invoice.status} />
              {/* 공유 버튼 — pointer-events-auto + z-10으로 링크 오버레이보다 위에 위치 */}
              <div className="relative z-10 pointer-events-auto">
                <ShareLinkButton invoiceId={invoice.id} variant="icon" />
              </div>
            </div>
          </div>

          {/* 클라이언트명 */}
          <div className="mt-1 flex items-center gap-1.5">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-base font-semibold text-foreground truncate">
              {invoice.clientName}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* 총금액 */}
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatAmount(invoice.totalAmount)}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-1.5 pt-0 border-t border-border">
          {/* 발행일 */}
          <div className="flex items-center gap-1.5 pt-3 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>발행일: {formatDate(invoice.issueDate)}</span>
          </div>

          {/* 유효기간 */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>유효기간: {formatDate(invoice.validUntil)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
