import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/admin/RecipeForm";

export default async function EditRecette({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await db.recipe.findUnique({ where: { id } });
  if (!recipe) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Modifier la recette</h1>
      <RecipeForm
        id={recipe.id}
        initial={{
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          category: recipe.category ?? "",
          prepTime: recipe.prepTime?.toString() ?? "",
          calories: recipe.calories?.toString() ?? "",
          published: recipe.published,
        }}
      />
    </div>
  );
}
