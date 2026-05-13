// 푸터 컴포넌트 — 저작권 표시
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          {/* 저작권 */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} InvoiceHub. All rights reserved.
          </p>

          {/* 부가 정보 */}
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-medium text-foreground">Next.js</span>
            {" & "}
            <span className="font-medium text-foreground">Notion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
