interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <div className="p-8">
      <h1>카테고리 페이지</h1>
      <p>카테고리: {slug}</p>
    </div>
  );
}
