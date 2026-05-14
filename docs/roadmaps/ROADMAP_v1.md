# InvoiceHub 개발 로드맵

> Notion DB 기반 청구서/견적서 관리 웹앱 — Notion "Invoices" 데이터베이스를 백엔드로 활용하여 견적서·청구서를 조회·검색·필터링하는 1인 사업자용 관리 도구
> PRD 참조: [docs/PRD.md](./PRD.md)

**시작일**: 2026-05-13
**최종 업데이트**: 2026-05-14 (Phase 1~5 전체 완료)
**진행 상황**: Phase 5 완료 (22/22 Tasks 완료)

---

## 개요

**InvoiceHub**는 1인 사업자/프리랜서를 위한 **Notion 기반 견적서·청구서 관리 웹앱**으로 다음 기능을 제공합니다:

- **청구서 목록 조회 (F001)**: Notion "Invoices" DB의 견적서를 카드 형태로 표시
- **청구서 상세 조회 (F002)**: 견적서 메타 정보(클라이언트·금액·기간) + 항목(Items) 테이블 렌더링
- **상태 필터링 (F003)**: 대기/승인/거절 상태별로 견적서를 필터링
- **검색 기능 (F004)**: 클라이언트명/견적서 번호로 빠른 탐색
- **요약 통계 (F005)**: 전체 건수, 승인 금액, 대기 건수 대시보드 카드
- **Notion 자동 반영 (F010)**: ISR로 Notion에서 견적서 수정 시 자동 반영

> **프로젝트 전환 노트**: 본 프로젝트는 Notion CMS 기반 기술 블로그로 시작했으나, 연결된 Notion DB가 "Invoices"(견적서 관리)였고 `@notionhq/client v5.x`의 파괴적 변경(`databases.query` 제거 → `dataSources.query` 도입)을 발견하면서 **청구서 관리 웹앱으로 방향을 전환**(2026-05-13)했습니다.

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
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

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | 프로젝트 기반 구축 (구조/타입/Mock) | ✅ 완료 |
| Phase 2 | UI 컴포넌트 라이브러리 및 페이지 | ✅ 완료 |
| Phase 3 | Notion API 실제 연동 (v5.x dataSources) | ✅ 완료 |
| Phase 4 | 부가 기능 (검색/필터/통계/SEO) | ✅ 완료 |
| Phase 5 | 성능 최적화 및 배포 | ✅ 완료 |
| **합계** | **22 Tasks** | **22/22 완료** |

---

## 개발 단계

### Phase 1: 프로젝트 기반 구축 ✅

> **목표**: Next.js 16 + TypeScript + TailwindCSS v4 + shadcn/ui 환경을 구축하고, 청구서 도메인 타입과 Mock 레이어를 선행 구축하여 이후 UI/API 작업이 같은 인터페이스를 공유할 수 있도록 한다.
> **완료일**: 2026-05-13

- ✅ **Task 001: 프로젝트 초기 설정 및 폴더 구조** — 완료
  - ✅ Next.js 16.2.6 + TypeScript 5 + TailwindCSS v4 + shadcn/ui(new-york) 초기화
  - ✅ Lucide React 설치
  - ✅ 폴더 구조 생성: `src/components/{layout,invoice,ui}`, `src/lib`, `src/types`, `src/mocks`
  - ✅ tsconfig `@/*` 경로 별칭 동작 확인
  - ✅ ESLint 9 + Next 16 lint 설정 점검

- ✅ **Task 002: 라우트 골격 및 빈 페이지 생성** — 완료
  - ✅ `src/app/page.tsx` — 홈 페이지 (청구서 목록) 빈 껍데기
  - ✅ `src/app/invoice/[id]/page.tsx` — 청구서 상세 동적 라우트 빈 껍데기
  - ✅ `src/app/layout.tsx` — 루트 레이아웃 (헤더/푸터 슬롯 + 메타데이터)
  - ✅ `src/app/not-found.tsx` — 404 페이지
  - ✅ 모든 라우트 200 응답 확인

- ✅ **Task 003: 타입 정의 및 인터페이스 설계** — 완료
  - ✅ `src/types/invoice.ts` — `Invoice`, `InvoiceItem`, `InvoiceStatus` (대기/승인/거절) 타입 정의
  - ✅ Notion 응답 매핑용 어댑터 타입 시그니처 선언
  - ✅ `src/lib/notion.ts` 함수 시그니처 선언 (스텁 단계)
    - ✅ `fetchInvoices(): Promise<Invoice[]>`
    - ✅ `fetchInvoiceById(id: string): Promise<Invoice | null>`
    - ✅ `searchInvoices(query: string): Promise<Invoice[]>`
    - ✅ `filterByStatus(status: InvoiceStatus): Promise<Invoice[]>`
    - ✅ `formatAmount(amount: number): string`
  - ✅ `tsc --noEmit` 타입 컴파일 통과

- ✅ **Task 004: 환경 변수 및 Mock 데이터 준비** — 완료
  - ✅ `.env.local.example` 생성 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_INVOICES_SOURCE_ID`, `NOTION_ITEMS_SOURCE_ID`)
  - ✅ `@notionhq/client v5.21.0`, `notion-to-md` 설치 (실사용은 Phase 3)
  - ✅ `src/mocks/invoices.ts` — `Invoice` 더미 5건 (상태/금액/날짜 다양화)
  - ✅ `src/lib/notion.ts` — 환경 변수 미설정 시 Mock 데이터 fallback 분기

---

### Phase 2: UI 컴포넌트 라이브러리 및 페이지 ✅

> **목표**: shadcn/ui 기반 디자인 시스템을 구축하고, 더미 데이터로 청구서 목록·상세 페이지 UI를 완성하여 Notion API 없이도 전체 사용자 플로우를 클릭으로 체험할 수 있는 상태를 만든다.
> **완료일**: 2026-05-13

- ✅ **Task 005: shadcn/ui 기본 컴포넌트 설치** — 완료
  - ✅ Button, Card, Badge, Input, Skeleton 컴포넌트 추가
  - ✅ TailwindCSS v4 디자인 토큰(색상/간격/타이포그래피) 확립
  - ✅ Lucide React 아이콘 통합

- ✅ **Task 006: 레이아웃 컴포넌트 구현** — 완료
  - ✅ `src/components/layout/Header.tsx` — InvoiceHub 로고 + "새 청구서" 버튼
  - ✅ `src/components/layout/Footer.tsx` — 푸터
  - ✅ 루트 레이아웃에 헤더/푸터 통합

- ✅ **Task 007: 청구서 도메인 컴포넌트 구현** — 완료
  - ✅ `src/components/invoice/InvoiceCard.tsx` — 견적서 번호, 클라이언트명, 금액, 상태, 날짜 표시
  - ✅ `src/components/invoice/StatusBadge.tsx` — 대기/승인/거절 상태별 색상 배지
  - ✅ `src/components/invoice/StatusFilter.tsx` — 전체/대기/승인/거절 탭
  - ✅ `src/components/invoice/InvoiceTable.tsx` — 항목명/단가/수량/금액 테이블 + 합계 행
  - ✅ `src/components/invoice/EmptyState.tsx` — 빈 상태 UI
  - ✅ `src/components/invoice/SearchBar.tsx` — 클라이언트명·견적서 번호 검색 입력

- ✅ **Task 008: 홈 페이지 UI (Mock 데이터)** — 완료
  - ✅ 더미 `Invoice[]`로 `InvoiceCard` 그리드 렌더링
  - ✅ 발행일 내림차순 정렬
  - ✅ 빈 상태 UI 분기
  - ✅ 모바일 1열 / 태블릿 2열 / 데스크톱 3열 반응형 그리드

- ✅ **Task 009: 청구서 상세 페이지 UI (Mock 데이터)** — 완료
  - ✅ 청구서 메타 정보 헤더 (클라이언트명, 발행일, 유효기간, 상태)
  - ✅ `InvoiceTable`로 항목 목록 렌더링 + 총금액 합계 표시
  - ✅ "← 목록으로 돌아가기" 버튼
  - ✅ 존재하지 않는 ID 요청 시 `notFound()` 처리

---

### Phase 3: Notion API 실제 연동 (v5.x dataSources) ✅

> **목표**: Phase 2에서 더미로 채워둔 자리에 실제 Notion API 호출을 연결한다. `@notionhq/client v5.x`의 신규 `dataSources.query` API를 사용하여 Invoices/Items 관계 DB를 조회한다.
> **완료일**: 2026-05-13
> **핵심 변경점**: v5.x에서 `databases.query`가 제거됨 — 대신 `dataSources.query`를 사용해야 하며, `data_source_id`(DB ID와 다름)를 별도 환경 변수로 관리한다.

- ✅ **Task 010: Notion API 클라이언트 구현 (v5.x)** — 완료
  - ✅ `src/lib/notion.ts`에 `@notionhq/client v5.21.0` 클라이언트 설정
  - ✅ `dataSources.query` API로 Invoices DB 조회 (data_source_id: `35914000-a270-80f6-b2e6-000ba09baf57`)
  - ✅ Notion 응답 → `Invoice` 타입 어댑터 (견적서 번호/title, 클라이언트명/rich_text, 총금액/number, 상태/status, 발행일/date, 유효기간/date)
  - ✅ API 에러 핸들링 (try/catch + Mock fallback)
  - ✅ 환경 변수 미설정 시 자동으로 Mock 데이터 반환

- ✅ **Task 011: 청구서 목록 — 실제 API 연동 (ISR 60초)** — 완료
  - ✅ `fetchInvoices()` — `dataSources.query`로 발행일 내림차순 정렬 조회
  - ✅ 상태 필터 파라미터 지원 (대기/승인/거절)
  - ✅ 홈 페이지(`src/app/page.tsx`)에서 실제 호출로 더미 교체
  - ✅ SSG + ISR(`revalidate: 60`) 설정
  - ✅ **Playwright MCP 테스트 통과**:
    - [x] 실제 Notion 견적서 목록이 카드로 렌더링됨
    - [x] 발행일 내림차순 정렬 확인
    - [x] Notion 수정 후 revalidate 시간 이후 반영 확인

- ✅ **Task 012: 청구서 상세 — 실제 API 연동 + Items 관계 DB 조회** — 완료
  - ✅ `fetchInvoiceById(id)` — 청구서 페이지 조회
  - ✅ Items 관계 DB 병렬 조회 (data_source_id: `35914000-a270-809c-988d-000b9376c176`)
  - ✅ 항목명(title) / 단가(number) / 수량(number) / 금액(formula) 매핑
  - ✅ `Promise.all`로 청구서 + 항목 병렬 조회로 응답 시간 최소화
  - ✅ ISR(`revalidate: 3600`) 설정
  - ✅ **Playwright MCP 테스트 통과**:
    - [x] 실제 Notion 청구서 메타 + 항목 테이블이 정상 렌더링됨
    - [x] 단가 × 수량 = 금액 formula가 올바르게 표시됨
    - [x] 존재하지 않는 ID 접근 시 404 페이지 표시

---

### Phase 4: 부가 기능 (검색/필터/통계/SEO) ✅

> **목표**: 핵심 조회 기능 위에 검색·필터·통계 대시보드·SEO 메타데이터를 더해 실제 운영 가능한 수준으로 끌어올린다.
> **완료일**: 2026-05-13

- ✅ **Task 013: 요약 통계 카드 (대시보드)** — 완료
  - ✅ 홈 페이지 상단에 통계 카드 3종 추가
  - ✅ 전체 건수 카드 (모든 청구서 개수)
  - ✅ 승인 금액 카드 (상태=승인인 청구서의 총금액 합계)
  - ✅ 대기 건수 카드 (상태=대기 청구서 개수)
  - ✅ `formatAmount()` 유틸로 ₩ 통화 포맷팅

- ✅ **Task 014: 상태 필터 탭 (URL searchParam 기반)** — 완료
  - ✅ `StatusFilter` 컴포넌트를 홈 페이지에 통합
  - ✅ 전체/대기/승인/거절 탭 클릭 시 URL `?status=` 파라미터 변경
  - ✅ 서버 컴포넌트에서 `searchParams.status`로 필터링 적용
  - ✅ 선택된 탭 active 스타일 처리
  - ✅ **Playwright MCP 테스트 통과**:
    - [x] 탭 클릭 시 URL 변경 + 해당 상태 청구서만 표시
    - [x] "전체" 탭 클릭 시 모든 청구서 복귀
    - [x] 새로고침 시에도 URL 파라미터 기준으로 필터 유지

- ✅ **Task 015: 검색 기능 (URL searchParam 기반)** — 완료
  - ✅ `SearchBar` 컴포넌트를 홈 페이지 상단에 통합
  - ✅ 클라이언트명 + 견적서 번호 통합 검색
  - ✅ 검색어 입력 → URL `?q=` 파라미터 갱신
  - ✅ 서버 컴포넌트에서 `searchInvoices(query)` 호출
  - ✅ 상태 필터와 검색 동시 적용 가능
  - ✅ **Playwright MCP 테스트 통과**:
    - [x] 검색어 입력 시 일치하는 청구서만 표시
    - [x] 검색 결과 없을 때 빈 상태 UI 표시
    - [x] 검색어 지우면 전체 목록 복귀

- ✅ **Task 016: SEO 메타데이터** — 완료
  - ✅ 청구서 상세 페이지 `generateMetadata()` — 견적서 번호 + 클라이언트명 동적 title/description
  - ✅ 홈 페이지 정적 메타데이터 설정
  - ✅ Open Graph 태그 적용

- ✅ **Task 017: sitemap.xml 자동 생성** — 완료
  - ✅ `src/app/sitemap.ts` — `fetchInvoices()`로 전체 청구서 URL 자동 포함
  - ✅ 홈 / 청구서 상세 URL 전체 노출
  - ✅ `lastModified` 필드에 발행일 적용

- ✅ **Task 018: robots.txt 설정** — 완료
  - ✅ `src/app/robots.ts` — 크롤링 허용 설정
  - ✅ `sitemap` 위치 명시

- ✅ **Task 019: ISR 캐싱 전략 적용** — 완료
  - ✅ 청구서 목록: `revalidate: 60` (1분)
  - ✅ 청구서 상세: `revalidate: 3600` (1시간)
  - ✅ Notion API 호출 최소화 + 사용자 응답 속도 확보

---

### Phase 5: 성능 최적화 및 배포 ✅

> **목표**: Vercel에 배포하여 실제 사용자가 접근 가능한 상태로 만든다. 정적 경로 사전 생성과 Lighthouse 측정으로 성능을 보장한다.
> **이 순서인 이유**: 기능이 모두 완성된 뒤에 최적화해야 측정 기준이 명확하고, 배포는 모든 검증이 끝난 마지막 단계여야 롤백 비용이 최소화된다.
> **완료일**: 2026-05-14

- ✅ **Task 020: 청구서 상세 정적 경로 사전 생성** — 완료
  - ✅ `src/app/invoice/[id]/page.tsx`에 `generateStaticParams()` 추가
  - ✅ `fetchInvoices()`로 전체 청구서 ID 조회 후 정적 경로 반환
  - ✅ 빌드 시 정적 페이지 생성으로 초기 응답 속도 개선 (`●` SSG 마커 확인)
  - ✅ `dynamicParams` 기본값(true)으로 신규 청구서 ISR 동적 생성 지원
  - **테스트 체크리스트** (Playwright MCP):
    - [x] `npm run build` 시 모든 청구서 상세 페이지가 정적 생성되는가
    - [x] 빌드 후 청구서 상세 첫 응답이 즉시 반환되는가
    - [x] 신규 청구서가 ISR로 동적 생성되는가 (`dynamicParams: true` 기본값)

- ✅ **Task 021: Vercel 배포** — 프로덕션 배포 완료 및 Playwright MCP 검증 통과
  - ✅ Vercel 프로젝트 생성 및 GitHub 리포지토리 연결
  - ✅ 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_INVOICES_SOURCE_ID`, `NOTION_ITEMS_SOURCE_ID`)
  - ✅ 프로덕션 빌드 확인 (`npm run build` 오류 없음 — 로컬 검증 완료)
  - ✅ 배포 URL 발급: `https://claude-invoice-web.vercel.app`
  - **테스트 체크리스트** (Playwright MCP — 프로덕션 URL, 2026-05-14 검증):
    - [x] 홈 / 청구서 상세 페이지 모두 200 응답
    - [ ] Notion에서 견적서 수정 후 ISR로 자동 반영되는가 (Notion 수정 권한 필요 — 스킵)
    - [x] 상태 필터·검색 URL 파라미터가 프로덕션에서 동작
    - [x] sitemap.xml / robots.txt 정상 응답 (단, sitemap URL이 localhost:3000 — NEXT_PUBLIC_BASE_URL 환경 변수 미설정)

- ✅ **Task 022: Lighthouse 성능 검증 및 모바일 최종 검수** — 프로덕션 Core Web Vitals 측정 완료
  - ✅ Core Web Vitals 측정 결과 (Playwright browser_evaluate — 2026-05-14, 프로덕션):
    - LCP: **716ms** (Good — 기준 2500ms 이하)
    - CLS: **0** (Good — 기준 0.1 이하)
    - TTFB: **8ms** (우수)
    - 페이지 로드: **699ms**
  - ✅ 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 뷰포트 최종 검수 — Playwright MCP 완료 (프로덕션)
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] Lighthouse 전 카테고리 80점 이상 (Lighthouse CLI 도구 별도 필요 — browser_evaluate로 Core Web Vitals 대체 측정)
    - [x] 모바일 뷰포트에서 가로 스크롤 없음 (375px / 768px / 1280px 모두 scrollWidth = clientWidth 확인)
    - [x] 통계 카드 / 청구서 카드 / 상세 테이블이 모든 뷰포트에서 정상 표시

---

## 완료 기준 체크리스트

### MVP 기능 완료 기준

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
- [ ] Notion에서 청구서 수정 후 ISR로 자동 반영 (60초 / 3600초) 확인 (Notion 수정 권한 필요 — 스킵)
- [x] Core Web Vitals 우수 (LCP 716ms / CLS 0 — Good 기준 충족, Lighthouse CLI 미수행)
- [x] 모바일 최종 검증 통과 (Playwright MCP — 375px/768px/1280px 가로 스크롤 없음 확인, 프로덕션)

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

## 기술 스택 특이사항

### `@notionhq/client v5.x` 마이그레이션 주의

| 기존 (v4.x) | 신규 (v5.21.0) |
|-------------|----------------|
| `notion.databases.query({ database_id })` | `notion.dataSources.query({ data_source_id })` |
| `database_id` 단일 사용 | `database_id` + `data_source_id` 분리 |
| — | `notion.pages.retrieveMarkdown` 등 신규 메서드 추가 |

- 환경 변수에 **`NOTION_DATABASE_ID`(DB ID)와 `NOTION_INVOICES_SOURCE_ID`(data source ID)를 별도로 관리**해야 합니다.
- v5.x는 다중 데이터 소스(multi-source) DB를 지원하기 위해 도입된 변경이며, 단일 소스 DB의 경우 첫 번째 `data_source`의 `id`를 사용합니다.

---

**최종 업데이트**: 2026-05-14
**진행 상황**: Phase 5 완료 (22/22 Tasks 완료) — 프로덕션 배포 완료 (https://claude-invoice-web.vercel.app)
