import { db } from "@/lib/db";
import Link from "next/link";

export default async function RecettesPage() {
  const recipes = await db.recipe.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-[#3d6b41]">Coin Recettes</h1>
      <p className="text-gray-600 text-lg mb-12">
        Des recettes équilibrées et faciles à réaliser pour prendre soin de vous au quotidien.
      </p>

      {recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🥗</p>
          <p>Les recettes arrivent bientôt !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recettes/${recipe.id}`}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow block"
            >
              <div className="h-48 bg-[#e8f0e9] flex items-center justify-center text-6xl">
                🥗
              </div>
              <div className="p-5">
                {recipe.category && (
                  <span className="text-xs font-medium text-[#5a8a5e] bg-[#e8f0e9] px-2 py-1 rounded-full">
                    {recipe.category}
                  </span>
                )}
                <h3 className="font-bold text-lg mt-3 mb-1">{recipe.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{recipe.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-gray-400">
                  {recipe.prepTime && <span>⏱ {recipe.prepTime} min</span>}
                  {recipe.calories && <span>🔥 {recipe.calories} kcal</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
