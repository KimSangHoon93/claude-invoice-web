# 개인 개발 블로그 개발 로드맵

> Notion CMS 기반 개인 기술 블로그 MVP — 글 작성 즉시 자동 반영되는 1인 개발자용 블로그
> PRD 참조: [docs/PRD.md](./PRD.md)

**시작일**: 2026-05-13
**최종 업데이트**: 2026-05-13 (Task 002, 003 완료)
**진행 상황**: Phase 1 진행 중 (3/19 Tasks 완료)

---

## 개요

**개인 개발 블로그**는 기술 블로그를 운영하는 1인 개발자를 위한 **Notion 기반 자동 발행 블로그**로 다음 기능을 제공합니다:

- **글 목록 조회 (F001)**: Notion DB의 발행된 글을 홈/카테고리 페이지에 카드 형태로 표시
- **글 상세 조회 (F002)**: Notion 페이지 본문을 Markdown으로 변환하여 렌더링
- **카테고리 필터링 (F003)**: 카테고리 단위로 글 목록을 필터링하여 탐색
- **검색 기능 (F004)**: 제목/태그 키워드로 글을 빠르게 탐색
- **Notion 자동 반영 (F010)**: ISR로 글 발행 시 블로그에 자동 반영

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
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조 (예: 현재 작업이 `012`라면 `011`과 `010`을 참조)
   - 초기 상태의 샘플로 `000-sample.md` 참조 (빈 박스, 변경 사항 요약 없음)

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능 구현 진행
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시 (Task 제목, 세부 구현 사항 모두)
   - 완료된 Task에 `See: /tasks/XXX-xxx.md` 참조 추가

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 | 상태 |
|-------|------|----------|------|
| Phase 1 | 애플리케이션 골격 구축 | 1-2일 | 대기 중 |
| Phase 2 | UI/UX 완성 (더미 데이터) | 2-3일 | 대기 중 |
| Phase 3 | Notion API 연동 및 핵심 기능 | 3-4일 | 대기 중 |
| Phase 4 | 부가 기능 (검색/SEO/필터) | 2-3일 | 대기 중 |
| Phase 5 | 성능 최적화 및 배포 | 1-2일 | 대기 중 |
| **합계** | | **9-14일** | |

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

> **목표**: 전체 라우트 구조, 빈 페이지 껍데기, 타입 정의, 환경 설정을 한 번에 완성하여 이후 UI/기능 작업이 충돌 없이 진행되도록 한다.
> **이 순서인 이유**: 라우트 구조와 타입은 모든 페이지/컴포넌트/API 함수의 전제 조건이다. 빈 페이지 껍데기를 먼저 만들어 두면 Phase 2의 UI팀과 Phase 3의 API팀이 같은 인터페이스를 공유한 채 병렬로 작업할 수 있다.
> **예상 기간**: 1-2일 | **완료 기준**: 모든 라우트(`/`, `/blog/[id]`, `/category/[slug]`)에 빈 페이지가 200 응답을 반환 + 타입 정의 컴파일 통과

- **Task 001: 프로젝트 구조 및 환경 설정** - 우선순위
  - 기존 `src/app/` 구조 확인 및 정리 (layout.tsx, page.tsx 점검)
  - tsconfig.json 경로 별칭(`@/*`) 동작 확인
  - ESLint + Prettier 설정 점검 (Husky/lint-staged 도입은 Phase 5로 연기)
  - shadcn/ui 초기화 (new-york 스타일) — `components.json` 생성
  - Lucide React 설치
  - 폴더 구조 사전 생성: `src/components/{layout,blog,ui}`, `src/lib`, `src/types`, `src/mocks`

- ✅ **Task 002: 라우트 골격 및 빈 페이지 생성** — See: /tasks/002-routes.md
  - ✅ `src/app/page.tsx` — 홈 페이지 빈 껍데기 ("홈 페이지" 텍스트만)
  - ✅ `src/app/blog/[id]/page.tsx` — 글 상세 동적 라우트 빈 껍데기
  - ✅ `src/app/category/[slug]/page.tsx` — 카테고리 동적 라우트 빈 껍데기
  - ✅ `src/app/layout.tsx` — 루트 레이아웃 (헤더/푸터 슬롯 + 메타데이터 기본)
  - ✅ `src/app/not-found.tsx` — 404 페이지 빈 껍데기
  - ✅ `npm run dev` 실행 후 3개 라우트가 모두 200 응답하는지 확인 (Playwright 검증)

- ✅ **Task 003: 타입 정의 및 인터페이스 설계** — See: /tasks/003-types.md
  - ✅ `src/types/notion.ts` — `BlogPost`, `BlockContent`, `Category`, `Tag` 타입 정의
  - ✅ Notion API 응답 래퍼 타입 (`NotionPage`, `NotionBlock`) 정의 (구현 X, 시그니처만)
  - ✅ `src/lib/notion.ts` 함수 시그니처 선언만 (스텁 throw — Phase 3에서 구현)
    - ✅ `fetchPosts(): Promise<BlogPost[]>`
    - ✅ `fetchPostById(id: string): Promise<BlogPost | null>`
    - ✅ `fetchPostContent(id: string): Promise<string>`
    - ✅ `fetchCategories(): Promise<Category[]>`
  - ✅ `tsc --noEmit`으로 타입 컴파일 통과 확인

- **Task 004: Notion 환경 변수 및 DB 스키마 준비**
  - `.env.local.example` 생성 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - `@notionhq/client`, `notion-to-md` 설치 (사용은 Phase 3)
  - Notion Integration 생성 및 API 키 발급
  - Notion 데이터베이스 생성 (Title, Category, Tags, Published, Status 필드)
  - 테스트 글 2-3개 작성 후 Status="발행됨"으로 설정
  - 데이터베이스에 Integration 연결 확인 (실제 호출은 Phase 3에서)

---

### Phase 2: UI/UX 완성 (더미 데이터 활용)

> **목표**: 모든 페이지의 UI를 더미 데이터만으로 완성하여, Notion API 없이도 전체 사용자 플로우를 클릭으로 체험할 수 있는 상태를 만든다.
> **이 순서인 이유**: 외부 API 의존을 분리하면 디자인/UX 검증이 빨라지고, Phase 3에서 더미를 실제 API로 교체할 때 UI 회귀 확률이 크게 줄어든다. 공통 컴포넌트를 먼저 완성한 뒤 페이지를 조립하면 중복 작업이 사라진다.
> **예상 기간**: 2-3일 | **완료 기준**: 더미 데이터로 홈 → 글 상세 → 카테고리 페이지 전체 플로우가 클릭으로 동작 + 모바일/데스크톱 반응형 확인

- **Task 005: 더미 데이터 및 Mock 레이어 구축** - 우선순위
  - `src/mocks/posts.ts` — `BlogPost` 더미 5-10개 (카테고리/태그/발행일 다양화)
  - `src/mocks/blocks.ts` — Markdown 형식 더미 본문 (paragraph/heading/code/image/list 포함)
  - `src/lib/notion.ts` 함수가 환경 변수 미설정 시 더미 반환하도록 분기 (Phase 3에서 실제 호출로 교체)
  - 더미 데이터 정렬/필터링 유틸 (`sortByPublishedAt`, `filterByCategory`, `searchByKeyword`)

- **Task 006: 공통 UI 컴포넌트 라이브러리 구현**
  - shadcn/ui 기본 컴포넌트 추가: Button, Card, Badge, Input, Skeleton
  - `src/components/layout/Header.tsx` — 헤더 (홈/카테고리 링크 + 검색 슬롯)
  - `src/components/layout/Footer.tsx` — 푸터
  - `src/components/blog/PostCard.tsx` — 글 카드 (제목, 카테고리, 태그, 발행일)
  - `src/components/blog/CategoryBadge.tsx` — 카테고리 배지
  - `src/components/blog/TagBadge.tsx` — 태그 배지
  - `src/components/blog/EmptyState.tsx` — 빈 상태 UI
  - 디자인 시스템 토큰 확립 (색상, 간격, 타이포그래피)

- **Task 007: 홈 페이지 UI (더미 데이터)**
  - `src/app/page.tsx` — 더미 `BlogPost[]`로 `PostCard` 목록 렌더링
  - 발행일 최신 순 정렬
  - 빈 상태 UI 분기
  - 카테고리 필터 버튼 (시각적 UI만, 클릭은 다음 단계)

- **Task 008: 글 상세 페이지 UI (더미 데이터)**
  - `src/app/blog/[id]/page.tsx` — 더미 글 ID로 메타 정보 렌더링
  - `src/components/blog/NotionRenderer.tsx` — 더미 Markdown 본문 렌더링
  - 지원 블록: paragraph, heading_1/2/3, bulleted_list, numbered_list, code, image
  - 코드 블록 syntax highlight 적용 (react-syntax-highlighter 또는 shiki)
  - "← 목록으로 돌아가기" 버튼

- **Task 009: 카테고리 페이지 UI (더미 데이터)**
  - `src/app/category/[slug]/page.tsx` — 더미 카테고리별 필터링 렌더링
  - 카테고리 헤더 (선택 카테고리 명칭 표시)
  - 카테고리 전환 탭/버튼
  - 홈 페이지 카테고리 필터 버튼 → 카테고리 페이지로 연결

- **Task 010: 반응형 디자인 및 사용자 플로우 검증**
  - 모바일(320px~) / 태블릿(768px~) / 데스크톱(1024px~) 뷰포트 대응
  - 헤더 모바일 햄버거 메뉴 처리
  - 글 카드 그리드 반응형 (모바일 1열, 태블릿 2열, 데스크톱 3열)
  - 글 상세 본문 가독성 최적화 (max-width, 줄간격)
  - 홈 → 글 상세 → 뒤로가기 → 카테고리 페이지 전체 플로우 수동 검증

---

### Phase 3: Notion API 연동 및 핵심 기능 구현

> **목표**: Phase 2에서 더미로 채워둔 자리에 실제 Notion API 호출을 연결한다. UI는 그대로 두고 데이터 소스만 교체한다.
> **이 순서인 이유**: UI가 이미 검증되어 있으므로 API 교체로 인한 회귀 범위가 데이터 레이어로 한정된다. Playwright MCP로 더미 시점에 만들어 둔 E2E 시나리오를 그대로 재실행하여 동등성을 검증할 수 있다.
> **예상 기간**: 3-4일 | **완료 기준**: 실제 Notion 글이 홈/상세/카테고리 페이지에 표시 + Playwright 통합 테스트 통과

- **Task 011: Notion API 클라이언트 구현 (더미 → 실제 교체)** - 우선순위
  - `src/lib/notion.ts`에 실제 `@notionhq/client` 호출 구현
    - `fetchPosts()` — DB에서 Status="발행됨" 글 목록 조회
    - `fetchPostById(id)` — 페이지 메타 정보 조회
    - `fetchPostContent(id)` — 블록 콘텐츠 조회 + `notion-to-md` Markdown 변환
    - `fetchCategories()` — 카테고리 목록 조회 (DB select 옵션 또는 distinct 집계)
  - API 에러 핸들링 (try/catch + 타입 안전 반환)
  - Notion 페이지/블록 응답을 `BlogPost`/`BlockContent` 타입으로 매핑하는 어댑터 함수
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 실제 Notion DB 호출 시 발행된 글만 반환되는가
    - [ ] Status="초안" 글은 노출되지 않는가
    - [ ] API 키 누락 시 의미 있는 에러 메시지가 나오는가

- **Task 012: 홈 페이지 — 실제 API 연동 (ISR)**
  - `src/app/page.tsx`에서 `fetchPosts()` 호출로 더미 교체
  - SSG + ISR(`revalidate: 60`) 설정
  - 발행일 기준 최신 순 정렬
  - 글 없을 때 빈 상태 분기 유지
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 홈 페이지 로드 시 Notion 글 목록이 카드로 렌더링되는가
    - [ ] Notion에서 글 추가 후 revalidate 시간 이후 반영되는가
    - [ ] 글 카드 클릭 시 해당 글 상세 페이지로 이동하는가

- **Task 013: 글 상세 페이지 — 실제 API 연동 + 정적 생성**
  - `src/app/blog/[id]/page.tsx`에서 `fetchPostById()`, `fetchPostContent()` 호출
  - `generateStaticParams()` — 전체 발행 글 ID 기반 정적 경로 사전 생성
  - `generateMetadata()` — 동적 메타데이터 (title, description, og)
  - `NotionRenderer`에 실제 Markdown 전달
  - 존재하지 않는 글 ID 요청 시 `notFound()` 처리
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 실제 Notion 블록(paragraph/heading/code/image/list)이 정상 렌더링되는가
    - [ ] 코드 블록의 syntax highlight가 적용되는가
    - [ ] 존재하지 않는 ID 접근 시 404 페이지가 나오는가
    - [ ] "← 목록으로" 버튼이 홈으로 이동하는가

- **Task 014: 핵심 기능 통합 테스트 (Playwright MCP)**
  - 홈 → 글 상세 → 뒤로가기 → 다른 글 클릭 전체 플로우 E2E
  - Notion API 호출 실패 시 에러 핸들링 검증 (네트워크 차단 시나리오)
  - 빈 DB 시 빈 상태 UI 노출 검증
  - 콘솔 에러/네트워크 4xx-5xx 모니터링

---

### Phase 4: 부가 기능 (카테고리 필터/검색/SEO)

> **목표**: 핵심 기능 위에 콘텐츠 탐색 편의성과 외부 노출(SEO)을 더한다.
> **이 순서인 이유**: 카테고리/검색은 글 목록이 실제 데이터로 동작해야 의미가 있다. SEO는 모든 페이지의 최종 형태가 확정된 뒤에 메타데이터를 일괄 정비하는 것이 가장 효율적이다.
> **예상 기간**: 2-3일 | **완료 기준**: 카테고리 필터/검색으로 원하는 글 탐색 + sitemap.xml/robots.txt 정상 노출

- **Task 015: 카테고리 필터링 — 실제 API 연동**
  - `src/app/category/[slug]/page.tsx`에서 `fetchPosts()` + 카테고리 필터링 적용
  - `generateStaticParams()` — `fetchCategories()` 기반 경로 사전 생성
  - 홈 페이지 카테고리 필터 버튼 → 카테고리 페이지 URL 이동
  - 글 상세의 카테고리 배지 클릭 → 해당 카테고리 페이지 이동
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 카테고리 버튼 클릭 시 URL이 `/category/[slug]`로 변경되는가
    - [ ] 해당 카테고리 글만 목록에 표시되는가
    - [ ] 존재하지 않는 카테고리 슬러그 접근 시 404가 나오는가

- **Task 016: 검색 기능 구현**
  - `src/components/blog/SearchBar.tsx` — 검색 입력 컴포넌트
  - 홈 페이지에 검색바 통합 (클라이언트 사이드 필터링)
  - 제목/태그 키워드 매칭 로직
  - 검색어 없을 때 전체 글 복귀, 결과 없을 때 안내 메시지
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 검색어 입력 시 실시간으로 글 목록이 필터링되는가
    - [ ] 검색어 지우면 전체 목록으로 복귀하는가
    - [ ] 검색 결과 없을 때 안내 메시지가 표시되는가

- **Task 017: SEO 최적화**
  - 홈 페이지 정적 메타데이터 (title, description, og:image)
  - 글 상세 페이지 동적 `generateMetadata()`
  - 카테고리 페이지 동적 `generateMetadata()`
  - `src/app/sitemap.ts` — 전체 글 URL 자동 생성
  - `src/app/robots.ts` — 크롤링 허용 설정
  - **테스트 체크리스트** (Playwright MCP):
    - [ ] 각 페이지의 `<title>`, `<meta description>`이 올바른가
    - [ ] `/sitemap.xml`이 전체 글 URL을 포함하는가
    - [ ] `/robots.txt`가 정상 응답하는가

---

### Phase 5: 성능 최적화 및 배포

> **목표**: Vercel에 배포하여 실제 독자가 사용할 수 있는 상태로 만든다.
> **이 순서인 이유**: 기능이 모두 완성된 뒤에 최적화해야 측정 가능한 개선이 가능하고, 배포는 모든 검증이 끝난 마지막 단계여야 롤백 비용이 최소화된다.
> **예상 기간**: 1-2일 | **완료 기준**: Vercel 배포 URL에서 전체 기능 동작 + Lighthouse 80점 이상

- **Task 018: 성능 최적화**
  - ISR `revalidate` 조정 (글 목록: 60초, 글 상세: 3600초)
  - Next.js `<Image>` priority 속성 적용 (LCP 개선)
  - 불필요한 클라이언트 컴포넌트 → 서버 컴포넌트 전환
  - Notion API 응답 캐싱 전략 검토 (`unstable_cache` 또는 fetch cache)
  - Lighthouse 측정 → 80점 미달 항목 수정

- **Task 019: Vercel 배포**
  - Vercel 프로젝트 생성 및 GitHub 리포지토리 연결
  - 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - 프로덕션 빌드 확인 (`npm run build` 오류 없음)
  - 배포 후 전체 페이지 Playwright MCP 최종 검증
  - **테스트 체크리스트** (Playwright MCP — 프로덕션 URL):
    - [ ] 홈/글 상세/카테고리 페이지 모두 200 응답
    - [ ] Notion에서 글 발행 후 ISR로 자동 반영되는가
    - [ ] 모바일/데스크톱 뷰포트 모두 정상 동작
    - [ ] sitemap/robots 정상 응답

---

## 완료 기준 체크리스트

### MVP 기능 완료 기준

- [ ] **F001** — 홈 페이지에서 Notion 글 목록이 카드 형태로 표시됨
- [ ] **F002** — 글 카드 클릭 시 Notion 본문이 렌더링되어 표시됨
- [ ] **F003** — 카테고리 필터로 해당 카테고리 글만 목록에 표시됨
- [ ] **F004** — 검색어 입력 시 제목/태그 기반으로 글이 필터링됨
- [ ] **F010** — Notion API 연동으로 실제 데이터가 화면에 반영됨
- [ ] **F011** — 모바일/태블릿/데스크톱에서 레이아웃이 정상 표시됨

### 배포 완료 기준

- [ ] Vercel 배포 URL에서 전체 기능 정상 동작
- [ ] Notion에서 글 발행 후 블로그에 자동 반영 (ISR) 확인
- [ ] Lighthouse 성능 점수 80점 이상
- [ ] Phase 3~5 전체 Playwright MCP 테스트 시나리오 통과

---

**최종 업데이트**: 2026-05-13
**진행 상황**: Phase 1 진행 중 (3/19 Tasks 완료)
