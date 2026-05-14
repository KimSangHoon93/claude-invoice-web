// 관리자 설정 페이지 — 환경 변수 및 앱 설정 확인 (읽기 전용)
import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "설정 — InvoiceHub Admin",
};

export default function AdminSettingsPage() {
  // 현재 환경 설정 값 (민감 정보는 마스킹)
  const notionConfigured =
    !!process.env.NOTION_API_KEY && !!process.env.NOTION_INVOICES_SOURCE_ID;

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            설정
          </h1>
          <p className="text-sm text-muted-foreground">
            앱 연동 및 환경 설정 상태를 확인합니다.
          </p>
        </div>
      </div>

      {/* Notion 연동 상태 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notion 연동 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted-foreground">API 키</dt>
              <dd className="text-sm font-medium">
                {process.env.NOTION_API_KEY
                  ? `••••${process.env.NOTION_API_KEY.slice(-4)}`
                  : (
                    <span className="text-destructive">미설정</span>
                  )}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted-foreground">데이터베이스 연동</dt>
              <dd className="text-sm font-medium">
                {notionConfigured ? (
                  <span className="text-green-600 dark:text-green-400">정상</span>
                ) : (
                  <span className="text-destructive">연동 필요</span>
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Items DB</dt>
              <dd className="text-sm font-medium">
                {process.env.NOTION_ITEMS_SOURCE_ID ? (
                  <span className="text-green-600 dark:text-green-400">설정됨</span>
                ) : (
                  <span className="text-destructive">미설정</span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 앱 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">앱 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <dt className="text-sm text-muted-foreground">버전</dt>
              <dd className="text-sm font-medium">0.1.0</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">기본 URL</dt>
              <dd className="text-sm font-medium font-mono">
                {process.env.NEXT_PUBLIC_BASE_URL ?? "미설정"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
