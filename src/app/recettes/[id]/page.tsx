import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RecettePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await db.recipe.findUnique({ where: { id, published: true } });
  if (!recipe) notFound();

  const ingredients = recipe.ingredients.split("\n").filter(Boolean);
  const instructions = recipe.instructions.split("\n").filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/recettes" className="text-sm text-[#5a8a5e] hover:underline mb-8 inline-block">
        ← Retour aux recettes
      </Link>

      <div className="mb-4 flex gap-3 items-center">
        {recipe.category && (
          <span className="text-xs font-medium text-[#5a8a5e] bg-[#e8f0e9] px-2 py-1 rounded-full">
            {recipe.category}
          </span>
        )}
        {recipe.prepTime && <span className="text-sm text-gray-400">⏱ {recipe.prepTime} min</span>}
        {recipe.calories && <span className="text-sm text-gray-400">🔥 {recipe.calories} kcal</span>}
      </div>

      <h1 className="text-3xl font-bold mb-4 text-[#3d6b41]">{recipe.title}</h1>
      <p className="text-gray-600 text-lg mb-10">{recipe.description}</p>

      <div className="bg-[#e8f0e9] rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4 text-[#3d6b41]">Ingrédients</h2>
        <ul className="space-y-2">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-[#5a8a5e] shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4 text-[#3d6b41]">Préparation</h2>
        <ol className="space-y-4">
          {instructions.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="w-7 h-7 rounded-full bg-[#5a8a5e] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">
                {step.replace(/^Étape \d+ : /, "")}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
