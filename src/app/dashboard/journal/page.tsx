"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MEAL_TYPES = [
  { value: "BREAKFAST", label: "Petit-déjeuner" },
  { value: "LUNCH", label: "Déjeuner" },
  { value: "DINNER", label: "Dîner" },
  { value: "SNACK", label: "Collation" },
];

type FoodItem = { name: string; calories: string; proteins: string; carbs: string; fats: string; quantity: string; unit: string };
const emptyFood = (): FoodItem => ({ name: "", calories: "", proteins: "0", carbs: "0", fats: "0", quantity: "100", unit: "g" });

export default function JournalPage() {
  const router = useRouter();
  const [mealType, setMealType] = useState("BREAKFAST");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [foods, setFoods] = useState<FoodItem[]>([emptyFood()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateFood(index: number, field: keyof FoodItem, value: string) {
    setFoods((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          date,
          foodItems: foods.map((f) => ({
            name: f.name,
            calories: parseFloat(f.calories) || 0,
            proteins: parseFloat(f.proteins) || 0,
            carbs: parseFloat(f.carbs) || 0,
            fats: parseFloat(f.fats) || 0,
            quantity: parseFloat(f.quantity) || 1,
            unit: f.unit,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/dashboard");
    } catch {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-[#3d6b41]">Ajouter un repas</h1>
      <p className="text-gray-500 mb-8">Enregistrez les aliments consommés pour suivre vos apports nutritionnels.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date & type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5a8a5e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de repas</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5a8a5e] bg-white"
            >
              {MEAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Aliments */}
        <div>
          <label className="block text-sm font-semibold mb-3">Aliments</label>
          <div className="space-y-4">
            {foods.map((food, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    placeholder="Nom de l'aliment"
                    required
                    value={food.name}
                    onChange={(e) => updateFood(i, "name", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white"
                  />
                  {foods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFoods((prev) => prev.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Qté"
                      min="0"
                      value={food.quantity}
                      onChange={(e) => updateFood(i, "quantity", e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white"
                    />
                    <select
                      value={food.unit}
                      onChange={(e) => updateFood(i, "unit", e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white"
                    >
                      {["g", "ml", "unité", "cs", "cc"].map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <input
                    type="number"
                    placeholder="Calories (kcal)"
                    min="0"
                    required
                    value={food.calories}
                    onChange={(e) => updateFood(i, "calories", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { field: "proteins" as const, label: "Protéines (g)" },
                    { field: "carbs" as const, label: "Glucides (g)" },
                    { field: "fats" as const, label: "Lipides (g)" },
                  ].map((macro) => (
                    <input
                      key={macro.field}
                      type="number"
                      placeholder={macro.label}
                      min="0"
                      value={food[macro.field]}
                      onChange={(e) => updateFood(i, macro.field, e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFoods((prev) => [...prev, emptyFood()])}
            className="mt-3 text-sm text-[#5a8a5e] hover:underline font-medium"
          >
            + Ajouter un aliment
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-full font-semibold text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors"
          >
            {loading ? "Enregistrement..." : "Enregistrer le repas"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
