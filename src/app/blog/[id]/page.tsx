interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  return (
    <div className="p-8">
      <h1>글 상세 페이지</h1>
      <p>ID: {id}</p>
    </div>
  );
}
