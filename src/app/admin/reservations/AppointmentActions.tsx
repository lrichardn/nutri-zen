"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppointmentActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2 shrink-0">
      {currentStatus !== "CONFIRMED" && (
        <button
          onClick={() => updateStatus("CONFIRMED")}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          Confirmer
        </button>
      )}
      {currentStatus !== "CANCELLED" && (
        <button
          onClick={() => updateStatus("CANCELLED")}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          Annuler
        </button>
      )}
      {currentStatus !== "PENDING" && (
        <button
          onClick={() => updateStatus("PENDING")}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 transition-colors"
        >
          En attente
        </button>
      )}
    </div>
  );
}
