# Plan: ROADMAP.md Phase 1 Task 등록

## Context

`docs/ROADMAP.md`에 정의된 19개 Task(5 Phase)를 shrimp-task-manager에 등록하여 체계적으로 추적·실행할 수 있도록 준비한다.

현재 상태:
- `src/app/` 만 존재 (layout.tsx, page.tsx, globals.css)
- `src/components/`, `src/lib/`, `src/types/`, `src/mocks/`, `tasks/` 미생성
- `components.json` 없음 (shadcn/ui 미초기화)
- ROADMAP.md 진행 상황: 0/19 Tasks 완료

---

## 구현 계획

### Step 1: `mcp__shrimp-task-manager__plan_task` 호출

아래 내용으로 task planning 요청을 전송한다.

**description:**
```
Notion CMS 기반 개인 기술 블로그 Phase 1 구현.
목표: 전체 라우트 구조, 타입 정의, 환경 설정을 완성하여 Phase 2 UI 작업이 충돌 없이 진행되도록 한다.

Task 001: 프로젝트 구조 및 환경 설정
- 기존 src/app/ 구조 확인 (layout.tsx, page.tsx, globals.css 점검)
- tsconfig.json @/* 경로 별칭 동작 확인
- ESLint 설정 점검
- shadcn/ui 초기화 (new-york 스타일) — components.json 생성
- Lucide React 설치
- 폴더 구조 사전 생성: src/components/{layout,blog,ui}, src/lib, src/types, src/mocks, tasks/

Task 002: 라우트 골격 및 빈 페이지 생성
- src/app/page.tsx — 홈 페이지 빈 껍데기 ("홈 페이지" 텍스트만)
- src/app/blog/[id]/page.tsx — 글 상세 동적 라우트 빈 껍데기
- src/app/category/[slug]/page.tsx — 카테고리 동적 라우트 빈 껍데기
- src/app/not-found.tsx — 404 페이지 빈 껍데기
- src/app/layout.tsx 메타데이터 기본값 수정
- npm run dev 실행 후 3개 라우트 200 응답 확인

Task 003: 타입 정의 및 인터페이스 설계
- src/types/notion.ts — BlogPost, BlockContent, Category, Tag 타입 정의
- Notion API 응답 래퍼 타입 (NotionPage, NotionBlock) 정의
- src/lib/notion.ts 함수 시그니처 선언만 (스텁 throw)
  - fetchPosts(): Promise<BlogPost[]>
  - fetchPostById(id: string): Promise<BlogPost | null>
  - fetchPostContent(id: string): Promise<string>
  - fetchCategories(): Promise<Category[]>
- tsc --noEmit으로 타입 컴파일 통과 확인

Task 004: Notion 환경 변수 및 DB 스키마 준비
- .env.local.example 생성 (NOTION_API_KEY, NOTION_DATABASE_ID)
- @notionhq/client, notion-to-md 설치 (사용은 Phase 3)
```

**requirements:**
```
- Next.js 16.2.6 App Router, TypeScript 5, TailwindCSS v4
- @/* 경로 별칭 사용 (상대 경로 금지)
- 한글 주석만 사용
- shadcn/ui new-york 스타일
- 커밋 전 npm run lint 실행
- Phase 1에서는 UI 구현 금지, 구조 설정만
```

### Step 2: shrimp-task-manager가 반환한 지침에 따라 `split_tasks` 호출

plan_task 반환값의 지침을 엄격히 따라 tasks를 분리·등록한다.

### Step 3: 첫 번째 Task 실행

`execute_task`로 Task 001부터 순차 실행.

---

## 수정 대상 파일

| 파일 | 작업 |
|------|------|
| `tasks/001-setup.md` | 신규 생성 |
| `tasks/002-routes.md` | 신규 생성 |
| `tasks/003-types.md` | 신규 생성 |
| `tasks/004-env.md` | 신규 생성 |
| `src/components/layout/` | 디렉토리 생성 |
| `src/components/blog/` | 디렉토리 생성 |
| `src/components/ui/` | 디렉토리 생성 |
| `src/lib/notion.ts` | 신규 생성 (스텁) |
| `src/types/notion.ts` | 신규 생성 |
| `src/mocks/` | 디렉토리 생성 |
| `src/app/blog/[id]/page.tsx` | 신규 생성 |
| `src/app/category/[slug]/page.tsx` | 신규 생성 |
| `src/app/not-found.tsx` | 신규 생성 |
| `.env.local.example` | 신규 생성 |
| `components.json` | shadcn init으로 생성 |
| `docs/ROADMAP.md` | Task 완료 시 ✅ 마킹 |

---

## 검증 방법

1. `npm run dev` 실행 후 `/`, `/blog/test`, `/category/test` 모두 200 응답
2. `npm run lint` 오류 없음
3. `tsc --noEmit` 타입 컴파일 통과
4. `components.json` 존재 및 `new-york` 스타일 확인
