import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function ZoomSurPage() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-[#3d6b41]">Zoom Sur...</h1>
      <p className="text-gray-600 text-lg mb-12">
        Des articles pour mieux comprendre la nutrition et adopter de bonnes habitudes alimentaires.
      </p>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📖</p>
          <p>Les articles arrivent bientôt !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/zoom-sur/${article.id}`}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex"
            >
              <div className="w-32 h-auto shrink-0 bg-[#e8f0e9] flex items-center justify-center overflow-hidden">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={128}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📖</span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-1">
                  {article.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{article.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {article.content.slice(0, 120)}…
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
