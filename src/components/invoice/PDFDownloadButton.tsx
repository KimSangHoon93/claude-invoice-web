// PDF 다운로드 버튼 — 클라이언트 전용 컴포넌트
// PDFDownloadLink는 <a> 태그를 렌더링하므로 내부에 <button>을 중첩하면
// 브라우저가 download 속성의 파일명을 무시하고 blob UUID를 사용함
// → PDFDownloadLink 자체에 버튼 스타일을 적용하는 방식으로 수정
"use client";

import dynamic from "next/dynamic";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import type { Invoice } from "@/types/invoice";
import { InvoicePDF } from "./InvoicePDF";

// PDFDownloadLink가 실제로 지원하는 props (className·style 포함)
type PDFLinkProps = {
  document: ReactNode;
  fileName?: string;
  className?: string;
  style?: CSSProperties;
  children: (params: { loading: boolean; blob: Blob | null; url: string | null; error: Error | null }) => ReactNode;
};

// PDFDownloadLink를 SSR 없이 동적 로드
const PDFDownloadLink = dynamic(
  () =>
    import("@react-pdf/renderer").then(
      (mod) => mod.PDFDownloadLink as unknown as ComponentType<PDFLinkProps>
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-50 shadow-xs">
        생성 중...
      </span>
    ),
  }
) as ComponentType<PDFLinkProps>;

interface PDFDownloadButtonProps {
  invoice: Invoice;
}

// PDFDownloadLink(<a>) 자체에 버튼 스타일을 적용해 파일명이 올바르게 동작하도록 함
const linkClass =
  "inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function PDFDownloadButton({ invoice }: PDFDownloadButtonProps) {
  const fileName = `${invoice.invoiceNumber}.pdf`;

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={fileName}
      className={linkClass}
      style={{ textDecoration: "none" }}
    >
      {({ loading }: { loading: boolean }) =>
        loading ? (
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
        )
      }
    </PDFDownloadLink>
  );
}
