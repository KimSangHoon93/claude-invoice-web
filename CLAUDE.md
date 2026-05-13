# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트 개요

**InvoiceHub — Notion 기반 청구서 관리 웹앱** — Notion "Invoices" 데이터베이스를 백엔드로 활용하여 견적서·청구서를 조회·검색·필터링하는 1인 사업자/프리랜서용 관리 도구.

- PRD: `docs/PRD.md`
- 개발 로드맵: `docs/ROADMAP.md`

## 기술 스택

- **Framework**: Next.js 16.2.6 (App Router)
- **Runtime**: React 19.2.4 + TypeScript 5
- **Styling**: TailwindCSS v4 — `@import "tailwindcss"` 방식 (설정 파일 없음)
- **UI**: shadcn/ui (new-york 스타일) + Lucide React
- **CMS**: @notionhq/client v5.21.0 + notion-to-md (설치 완료)

## 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 9 실행
```

## 경로 별칭

`@/*` → `./src/*` (tsconfig.json paths 설정)

## Next.js 버전 주의사항

Next.js 16.x는 훈련 데이터와 다른 breaking change가 포함되어 있을 수 있습니다.
코드 작성 전 `node_modules/next/dist/` 내부 소스를 확인하세요.

## @notionhq/client v5.x 주의사항

v5.x에서 API 구조가 크게 변경되었습니다.

| 기존 (v4.x) | 현재 (v5.21.0) |
|-------------|----------------|
| `notion.databases.query({ database_id })` | `notion.dataSources.query({ data_source_id })` |
| `databases`에 `query` 메서드 존재 | `databases`에는 `retrieve`, `create`, `update`만 존재 |

- `NOTION_DATABASE_ID`(DB 뷰 ID)와 `NOTION_INVOICES_SOURCE_ID`(실제 data source ID)를 **별도 환경 변수**로 관리합니다.
- `databases.retrieve()` 응답의 `data_sources[].id`가 실제 쿼리에 필요한 ID입니다.

## 아키텍처

```
src/
  app/
    page.tsx                      # 홈 (청구서 목록, 통계 카드, 상태 필터, 검색)
    invoice/[id]/page.tsx         # 청구서 상세 (메타 정보 + 항목 테이블)
    layout.tsx                    # 루트 레이아웃 (Header/Footer + 메타데이터)
    sitemap.ts                    # 전체 청구서 URL 동적 생성
    robots.ts                     # 크롤링 허용 설정
    globals.css                   # 전역 스타일 (TailwindCSS v4)
  components/
    layout/                       # Header, Footer
    invoice/                      # InvoiceCard, StatusBadge, StatusFilter,
    │                             #   InvoiceTable, EmptyState, SearchBar
    ui/                           # shadcn/ui 컴포넌트 (Button, Card, Badge, Input, Skeleton)
  lib/
    notion.ts                     # Notion API 함수 + 유틸 (fetchInvoices, fetchInvoiceById,
    │                             #   searchInvoices, filterByStatus, formatAmount 등)
    utils.ts                      # shadcn/ui용 cn() 유틸
  types/
    invoice.ts                    # Invoice, InvoiceItem, InvoiceStatus 타입 정의
  mocks/
    invoices.ts                   # 더미 Invoice 데이터 5건 (환경 변수 미설정 시 fallback)
```

## 데이터 레이어 규칙

- `src/lib/notion.ts`의 함수들은 `NOTION_API_KEY` 또는 `NOTION_INVOICES_SOURCE_ID` 미설정 시 `src/mocks/invoices.ts`의 더미 데이터를 반환합니다.
- 모든 페이지는 SSG + ISR(`revalidate`) 적용. 목록 60초, 상세 3600초.
- 상태 필터·검색은 서버 컴포넌트에서 URL `searchParams`로 처리합니다 (`?status=대기&q=ABC`).

## Notion 데이터베이스 스키마

### Invoices DB
`data_source_id`: `NOTION_INVOICES_SOURCE_ID` 환경 변수

| 필드 | Notion 타입 | 설명 |
|------|------------|------|
| 견적서 번호 | title | 청구서 식별 번호 |
| 클라이언트명 | rich_text | 발주처 이름 |
| 총금액 | number | 청구 총액 |
| 상태 | status | 대기 / 거절 / 승인 |
| 방행일 | date | 청구서 발행일 |
| 유효기간 | date | 견적 유효 만료일 |
| 항목 | relation | Items DB 연관 항목 |

### Items DB
`data_source_id`: `NOTION_ITEMS_SOURCE_ID` 환경 변수

| 필드 | Notion 타입 | 설명 |
|------|------------|------|
| 항목명 | title | 제품/서비스명 |
| 단가 | number | 단위 가격 |
| 수량 | number | 주문 수량 |
| 금액 | formula | 단가 × 수량 |

## 커스텀 에이전트

`.claude/agents/` 에 등록된 전문 에이전트:

| 에이전트 | 용도 |
|---------|------|
| `nextjs-app-developer` | Next.js App Router 페이지/라우팅 구현 |
| `ui-markup-specialist` | shadcn/ui 기반 정적 마크업 및 스타일링 |
| `notion-api-database-expert` | Notion API 연동 및 쿼리 |
| `development-planner` | ROADMAP.md 생성 및 업데이트 |
| `prd-generator` | PRD 작성 |
| `prd-validator` | PRD 기술 검증 |
| `code-reviewer` | 코드 리뷰 (한국어) |
| `starter-cleaner` | Next.js 스타터킷 보일러플레이트 제거 |

## 커스텀 커맨드

`.claude/commands/` 에 등록된 슬래시 커맨드:

| 커맨드 | 용도 |
|--------|------|
| `/update-roadmap` | `docs/ROADMAP.md`에서 완료 Task 체크 및 진행 상황 업데이트 |
| `/branch` | feature/기능명 형식 브랜치 생성 |
| `/commit` | 이모지 + 컨벤셔널 커밋 메시지 생성 |
| `/merge` | 브랜치 안전 병합 |
| `/pr` | GitHub PR 생성 |

## MCP 도구

`.claude/settings.json`에 허용된 MCP 서버:

- **mcp__shadcn**: shadcn/ui 컴포넌트 검색 및 설치 명령 조회
- **mcp__playwright**: E2E 테스트 및 브라우저 자동화 (API 연동 검증 필수)
- **mcp__shrimp-task-manager**: 복잡한 작업 분해 및 추적

API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트를 수행합니다.
