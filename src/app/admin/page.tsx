import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalClients, pendingAppointments, totalRecipes, totalArticles] = await Promise.all([
    db.user.count({ where: { role: "CLIENT" } }),
    db.appointment.count({ where: { status: "PENDING" } }),
    db.recipe.count(),
    db.article.count(),
  ]);

  const recentAppointments = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Confirmé", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-800" },
  };

  const TYPE_LABELS: Record<string, string> = {
    FIRST_CONSULTATION: "1ère consultation",
    FOLLOW_UP: "Suivi",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Clients inscrits", value: totalClients, icon: "👥", href: "/admin/clients" },
          { label: "Réservations en attente", value: pendingAppointments, icon: "📅", href: "/admin/reservations" },
          { label: "Recettes", value: totalRecipes, icon: "🥗", href: "/admin/recettes" },
          { label: "Articles", value: totalArticles, icon: "📖", href: "/admin/articles" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Dernières réservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Dernières réservations</h2>
          <Link href="/admin/reservations" className="text-sm text-[#5a8a5e] hover:underline">
            Voir tout →
          </Link>
        </div>
        {recentAppointments.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">Aucune réservation pour l&apos;instant.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Date demande</th>
                <th className="px-6 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentAppointments.map((apt) => {
                const s = STATUS_LABELS[apt.status] ?? { label: apt.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{apt.name}<br /><span className="text-gray-400 font-normal">{apt.email}</span></td>
                    <td className="px-6 py-4 text-gray-600">{TYPE_LABELS[apt.type] ?? apt.type}</td>
                    <td className="px-6 py-4 text-gray-500">{apt.createdAt.toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
