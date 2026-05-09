"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RecipeData = {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  category: string;
  prepTime: string;
  calories: string;
  published: boolean;
};

export default function RecipeForm({ initial, id }: { initial?: Partial<RecipeData>; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<RecipeData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    ingredients: initial?.ingredients ?? "",
    instructions: initial?.instructions ?? "",
    category: initial?.category ?? "",
    prepTime: initial?.prepTime ?? "",
    calories: initial?.calories ?? "",
    published: initial?.published ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof RecipeData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      ...form,
      prepTime: form.prepTime ? parseInt(form.prepTime) : null,
      calories: form.calories ? parseInt(form.calories) : null,
    };
    const res = await fetch(id ? `/api/admin/recettes/${id}` : "/api/admin/recettes", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) { setError("Une erreur est survenue."); return; }
    router.push("/admin/recettes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Titre *</label>
        <input required value={form.title} onChange={(e) => update("title", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea required rows={2} value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input value={form.category} onChange={(e) => update("category", e.target.value)}
            placeholder="Ex: Salade, Soupe..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temps de préparation (min)</label>
          <input type="number" min="0" value={form.prepTime} onChange={(e) => update("prepTime", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Calories (kcal)</label>
          <input type="number" min="0" value={form.calories} onChange={(e) => update("calories", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ingrédients *</label>
        <textarea required rows={5} value={form.ingredients} onChange={(e) => update("ingredients", e.target.value)}
          placeholder="Un ingrédient par ligne&#10;Ex: 200g de poulet&#10;1 courgette..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] resize-none font-mono text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Instructions *</label>
        <textarea required rows={8} value={form.instructions} onChange={(e) => update("instructions", e.target.value)}
          placeholder="Étape 1 : ...&#10;Étape 2 : ..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] resize-none" />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="published" checked={form.published} onChange={(e) => update("published", e.target.checked)}
          className="w-4 h-4 accent-[#5a8a5e]" />
        <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-full font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors">
          {loading ? "Enregistrement..." : id ? "Mettre à jour" : "Créer la recette"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
          Annuler
        </button>
      </div>
    </form>
  );
}
