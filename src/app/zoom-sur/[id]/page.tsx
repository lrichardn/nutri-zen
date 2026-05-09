import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db.article.findUnique({ where: { id, published: true } });
  if (!article) notFound();

  const paragraphs = article.content.split("\n").filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/zoom-sur" className="text-sm text-[#5a8a5e] hover:underline mb-8 inline-block">
        ← Retour aux articles
      </Link>

      {/* Image bannière */}
      {article.imageUrl && (
        <div className="w-full h-64 rounded-2xl overflow-hidden mb-8 bg-[#e8f0e9]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={800}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`flex items-center gap-4 mb-8 ${!article.imageUrl ? "" : ""}`}>
        {!article.imageUrl && (
          <div className="w-16 h-16 rounded-2xl bg-[#e8f0e9] flex items-center justify-center text-3xl shrink-0">
            📖
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-[#3d6b41]">{article.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {article.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed text-lg">{para}</p>
        ))}
      </div>
    </div>
  );
}
