# InvoiceHub 개발 로드맵

> Notion DB 기반 청구서/견적서 관리 웹앱 — Notion "Invoices" 데이터베이스를 백엔드로 활용하여 견적서·청구서를 조회·검색·필터링하는 1인 사업자용 관리 도구
> PRD 참조: [docs/PRD.md](./PRD.md)
> 이전 로드맵(Phase 1~5 상세): [docs/roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md)

**시작일**: 2026-05-13
**최종 업데이트**: 2026-05-14
**진행 상황**: 22/25 Tasks 완료 (Phase 6 대기 중)
**프로덕션 URL**: https://claude-invoice-web.vercel.app

---

## 개요

**InvoiceHub**는 1인 사업자/프리랜서를 위한 **Notion 기반 견적서·청구서 관리 웹앱**으로 다음 기능을 제공합니다:

- **청구서 목록 조회 (F001)**: Notion "Invoices" DB의 견적서를 카드 형태로 표시
- **청구서 상세 조회 (F002)**: 견적서 메타 정보(클라이언트·금액·기간) + 항목(Items) 테이블 렌더링
- **상태 필터링 (F003)**: 대기/승인/거절 상태별로 견적서를 필터링
- **검색 기능 (F004)**: 클라이언트명/견적서 번호로 빠른 탐색
- **요약 통계 (F005)**: 전체 건수, 승인 금액, 대기 건수 대시보드 카드
- **Notion 자동 반영 (F010)**: ISR로 Notion에서 견적서 수정 시 자동 반영
- **관리자 뷰 (F020 — 신규)**: `/admin` 경로의 사이드바 기반 관리자 전용 레이아웃
- **공유 링크 복사 (F021 — 신규)**: 청구서 상세 URL을 클립보드로 1초 만에 복사
- **다크모드 (F022 — 신규)**: 시스템 테마 자동 감지 + 수동 토글

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `023-admin-layout.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 (Playwright MCP 시나리오 작성)**

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능 구현 진행
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시 (Task 제목, 세부 구현 사항 모두)
   - 완료된 Task에 `See: /tasks/XXX-xxx.md` 참조 추가

---

## 전체 일정 요약

| Phase | 내용 | Tasks | 상태 |
|-------|------|-------|------|
| Phase 1 | 프로젝트 기반 구축 (구조/타입/Mock) | 001~004 | ✅ 완료 |
| Phase 2 | UI 컴포넌트 라이브러리 및 페이지 | 005~009 | ✅ 완료 |
| Phase 3 | Notion API 실제 연동 (v5.x dataSources) | 010~012 | ✅ 완료 |
| Phase 4 | 부가 기능 (검색/필터/통계/SEO) | 013~019 | ✅ 완료 |
| Phase 5 | 성능 최적화 및 배포 | 020~022 | ✅ 완료 |
| **Phase 6** | **고도화 (관리자/공유/다크모드)** | **023~025** | **진행 예정** |
| **합계** | **25 Tasks** | — | **22/25 완료** |

---

## 개발 단계

### Phase 1: 프로젝트 기반 구축 ✅

> **목표**: Next.js 16 + TypeScript + TailwindCSS v4 + shadcn/ui 환경 구축, 청구서 도메인 타입과 Mock 레이어 선행 확립
> **완료일**: 2026-05-13 / **상세**: [roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md#phase-1-프로젝트-기반-구축-)

- ✅ **Task 001: 프로젝트 초기 설정 및 폴더 구조** — Next.js 16.2.6 + TypeScript 5 + TailwindCSS v4 + shadcn/ui(new-york) 초기화, `@/*` 경로 별칭, ESLint 9
- ✅ **Task 002: 라우트 골격 및 빈 페이지 생성** — `app/page.tsx`, `app/invoice/[id]/page.tsx`, `app/layout.tsx`, `not-found.tsx`
- ✅ **Task 003: 타입 정의 및 인터페이스 설계** — `Invoice`, `InvoiceItem`, `InvoiceStatus` 타입 + `notion.ts` 함수 시그니처
- ✅ **Task 004: 환경 변수 및 Mock 데이터 준비** — `.env.local.example`, `mocks/invoices.ts` 5건, Mock fallback 분기

---

### Phase 2: UI 컴포넌트 라이브러리 및 페이지 ✅

> **목표**: shadcn/ui 디자인 시스템 구축, 더미 데이터로 청구서 목록·상세 페이지 UI 완성
> **완료일**: 2026-05-13 / **상세**: [roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md#phase-2-ui-컴포넌트-라이브러리-및-페이지-)

- ✅ **Task 005: shadcn/ui 기본 컴포넌트 설치** — Button, Card, Badge, Input, Skeleton
- ✅ **Task 006: 레이아웃 컴포넌트 구현** — `Header`, `Footer` + 루트 레이아웃 통합
- ✅ **Task 007: 청구서 도메인 컴포넌트 구현** — `InvoiceCard`, `StatusBadge`, `StatusFilter`, `InvoiceTable`, `EmptyState`, `SearchBar`
- ✅ **Task 008: 홈 페이지 UI (Mock 데이터)** — 카드 그리드 + 발행일 내림차순 + 반응형(1/2/3열)
- ✅ **Task 009: 청구서 상세 페이지 UI (Mock 데이터)** — 메타 헤더 + 항목 테이블 + 404 처리

---

### Phase 3: Notion API 실제 연동 (v5.x dataSources) ✅

> **목표**: `@notionhq/client v5.21.0`의 `dataSources.query` API로 Invoices/Items DB 연동
> **완료일**: 2026-05-13 / **상세**: [roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md#phase-3-notion-api-실제-연동-v5x-datasources-)

- ✅ **Task 010: Notion API 클라이언트 구현 (v5.x)** — `dataSources.query` 어댑터 + 에러 핸들링 + Mock fallback
- ✅ **Task 011: 청구서 목록 — 실제 API 연동 (ISR 60초)** — 발행일 내림차순, 상태 필터 파라미터, Playwright MCP 테스트 통과
- ✅ **Task 012: 청구서 상세 — 실제 API 연동 + Items 관계 DB 조회** — `Promise.all` 병렬 조회, ISR 3600초, 단가×수량=금액 formula 검증

---

### Phase 4: 부가 기능 (검색/필터/통계/SEO) ✅

> **목표**: 검색·필터·통계·SEO로 실제 운영 가능한 수준까지 끌어올림
> **완료일**: 2026-05-13 / **상세**: [roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md#phase-4-부가-기능-검색필터통계seo-)

- ✅ **Task 013: 요약 통계 카드 (대시보드)** — 전체 건수 / 승인 금액 / 대기 건수
- ✅ **Task 014: 상태 필터 탭 (URL searchParam 기반)** — `?status=` URL 동기화, 새로고침 유지
- ✅ **Task 015: 검색 기능 (URL searchParam 기반)** — `?q=` 통합 검색, 상태 필터와 동시 적용
- ✅ **Task 016: SEO 메타데이터** — `generateMetadata()` + Open Graph
- ✅ **Task 017: sitemap.xml 자동 생성** — `app/sitemap.ts`에서 전체 청구서 URL 포함
- ✅ **Task 018: robots.txt 설정** — `app/robots.ts` 크롤링 허용
- ✅ **Task 019: ISR 캐싱 전략 적용** — 목록 60초 / 상세 3600초

---

### Phase 5: 성능 최적화 및 배포 ✅

> **목표**: Vercel 배포 + `generateStaticParams` 정적 사전 생성 + Core Web Vitals 검증
> **완료일**: 2026-05-14 / **상세**: [roadmaps/ROADMAP_v1.md](./roadmaps/ROADMAP_v1.md#phase-5-성능-최적화-및-배포-)

- ✅ **Task 020: 청구서 상세 정적 경로 사전 생성** — `generateStaticParams()` + `dynamicParams: true`
- ✅ **Task 021: Vercel 배포** — 프로덕션 URL `https://claude-invoice-web.vercel.app` + 환경 변수 설정
- ✅ **Task 022: Lighthouse 성능 검증 및 모바일 최종 검수** — LCP 716ms / CLS 0 / TTFB 8ms, 375/768/1280px 가로 스크롤 없음

---

### Phase 6: 고도화 (관리자/공유/다크모드)

> **목표**: MVP 운영 데이터(F001~F011)가 안정화된 위에 (1) 관리자 전용 뷰, (2) 외부 클라이언트 공유 워크플로우, (3) 다크모드 UX를 더해 실제 사업자 운영 시나리오에 필요한 편의 기능을 완비한다.
> **이 순서인 이유**:
> 1. **관리자 레이아웃**을 먼저 만들어 향후 추가될 관리 기능(견적서 생성·수정 등)의 기반 셸을 확보한다.
> 2. **공유 링크 복사**는 카드/상세 UI 양쪽을 모두 건드리므로, 관리자 뷰까지 컴포넌트 셋업이 끝난 뒤에 추가하면 일관되게 적용할 수 있다.
> 3. **다크모드**는 모든 컴포넌트에 `dark:` 스타일을 추가해야 하므로 가장 마지막에 일괄 작업하는 것이 효율적이다 (관리자 페이지 컴포넌트 포함).
>
> **예상 기간**: 1.5~2주 (Task당 3~5일)

#### - **Task 023: 관리자 레이아웃 (Admin Layout) 구축** - 우선순위

  - [ ] `src/app/admin/layout.tsx` — 관리자 전용 중첩 레이아웃 생성 (사이드바 + 콘텐츠 영역)
  - [ ] `src/app/admin/page.tsx` — 관리자 대시보드 진입 페이지 (`/admin`)
  - [ ] `src/app/admin/invoices/page.tsx` — 견적서 목록 관리자 뷰 (테이블 형식, 카드 그리드와 분리)
  - [ ] `src/components/admin/AdminSidebar.tsx` — shadcn/ui 기반 사이드바 (대시보드 / 견적서 관리 / 설정 메뉴)
  - [ ] `src/components/admin/AdminInvoiceTable.tsx` — 견적서 번호 / 클라이언트 / 금액 / 상태 / 발행일 / 액션 컬럼
  - [ ] shadcn/ui 컴포넌트 추가 설치 — `table`, `dialog`, `sheet`(모바일 사이드바)
  - [ ] **접근 제어**: `src/middleware.ts` — 환경 변수 `ADMIN_PASSWORD` 기반 Basic Auth 또는 `?key=` 쿼리 검증
  - [ ] `.env.local.example`에 `ADMIN_PASSWORD` 추가
  - [ ] 모바일 반응형 — 사이드바를 `Sheet`(드로어)로 전환
  - [ ] **테스트 체크리스트** (Playwright MCP):
    - [ ] `/admin` 접근 시 인증 없으면 401 또는 로그인 화면으로 리다이렉트
    - [ ] 올바른 비밀번호 입력 후 사이드바 + 견적서 테이블 정상 렌더링
    - [ ] 견적서 테이블에서 행 클릭 시 `/invoice/[id]` 상세 페이지로 이동
    - [ ] 모바일(375px) 뷰포트에서 사이드바가 `Sheet` 드로어로 전환되는지 확인
    - [ ] 잘못된 비밀번호 입력 시 접근 차단 확인

#### - **Task 024: 클라이언트 공유 링크 복사 기능**

  - [ ] `src/components/invoice/ShareLinkButton.tsx` — Clipboard API 기반 공유 버튼 클라이언트 컴포넌트 (`'use client'`)
  - [ ] `navigator.clipboard.writeText()`로 청구서 상세 URL 복사 (절대 URL 생성)
  - [ ] `NEXT_PUBLIC_BASE_URL` 환경 변수로 절대 URL 베이스 구성 (`${BASE}/invoice/${id}`)
  - [ ] shadcn/ui `sonner`(Toast) 또는 인라인 아이콘 상태 변화 (Copy → Check 2초 후 복귀)
  - [ ] `InvoiceCard`에 작은 아이콘 버튼으로 통합 (카드 우측 상단)
  - [ ] `invoice/[id]/page.tsx` 상세 헤더 액션 영역에 텍스트 라벨 포함 버튼으로 통합 ("링크 복사")
  - [ ] Clipboard API 미지원 환경 fallback — `document.execCommand('copy')` 또는 사용자 수동 복사용 input 표시
  - [ ] `.env.local.example`에 `NEXT_PUBLIC_BASE_URL` 추가 (예: `https://claude-invoice-web.vercel.app`)
  - [ ] **테스트 체크리스트** (Playwright MCP):
    - [ ] 홈 페이지 청구서 카드의 공유 버튼 클릭 시 클립보드에 절대 URL이 복사되는가 (`browser_evaluate`로 `navigator.clipboard.readText()` 검증)
    - [ ] 복사 완료 후 아이콘이 Check로 변경되고 2초 후 Copy로 복귀하는가
    - [ ] 청구서 상세 페이지 상단의 "링크 복사" 버튼이 정상 동작하는가
    - [ ] 복사된 URL을 새 탭에서 열었을 때 동일한 청구서 상세 페이지가 표시되는가
    - [ ] Toast 알림이 표시되고 일정 시간 후 자동 사라지는가

#### - **Task 025: 다크모드 지원 (next-themes 통합)**

  - [ ] `next-themes` 패키지 설치 (`npm install next-themes`)
  - [ ] `src/components/theme/ThemeProvider.tsx` — `next-themes`의 `ThemeProvider` 래퍼 (클라이언트 컴포넌트)
  - [ ] 설정: `attribute="class"`, `defaultTheme="system"`, `enableSystem={true}`, `disableTransitionOnChange`
  - [ ] `src/app/layout.tsx`에서 `<html lang="ko" suppressHydrationWarning>`로 변경 + `ThemeProvider` 래핑
  - [ ] `src/components/theme/ThemeToggle.tsx` — Sun/Moon 아이콘 토글 버튼 (Lucide React, shadcn/ui `Button` variant="ghost")
  - [ ] `Header`에 `ThemeToggle` 우측 배치 (모바일에서도 표시)
  - [ ] TailwindCSS v4 다크모드 클래스 적용 — 모든 기존 컴포넌트에 `dark:` 변형 추가:
    - [ ] `InvoiceCard` — 배경/보더/텍스트 다크 톤
    - [ ] `StatusBadge` — 대기/승인/거절 색상의 다크모드 대비
    - [ ] `StatusFilter` — 활성 탭 다크 대비
    - [ ] `InvoiceTable` — 헤더/행/합계 행 다크 톤
    - [ ] `EmptyState` — 일러스트/텍스트 다크 톤
    - [ ] `SearchBar` — 입력 필드 다크 톤
    - [ ] `Header` / `Footer` — 배경/링크 다크 톤
    - [ ] `AdminSidebar` / `AdminInvoiceTable` (Task 023 결과물) 다크 톤
    - [ ] 통계 카드 3종 다크 톤
  - [ ] `globals.css`의 CSS 변수에 `:root` / `.dark` 색상 토큰 정의 (shadcn/ui new-york 다크 팔레트 차용)
  - [ ] hydration mismatch 방지 — `ThemeToggle`에서 `mounted` 가드 패턴 사용
  - [ ] **테스트 체크리스트** (Playwright MCP):
    - [ ] 토글 버튼 클릭 시 `html` 태그에 `class="dark"`가 추가/제거되는가 (`browser_evaluate`로 확인)
    - [ ] 다크 테마에서 모든 텍스트가 배경 대비 가독성 충족 (시각적 회귀 — 스크린샷)
    - [ ] 시스템 다크모드 감지 — `prefers-color-scheme: dark` 에뮬레이션 시 자동 다크 적용
    - [ ] 새로고침 후에도 사용자 선택 테마 유지 (`localStorage` 기반 — `next-themes` 기본 동작)
    - [ ] 라이트 → 다크 전환 시 깜빡임/하이드레이션 불일치 없음 (콘솔 에러 0)
    - [ ] 모바일 / 태블릿 / 데스크톱 뷰포트 모두에서 다크 테마 정상 표시
    - [ ] 관리자(`/admin`) 페이지에서도 다크 테마 일관 적용 확인

---

## 완료 기준 체크리스트

### MVP 기능 완료 기준 (Phase 1~5)

- [x] **F001** — 홈 페이지에서 Notion 청구서 목록이 카드 형태로 표시됨
- [x] **F002** — 청구서 카드 클릭 시 상세 페이지에서 메타 정보 + 항목 테이블이 렌더링됨
- [x] **F003** — 상태 필터(대기/승인/거절)로 해당 상태 청구서만 목록에 표시됨
- [x] **F004** — 검색어로 클라이언트명/견적서 번호 기반 필터링됨
- [x] **F005** — 홈 상단에 전체 건수 / 승인 금액 / 대기 건수 통계 카드 표시
- [x] **F010** — Notion `dataSources.query` API로 실제 데이터가 화면에 반영됨
- [x] **F011** — 모바일/태블릿/데스크톱에서 레이아웃이 정상 표시됨

### 배포 완료 기준 (Phase 5)

- [x] `generateStaticParams`로 청구서 상세 정적 사전 생성
- [x] Vercel 배포 URL에서 전체 기능 정상 동작 (Playwright MCP 프로덕션 검증 — 2026-05-14)
- [x] Core Web Vitals 우수 (LCP 716ms / CLS 0 — Good 기준 충족)
- [x] 모바일 최종 검증 통과 (375/768/1280px 가로 스크롤 없음)

### 고도화 완료 기준 (Phase 6)

- [ ] **F020** — `/admin` 경로의 사이드바 기반 관리자 레이아웃이 정상 동작하고 환경 변수 기반 접근 제어가 적용됨
- [ ] **F021** — 청구서 카드/상세 페이지의 "링크 복사" 버튼이 절대 URL을 클립보드에 복사하고 Toast 피드백 표시
- [ ] **F022** — 시스템 테마 자동 감지 + 헤더 토글로 라이트/다크 전환, 모든 컴포넌트에 `dark:` 스타일 적용
- [ ] Phase 6 전체 Playwright MCP E2E 테스트 통과

---

## Notion 데이터베이스 구조

### Invoices DB
**data_source_id**: `35914000-a270-80f6-b2e6-000ba09baf57`

| 필드 | Notion 타입 | 설명 |
|------|-------------|------|
| 견적서 번호 | title | 청구서 식별 번호 |
| 클라이언트명 | rich_text | 발주 클라이언트 이름 |
| 총금액 | number | 청구 총액 |
| 상태 | status | 대기 / 거절 / 승인 |
| 발행일 | date | 청구서 발행 날짜 |
| 유효기간 | date | 견적 유효 만료일 |
| 항목 | relation | Items DB 연관 항목 |

### Items DB
**data_source_id**: `35914000-a270-809c-988d-000b9376c176`

| 필드 | Notion 타입 | 설명 |
|------|-------------|------|
| 항목명 | title | 제품/서비스명 |
| 단가 | number | 단위 가격 |
| 수량 | number | 주문 수량 |
| 금액 | formula | 단가 × 수량 |

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16.2.6 (App Router) |
| Runtime | React 19.2.4 + TypeScript 5 |
| Styling | TailwindCSS v4 (`@import "tailwindcss"`, 설정 파일 없음) |
| UI | shadcn/ui (new-york) + Lucide React |
| CMS | @notionhq/client v5.21.0 |
| 배포 | Vercel |
| Phase 6 추가 | `next-themes` (다크모드), shadcn/ui `sonner`·`sheet`·`dialog`·`table` |

### `@notionhq/client v5.x` 마이그레이션 주의

| 기존 (v4.x) | 신규 (v5.21.0) |
|-------------|----------------|
| `notion.databases.query({ database_id })` | `notion.dataSources.query({ data_source_id })` |
| `database_id` 단일 사용 | `database_id` + `data_source_id` 분리 |

- 환경 변수에 **`NOTION_DATABASE_ID`(DB ID)와 `NOTION_INVOICES_SOURCE_ID`(data source ID)를 별도로 관리**해야 합니다.
- v5.x는 다중 데이터 소스(multi-source) DB를 지원하기 위해 도입된 변경이며, 단일 소스 DB의 경우 첫 번째 `data_source`의 `id`를 사용합니다.

---

**최종 업데이트**: 2026-05-14
**진행 상황**: 22/25 Tasks 완료 (Phase 6 대기 중) — 프로덕션 배포 완료 (https://claude-invoice-web.vercel.app)
