// 관리자 견적서 테이블 — 견적서 번호/클라이언트/금액/상태/발행일/액션 컬럼
// 기존 InvoiceTable(항목 라인아이템 전용)과 별개 컴포넌트
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/invoice/StatusBadge";
import { formatAmount } from "@/lib/notion";
import type { Invoice } from "@/types/invoice";

// 날짜 포맷 — YYYY년 M월 D일
function formatDate(isoDate: string): string {
  if (!isoDate) return "–";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

interface AdminInvoiceTableProps {
  invoices: Invoice[];
}

export function AdminInvoiceTable({ invoices }: AdminInvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        등록된 견적서가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="whitespace-nowrap font-semibold">
              견적서 번호
            </TableHead>
            <TableHead className="whitespace-nowrap font-semibold">
              클라이언트
            </TableHead>
            <TableHead className="whitespace-nowrap text-right font-semibold">
              총금액
            </TableHead>
            <TableHead className="whitespace-nowrap font-semibold">
              상태
            </TableHead>
            <TableHead className="whitespace-nowrap font-semibold">
              발행일
            </TableHead>
            <TableHead className="whitespace-nowrap text-center font-semibold">
              액션
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="hover:bg-muted/30 transition-colors"
            >
              {/* 견적서 번호 */}
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>

              {/* 클라이언트명 */}
              <TableCell>{invoice.clientName || "–"}</TableCell>

              {/* 총금액 — 오른쪽 정렬 */}
              <TableCell className="text-right tabular-nums">
                {formatAmount(invoice.totalAmount)}
              </TableCell>

              {/* 상태 배지 */}
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>

              {/* 발행일 */}
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(invoice.issueDate)}
              </TableCell>

              {/* 액션 — 상세 페이지 링크 */}
              <TableCell className="text-center">
                <Link
                  href={`/invoice/${invoice.id}`}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${invoice.invoiceNumber} 상세 보기`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  상세 보기
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
