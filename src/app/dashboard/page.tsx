import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/connexion");

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/connexion");

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const meals = await db.mealEntry.findMany({
    where: { userId: user.id, date: { gte: start, lt: end } },
    include: { foodItems: true },
  });

  const totalCalories = meals.flatMap((m) => m.foodItems).reduce((sum, f) => sum + f.calories, 0);
  const totalProteins = meals.flatMap((m) => m.foodItems).reduce((sum, f) => sum + f.proteins, 0);
  const totalCarbs = meals.flatMap((m) => m.foodItems).reduce((sum, f) => sum + f.carbs, 0);
  const totalFats = meals.flatMap((m) => m.foodItems).reduce((sum, f) => sum + f.fats, 0);

  const MEAL_LABELS: Record<string, string> = {
    BREAKFAST: "Petit-déjeuner",
    LUNCH: "Déjeuner",
    DINNER: "Dîner",
    SNACK: "Collation",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#3d6b41]">Bonjour, {user.name?.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 mt-1">
          {today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Résumé du jour */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Calories", value: Math.round(totalCalories), unit: "kcal", color: "text-orange-500" },
          { label: "Protéines", value: Math.round(totalProteins), unit: "g", color: "text-blue-500" },
          { label: "Glucides", value: Math.round(totalCarbs), unit: "g", color: "text-yellow-500" },
          { label: "Lipides", value: Math.round(totalFats), unit: "g", color: "text-pink-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.unit}</p>
            <p className="text-sm font-medium mt-1 text-gray-700">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Repas du jour */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Repas du jour</h2>
        <Link
          href="/dashboard/journal"
          className="text-sm px-4 py-2 rounded-full text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
        >
          + Ajouter un repas
        </Link>
      </div>

      {meals.length === 0 ? (
        <div className="bg-[#e8f0e9] rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🥦</p>
          <p className="text-gray-600">Aucun repas enregistré aujourd&apos;hui.</p>
          <Link
            href="/dashboard/journal"
            className="inline-block mt-4 text-sm font-medium text-[#5a8a5e] hover:underline"
          >
            Enregistrer mon premier repas →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold mb-3">{MEAL_LABELS[meal.mealType] ?? meal.mealType}</h3>
              <div className="space-y-2">
                {meal.foodItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} ({item.quantity}{item.unit})</span>
                    <span className="text-gray-400">{Math.round(item.calories)} kcal</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                Total : {Math.round(meal.foodItems.reduce((s, f) => s + f.calories, 0))} kcal
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link href="/dashboard/journal" className="text-sm text-[#5a8a5e] hover:underline">
          Voir mon journal complet →
        </Link>
      </div>
    </div>
  );
}
