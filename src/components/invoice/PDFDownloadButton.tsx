// PDF 다운로드 버튼 — 클라이언트 전용 컴포넌트
// PDFDownloadLink는 Blob/URL API를 사용하므로 SSR 비활성화 필수
// dynamic import를 이 파일 내부에서 처리 (Server Component인 page.tsx에서는 처리 불가)
"use client";

import dynamic from "next/dynamic";
import type { Invoice } from "@/types/invoice";
import { InvoicePDF } from "./InvoicePDF";

// PDFDownloadLink를 SSR 없이 동적 로드
// @react-pdf/renderer는 브라우저 전용 Blob/URL API에 의존
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    // 로딩 중 표시할 임시 버튼
    loading: () => (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-xs"
      >
        생성 중...
      </button>
    ),
  }
);

// =========================================================
// Props 타입 정의
// =========================================================
interface PDFDownloadButtonProps {
  invoice: Invoice;
}

// =========================================================
// PDF 다운로드 버튼 컴포넌트
// - 파일명: 견적서번호.pdf
// - 로딩 중: "생성 중..." 텍스트 표시
// - shadcn/ui Button variant="outline" 스타일 적용
// =========================================================
export function PDFDownloadButton({ invoice }: PDFDownloadButtonProps) {
  // PDF 파일명 — 견적서 번호 기반
  const fileName = `${invoice.invoiceNumber}.pdf`;

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            // 생성 중 상태
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              생성 중...
            </>
          ) : (
            // 다운로드 준비 완료 상태
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              PDF 다운로드
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}
