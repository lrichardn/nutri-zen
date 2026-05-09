import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ArticlesAdmin() {
  const articles = await db.article.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Articles — Zoom Sur...</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 rounded-full text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
        >
          + Nouvel article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
          Aucun article. <Link href="/admin/articles/new" className="text-[#5a8a5e] hover:underline">Créer le premier →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Titre</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#e8f0e9] flex items-center justify-center shrink-0">
                      {article.imageUrl ? (
                        <Image src={article.imageUrl} alt={article.title} width={56} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">📖</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{article.title}</td>
                  <td className="px-6 py-4 text-gray-500">{article.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                      {article.published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/articles/${article.id}`} className="text-[#5a8a5e] hover:underline">Modifier</Link>
                      <DeleteButton id={article.id} endpoint="/api/admin/articles" label="Supprimer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
