// 글 카드 컴포넌트 — 홈/카테고리 목록에서 사용
import Link from "next/link";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { TagBadge } from "@/components/blog/TagBadge";
import type { BlogPost } from "@/types/notion";

interface PostCardProps {
  post: BlogPost;
}

// 발행일 포맷 — YYYY년 M월 D일 형식으로 변환
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        {/* 커버 이미지 (있을 때만 표시) */}
        {post.coverImageUrl && (
          <div className="overflow-hidden rounded-t-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={`${post.title} 커버 이미지`}
              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          {/* 카테고리 배지 — 외부 Link 안에 있으므로 static으로 렌더링 (중첩 <a> 방지) */}
          <div className="mb-2">
            <CategoryBadge category={post.category} static />
          </div>

          {/* 글 제목 */}
          <CardTitle className="line-clamp-2 text-base leading-snug group-hover:text-primary">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-3">
          {/* 발췌문 */}
          {post.excerpt && (
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {post.excerpt}
            </CardDescription>
          )}
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 pt-0">
          {/* 태그 목록 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
              {/* 태그 3개 초과 시 나머지 개수 표시 */}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 발행일 */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
