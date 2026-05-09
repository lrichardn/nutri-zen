import { db } from "@/lib/db";
import AppointmentActions from "./AppointmentActions";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-800" },
};

const TYPE_LABELS: Record<string, string> = {
  FIRST_CONSULTATION: "1ère consultation (1h30 — 60€)",
  FOLLOW_UP: "Suivi nutritionnel (1h — 50€)",
};

export default async function ReservationsAdmin() {
  const appointments = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
        <span className="text-sm text-gray-500">{appointments.length} demande{appointments.length > 1 ? "s" : ""}</span>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
          Aucune demande de réservation pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const s = STATUS_LABELS[apt.status] ?? { label: apt.status, color: "bg-gray-100 text-gray-600" };
            return (
              <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{apt.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{apt.email}{apt.phone ? ` — ${apt.phone}` : ""}</p>
                    <p className="text-sm text-[#5a8a5e] font-medium mb-2">{TYPE_LABELS[apt.type] ?? apt.type}</p>
                    {apt.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 italic">&ldquo;{apt.message}&rdquo;</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Reçu le {apt.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <AppointmentActions id={apt.id} currentStatus={apt.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
