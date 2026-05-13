// 청구서 항목 테이블 컴포넌트 — 항목명, 단가, 수량, 금액 표시
import type { InvoiceItem } from "@/types/invoice";
import { formatAmount } from "@/lib/notion";
import { cn } from "@/lib/utils";

interface InvoiceTableProps {
  items: InvoiceItem[];
  className?: string;
}

export function InvoiceTable({ items, className }: InvoiceTableProps) {
  // 항목 금액 합계 계산
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm" aria-label="청구서 항목 목록">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th
              scope="col"
              className="px-4 py-3 text-left font-semibold text-foreground"
            >
              항목명
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold text-foreground"
            >
              단가
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold text-foreground"
            >
              수량
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold text-foreground"
            >
              금액
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-muted/30"
            >
              {/* 항목명 */}
              <td className="px-4 py-3 text-foreground">{item.name}</td>

              {/* 단가 */}
              <td className="px-4 py-3 text-right text-muted-foreground">
                {formatAmount(item.unitPrice)}
              </td>

              {/* 수량 */}
              <td className="px-4 py-3 text-right text-muted-foreground">
                {item.quantity.toLocaleString("ko-KR")}
              </td>

              {/* 금액 */}
              <td className="px-4 py-3 text-right font-medium text-foreground">
                {formatAmount(item.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>

        {/* 합계 행 */}
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/30">
            <td
              colSpan={3}
              className="px-4 py-3 text-right font-semibold text-foreground"
            >
              합계
            </td>
            <td className="px-4 py-3 text-right text-base font-bold text-foreground">
              {formatAmount(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
