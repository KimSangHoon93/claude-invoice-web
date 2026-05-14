// 관리자 경로(/admin/*) 접근 제어 프록시 (Next.js 16 proxy 컨벤션)
// ADMIN_PASSWORD 환경 변수 기반 HTTP Basic Auth 검증
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Authorization 헤더 파싱
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    // "Basic <base64>" 형태에서 자격증명 추출
    const base64 = authHeader.split(" ")[1] ?? "";
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const [, password] = decoded.split(":");

    const adminPassword = process.env.ADMIN_PASSWORD;

    // 비밀번호 일치 시 통과
    if (adminPassword && password === adminPassword) {
      return NextResponse.next();
    }
  }

  // 인증 실패 → WWW-Authenticate 헤더와 함께 401 반환 (브라우저 기본 인증 대화상자 표시)
  return new NextResponse("관리자 인증이 필요합니다.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="InvoiceHub Admin"',
    },
  });
}

// /admin 및 하위 경로에만 프록시 적용
export const config = {
  matcher: ["/admin/:path*"],
};
