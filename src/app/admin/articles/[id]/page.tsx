import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Modifier l&apos;article</h1>
      <ArticleForm id={article.id} initial={{ title: article.title, content: article.content, published: article.published, imageUrl: article.imageUrl }} />
    </div>
  );
}
