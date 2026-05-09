import { db } from "@/lib/db";

export default async function ClientsAdmin() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { mealEntries: true, appointments: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <span className="text-sm text-gray-500">{users.length} compte{users.length > 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rôle</th>
              <th className="px-6 py-3 text-left">Repas</th>
              <th className="px-6 py-3 text-left">RDV</th>
              <th className="px-6 py-3 text-left">Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{user.name ?? "—"}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user._count.mealEntries}</td>
                <td className="px-6 py-4 text-gray-500">{user._count.appointments}</td>
                <td className="px-6 py-4 text-gray-500">
                  {user.createdAt.toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">Aucun compte inscrit.</div>
        )}
      </div>
    </div>
  );
}
