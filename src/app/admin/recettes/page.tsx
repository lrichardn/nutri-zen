import { db } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function RecettesAdmin() {
  const recipes = await db.recipe.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Recettes</h1>
        <Link
          href="/admin/recettes/new"
          className="px-4 py-2 rounded-full text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
        >
          + Nouvelle recette
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
          Aucune recette. <Link href="/admin/recettes/new" className="text-[#5a8a5e] hover:underline">Créer la première →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Titre</th>
                <th className="px-6 py-3 text-left">Catégorie</th>
                <th className="px-6 py-3 text-left">Calories</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{recipe.title}</td>
                  <td className="px-6 py-4 text-gray-500">{recipe.category ?? "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{recipe.calories ? `${recipe.calories} kcal` : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                      {recipe.published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/recettes/${recipe.id}`} className="text-[#5a8a5e] hover:underline">Modifier</Link>
                      <DeleteButton id={recipe.id} endpoint="/api/admin/recettes" label="Supprimer" />
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
