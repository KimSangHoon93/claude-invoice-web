// 블로그 도메인 타입

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: Category;
  tags: Tag[];
  publishedAt: string; // ISO 8601
  status: "초안" | "발행됨";
  excerpt?: string;
  coverImageUrl?: string;
}

export interface BlockContent {
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list"
    | "numbered_list"
    | "code"
    | "image";
  content: string;
  language?: string; // code 블록 전용
  url?: string; // image 블록 전용
}

// Notion API 응답 래퍼 타입 (Phase 3 구현 예정)

export interface NotionPage {
  id: string;
  properties: Record<string, NotionPropertyValue>;
  created_time: string;
  last_edited_time: string;
}

export type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "select"; select: { id: string; name: string } | null }
  | { type: "multi_select"; multi_select: Array<{ id: string; name: string }> }
  | { type: "date"; date: { start: string } | null }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> };

export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  [key: string]: unknown;
}
