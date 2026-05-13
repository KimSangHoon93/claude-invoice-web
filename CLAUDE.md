# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트 개요

**Notion CMS 기반 개인 기술 블로그** — Notion 데이터베이스를 CMS로 활용하여 글 작성 즉시 블로그에 자동 반영되는 1인 개발자용 블로그.

- PRD: `docs/PRD.md`
- 개발 로드맵: `docs/ROADMAP.md`

## 기술 스택

- **Framework**: Next.js 16.2.6 (App Router)
- **Runtime**: React 19.2.4 + TypeScript 5
- **Styling**: TailwindCSS v4 — `@import "tailwindcss"` 방식 (설정 파일 없음)
- **UI**: shadcn/ui (new-york 스타일, devDependencies에 설치됨) + Lucide React
- **CMS**: @notionhq/client + notion-to-md — 설치 예정 (Phase 3)

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

## 아키텍처 (개발 예정 구조)

구조 우선 접근법(Structure-First)으로 개발합니다. 더미 데이터로 UI를 완성한 뒤 Notion API로 교체합니다.

```
src/
  app/
    page.tsx                    # 홈 (글 목록, 검색, 카테고리 필터)
    blog/[id]/page.tsx          # 글 상세 (Notion 본문 렌더링)
    category/[slug]/page.tsx    # 카테고리별 글 목록
    layout.tsx                  # 루트 레이아웃 (Geist 폰트, 헤더/푸터 슬롯)
    globals.css                 # 전역 스타일 (TailwindCSS v4)
  components/
    layout/                     # Header, Footer
    blog/                       # PostCard, CategoryBadge, TagBadge, NotionRenderer, SearchBar
    ui/                         # shadcn/ui 컴포넌트
  lib/
    notion.ts                   # Notion API 공통 함수 (fetchPosts, fetchPostById, fetchPostContent, fetchCategories)
  types/
    notion.ts                   # BlogPost, BlockContent, Category, Tag 타입 정의
  mocks/
    posts.ts                    # 더미 BlogPost 데이터 (Phase 2 UI 개발용)
    blocks.ts                   # 더미 Markdown 본문 (Phase 2 UI 개발용)
```

### 데이터 레이어 규칙

- `src/lib/notion.ts`의 함수들은 환경 변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`) 미설정 시 `src/mocks/`의 더미 데이터를 반환합니다.
- Phase 3에서 실제 Notion API 호출로 교체되며, 이때 UI는 변경하지 않습니다.
- 모든 페이지는 SSG + ISR(`revalidate`) 적용. 글 목록 60초, 글 상세 3600초.

### Notion 데이터베이스 스키마

| 필드 | Notion 타입 |
|------|------------|
| Title | title |
| Category | select |
| Tags | multi_select |
| Published | date |
| Status | select (초안/발행됨) |

`Status = "발행됨"` 인 글만 블로그에 노출됩니다.

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
