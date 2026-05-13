// Notion 블록 콘텐츠 렌더러 — BlockContent 배열을 HTML로 변환
// 코드 블록은 <pre><code>로 처리, 외부 마크다운 라이브러리 미사용
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/types/notion";

interface NotionRendererProps {
  blocks: BlockContent[];
  className?: string;
}

// 블록 타입별 렌더링 컴포넌트
function RenderBlock({ block }: { block: BlockContent }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h1 className="mb-4 mt-8 scroll-m-20 text-3xl font-bold tracking-tight first:mt-0">
          {block.content}
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="mb-3 mt-7 scroll-m-20 text-2xl font-semibold tracking-tight">
          {block.content}
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="mb-2 mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
          {block.content}
        </h3>
      );

    case "paragraph":
      return (
        <p className="mb-4 leading-7 text-foreground [&:not(:first-child)]:mt-0">
          {block.content}
        </p>
      );

    case "bulleted_list":
      return (
        <li className="mb-1 ml-6 list-disc leading-7 text-foreground">
          {block.content}
        </li>
      );

    case "numbered_list":
      return (
        <li className="mb-1 ml-6 list-decimal leading-7 text-foreground">
          {block.content}
        </li>
      );

    case "code":
      return (
        <div className="my-4">
          {/* 언어 레이블 */}
          {block.language && (
            <div className="flex items-center rounded-t-md border border-b-0 border-border bg-muted px-4 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {block.language}
              </span>
            </div>
          )}
          <pre
            className={cn(
              "overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm",
              block.language && "rounded-t-none"
            )}
          >
            <code className="font-mono text-foreground">{block.content}</code>
          </pre>
        </div>
      );

    case "image":
      return (
        <figure className="my-6">
          {block.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url}
              alt={block.content}
              className="w-full rounded-lg border border-border object-cover"
            />
          )}
          {block.content && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.content}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

export function NotionRenderer({ blocks, className }: NotionRendererProps) {
  // 리스트 블록을 그룹으로 묶어 <ul>/<ol> 태그로 감싸기
  const elements: React.ReactNode[] = [];
  let bulletGroup: BlockContent[] = [];
  let numberedGroup: BlockContent[] = [];

  const flushBulletGroup = () => {
    if (bulletGroup.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="mb-4 space-y-1">
          {bulletGroup.map((b, i) => (
            <RenderBlock key={i} block={b} />
          ))}
        </ul>
      );
      bulletGroup = [];
    }
  };

  const flushNumberedGroup = () => {
    if (numberedGroup.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="mb-4 space-y-1">
          {numberedGroup.map((b, i) => (
            <RenderBlock key={i} block={b} />
          ))}
        </ol>
      );
      numberedGroup = [];
    }
  };

  blocks.forEach((block, index) => {
    if (block.type === "bulleted_list") {
      // 번호 리스트 그룹 닫기
      flushNumberedGroup();
      bulletGroup.push(block);
    } else if (block.type === "numbered_list") {
      // 불릿 리스트 그룹 닫기
      flushBulletGroup();
      numberedGroup.push(block);
    } else {
      // 두 그룹 모두 닫기
      flushBulletGroup();
      flushNumberedGroup();
      elements.push(<RenderBlock key={index} block={block} />);
    }
  });

  // 남은 리스트 그룹 처리
  flushBulletGroup();
  flushNumberedGroup();

  // @tailwindcss/typography 미설치 — prose-* 제거, 직접 스타일 적용
  return (
    <article className={cn("max-w-none text-foreground", className)}>
      {elements}
    </article>
  );
}
