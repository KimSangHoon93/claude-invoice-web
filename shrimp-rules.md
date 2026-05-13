# Development Guidelines

## Project Overview

- **목적**: Notion CMS 기반 개인 기술 블로그 — Notion DB에서 글을 읽어 자동 발행
- **스택**: Next.js 16.2.6 (App Router) + React 19 + TypeScript 5 + TailwindCSS v4 + shadcn/ui
- **접근법**: 구조-우선 (Structure-First) — 더미 데이터로 UI 완성 후 Notion API로 교체
- **로드맵**: `docs/ROADMAP.md` (5 Phase, 19 Tasks)
- **PRD**: `docs/PRD.md`

---

## Project Architecture

### 필수 디렉토리 구조

```
src/
  app/
    page.tsx                    # 홈 (글 목록, 검색, 카테고리 필터)
    blog/[id]/page.tsx          # 글 상세 (Notion 본문 렌더링)
    category/[slug]/page.tsx    # 카테고리별 글 목록
    layout.tsx                  # 루트 레이아웃
    not-found.tsx               # 404 페이지
    globals.css                 # 전역 스타일
    sitemap.ts                  # Phase 4에서 생성
    robots.ts                   # Phase 4에서 생성
  components/
    layout/                     # Header.tsx, Footer.tsx
    blog/                       # PostCard, CategoryBadge, TagBadge, NotionRenderer, SearchBar, EmptyState
    ui/                         # shadcn/ui 컴포넌트만
  lib/
    notion.ts                   # Notion API 함수 (fetchPosts, fetchPostById, fetchPostContent, fetchCategories)
  types/
    notion.ts                   # BlogPost, BlockContent, Category, Tag 타입
  mocks/
    posts.ts                    # 더미 BlogPost 데이터
    blocks.ts                   # 더미 Markdown 본문
tasks/                          # 작업 파일 디렉토리 (XXX-description.md)
docs/
  PRD.md
  ROADMAP.md
```

### 경로 별칭

- `@/*` → `./src/*` (tsconfig.json 설정됨)
- **항상 절대 경로 별칭 사용** — 상대 경로 (`../../`) 금지

---

## Code Standards

### 네이밍 규칙

- **변수/함수**: camelCase — `fetchPosts`, `handleClick`, `blogPost`
- **컴포넌트**: PascalCase — `PostCard`, `NotionRenderer`
- **타입/인터페이스**: PascalCase — `BlogPost`, `BlockContent`
- **파일명 (컴포넌트)**: PascalCase — `PostCard.tsx`
- **파일명 (유틸/lib)**: camelCase — `notion.ts`

### TypeScript 규칙

- **모든 함수에 반환 타입 명시** — `async function fetchPosts(): Promise<BlogPost[]>`
- `any` 타입 금지 — `unknown` 또는 구체 타입 사용
- Notion API 응답은 `src/types/notion.ts`의 타입으로 매핑 후 사용

### 주석

- **한글 주석 사용** — 영문 주석 금지
- WHY가 명확하지 않으면 주석 작성 금지 (코드 자체가 설명해야 함)

---

## Data Layer Rules

### `src/lib/notion.ts` 함수 동작 원칙

```typescript
// 반드시 이 패턴을 따를 것
export async function fetchPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    // 환경 변수 미설정 시 더미 데이터 반환 (Phase 2까지)
    return mockPosts;
  }
  // 실제 Notion API 호출 (Phase 3에서 구현)
}
```

- **Phase 2까지**: `lib/notion.ts`는 더미 데이터만 반환
- **Phase 3**: `lib/notion.ts`에 실제 API 구현 — UI 파일은 수정하지 않음
- **Notion 필터 조건**: `Status = "발행됨"` 인 글만 반환 — 초안 노출 금지

### Notion 데이터베이스 스키마 (고정)

| 필드 | Notion 타입 | 비고 |
|------|------------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 목록 |
| Published | date | 발행일 |
| Status | select | 초안 / 발행됨 |

---

## Component Implementation Standards

### shadcn/ui 사용 규칙

- `src/components/ui/`에만 shadcn 컴포넌트 배치
- shadcn 컴포넌트 추가 시 `mcp__shadcn__get_add_command_for_items`로 명령어 확인 후 설치
- 기본 shadcn 컴포넌트: Button, Card, Badge, Input, Skeleton
- shadcn 컴포넌트를 직접 수정하지 않음 — 래퍼 컴포넌트 생성

### 컴포넌트 분류

| 위치 | 용도 |
|------|------|
| `components/ui/` | shadcn/ui 원본 컴포넌트 |
| `components/layout/` | Header, Footer — `use client` 최소화 |
| `components/blog/` | 블로그 도메인 컴포넌트 |

### Server vs Client Component

- **기본값: Server Component** — `use client` 필요할 때만 추가
- `use client` 추가 기준: `useState`, `useEffect`, 이벤트 핸들러, 브라우저 API 사용 시만
- 검색 기능(`SearchBar.tsx`)은 `use client` 필수

---

## Styling Rules (TailwindCSS v4)

### 사용 방식

```css
/* globals.css - 반드시 이 한 줄만 사용 */
@import "tailwindcss";
```

- **`tailwind.config.js` 생성 금지** — v4는 설정 파일 없음
- **`postcss.config.mjs`는 이미 존재** — 수정하지 않음
- CSS 변수(`--font-geist-sans` 등)는 `globals.css`에서 관리

### 반응형 브레이크포인트

- 모바일: 기본 (320px~)
- 태블릿: `md:` (768px~)
- 데스크톱: `lg:` (1024px~)
- 글 카드 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Rendering Strategy (SSG + ISR)

### revalidate 설정 (고정값)

```typescript
// 글 목록 페이지 (홈, 카테고리)
export const revalidate = 60;

// 글 상세 페이지
export const revalidate = 3600;
```

- **모든 페이지에 revalidate 명시** — 생략 금지
- 글 상세 페이지에 `generateStaticParams()` 구현 필수 (Phase 3)
- 동적 라우트(`[id]`, `[slug]`)는 존재하지 않는 경로 → `notFound()` 호출

---

## Task File Standards

### 작업 파일 생성 규칙

- 위치: `/tasks/XXX-description.md` (예: `001-setup.md`)
- 번호는 3자리 0-패딩
- 이전 완료 작업 파일 참조 후 동일 형식 유지

### API/비즈니스 로직 작업 시 필수 섹션

```markdown
## 테스트 체크리스트
- [ ] 시나리오 1
- [ ] 시나리오 2
```

- Phase 3 이후 모든 API 작업 파일에 "## 테스트 체크리스트" 섹션 필수

---

## Testing Rules

### Playwright MCP 테스트 필수 시점

- Phase 3 이후 API 연동 작업 구현 완료 후
- 비즈니스 로직(필터링, 검색) 구현 후
- Phase 5 배포 후 최종 검증

### 테스트 도구

- **UI 개발 (Phase 1-2)**: `npm run dev` 실행 후 브라우저 수동 확인
- **API 연동 (Phase 3+)**: `mcp__playwright__*` 도구로 E2E 테스트 실행

---

## ROADMAP.md Update Rules

- Task 완료 시 `docs/ROADMAP.md`에서 해당 항목을 ✅로 마킹
- 완료된 Task에 `See: /tasks/XXX-xxx.md` 참조 추가
- **진행 상황 숫자 업데이트** — 예: `(5/19 Tasks 완료)`
- **최종 업데이트 날짜 갱신**

---

## Git Workflow

### 커밋 메시지 형식

```
{이모지} {타입}: {한글 설명}

예시:
✨ feat: 홈 페이지 글 목록 카드 UI 구현
🐛 fix: 카테고리 필터 클릭 시 페이지 이동 오류 수정
♻️ refactor: notion.ts 어댑터 함수 분리
```

- **커밋 전 반드시 lint 실행**: `npm run lint`
- 브랜치명: `feature/기능명` 형식

---

## Multi-File Coordination Rules

### 새 페이지 추가 시 함께 수정할 파일

1. `src/app/[route]/page.tsx` — 페이지 생성
2. `src/components/layout/Header.tsx` — 네비게이션 링크 추가
3. `docs/ROADMAP.md` — Task 완료 표시
4. `src/app/sitemap.ts` (Phase 4 이후) — URL 추가

### 새 컴포넌트 추가 시

1. `src/components/{category}/ComponentName.tsx` — 컴포넌트 생성
2. 사용하는 페이지 파일 — import 추가
3. shadcn 신규 설치 필요 시 → `mcp__shadcn__get_add_command_for_items` 호출 후 명령어 실행

### 타입 변경 시

1. `src/types/notion.ts` — 타입 수정
2. `src/lib/notion.ts` — 반환값 타입 확인 및 어댑터 수정
3. `src/mocks/posts.ts` or `blocks.ts` — 더미 데이터 구조 동기화
4. `tsc --noEmit` 실행하여 컴파일 오류 확인

---

## AI Decision Standards

### 애매한 상황 판단 기준

| 상황 | 판단 |
|------|------|
| Server vs Client Component 선택 | 기본값 Server, `useState`/이벤트 있으면 Client |
| 더미 데이터 vs 실제 API | Phase 1-2: 더미, Phase 3+: 실제 |
| 새 유틸 함수 위치 | 도메인별이면 `lib/`, 범용이면 `lib/utils.ts` |
| shadcn 컴포넌트 수정 필요 시 | 래퍼 컴포넌트 생성, 원본 수정 금지 |
| `revalidate` 값 불명확 시 | 글 목록 60, 글 상세 3600 |

### Phase별 작업 범위

- **Phase 1**: 구조 설정만 — UI 구현 금지
- **Phase 2**: 더미 데이터 + UI만 — Notion API 호출 금지
- **Phase 3**: `lib/notion.ts`만 수정 — UI 파일 수정 금지
- **Phase 4-5**: 기능 추가 + 최적화

---

## Prohibited Actions

- **`tailwind.config.js` 생성 금지** — TailwindCSS v4는 설정 파일 불필요
- **`src/components/ui/` 내 shadcn 컴포넌트 직접 수정 금지**
- **Phase 2에서 실제 Notion API 호출 코드 작성 금지**
- **Phase 3에서 UI 컴포넌트 변경 금지** — 데이터 소스 교체만
- **`any` 타입 사용 금지**
- **상대 경로 import 금지** — `@/` 별칭 사용
- **환경 변수 하드코딩 금지** — `.env.local`에서만 관리
- **`Status="초안"` 글 API 응답에 포함 금지**
- **커밋 전 lint 미실행 금지**
- **영문 주석 사용 금지** — 한글 주석만
