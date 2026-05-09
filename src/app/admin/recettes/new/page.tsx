import RecipeForm from "@/components/admin/RecipeForm";

export default function NewRecette() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Nouvelle recette</h1>
      <RecipeForm />
    </div>
  );
}
