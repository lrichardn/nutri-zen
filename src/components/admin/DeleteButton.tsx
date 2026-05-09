"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id, endpoint, label = "Supprimer" }: { id: string; endpoint: string; label?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex gap-2">
        <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:underline text-xs">
          {loading ? "..." : "Confirmer"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:underline text-xs">Annuler</button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-red-400 hover:text-red-600 hover:underline">
      {label}
    </button>
  );
}
