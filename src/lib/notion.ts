import type { BlogPost, Category } from "@/types/notion";

// Phase 3에서 실제 @notionhq/client 호출로 교체 예정

export async function fetchPosts(): Promise<BlogPost[]> {
  throw new Error("fetchPosts: Phase 3에서 구현 예정");
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  throw new Error(`fetchPostById(${id}): Phase 3에서 구현 예정`);
}

export async function fetchPostContent(id: string): Promise<string> {
  throw new Error(`fetchPostContent(${id}): Phase 3에서 구현 예정`);
}

export async function fetchCategories(): Promise<Category[]> {
  throw new Error("fetchCategories: Phase 3에서 구현 예정");
}
