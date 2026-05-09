"use client";

import { useEffect, useState, useCallback } from "react";

type Slot = {
  id: string;
  date: string;
  duration: number;
  booked: boolean;
  appointment: { name: string; email: string; type: string } | null;
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const HOURS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

export default function AdminCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newTime, setNewTime] = useState("09:00");
  const [newDuration, setNewDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    const res = await fetch(`/api/admin/slots?year=${year}&month=${month}`);
    const all = await res.json();
    setSlots(all.filter((s: Slot) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }));
  }, [year, month]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  async function addSlot() {
    if (!selectedDay) return;
    setLoading(true);
    const [h, m] = newTime.split(":").map(Number);
    const date = new Date(year, month, selectedDay, h, m);
    await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: date.toISOString(), duration: newDuration }),
    });
    setLoading(false);
    fetchSlots();
  }

  async function deleteSlot(id: string) {
    await fetch(`/api/admin/slots/${id}`, { method: "DELETE" });
    fetchSlots();
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1;   // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function slotsForDay(day: number) {
    return slots.filter((s) => new Date(s.date).getDate() === day);
  }

  const daySlots = selectedDay ? slotsForDay(selectedDay) : [];

  const TYPE_LABELS: Record<string, string> = {
    FIRST_CONSULTATION: "1ère consultation",
    FOLLOW_UP: "Suivi",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendrier */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">‹</button>
          <h2 className="font-bold text-lg text-gray-800">{MONTHS[month]} {year}</h2>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">›</button>
        </div>

        {/* En-têtes jours */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const daySlotList = slotsForDay(day);
            const booked = daySlotList.filter(s => s.booked).length;
            const free = daySlotList.filter(s => !s.booked).length;
            const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isSelected = selectedDay === day;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                disabled={isPast}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all
                  ${isPast ? "text-gray-300 cursor-default" : "cursor-pointer hover:bg-gray-50"}
                  ${isSelected ? "ring-2 ring-[#5a8a5e] bg-[#e8f0e9]" : ""}
                  ${isToday && !isSelected ? "font-bold text-[#5a8a5e]" : ""}
                `}
              >
                <span>{day}</span>
                {daySlotList.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {free > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#5a8a5e]" />}
                    {booked > 0 && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Légende */}
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5a8a5e] inline-block" /> Disponible</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Réservé</span>
        </div>
      </div>

      {/* Panneau latéral */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {!selectedDay ? (
          <div className="text-center text-gray-400 py-10">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-sm">Sélectionnez un jour pour gérer ses créneaux</p>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-gray-800 mb-4">
              {selectedDay} {MONTHS[month]} {year}
            </h3>

            {/* Créneaux existants */}
            {daySlots.length === 0 ? (
              <p className="text-sm text-gray-400 mb-6">Aucun créneau ce jour.</p>
            ) : (
              <div className="space-y-2 mb-6">
                {daySlots.map((slot) => {
                  const d = new Date(slot.date);
                  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={slot.id} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${slot.booked ? "bg-orange-50 border border-orange-100" : "bg-[#e8f0e9]"}`}>
                      <div>
                        <span className="font-medium">{time}</span>
                        <span className="text-gray-500 ml-2">{slot.duration} min</span>
                        {slot.booked && slot.appointment && (
                          <p className="text-xs text-orange-600 mt-0.5">
                            {slot.appointment.name} — {TYPE_LABELS[slot.appointment.type] ?? slot.appointment.type}
                          </p>
                        )}
                      </div>
                      {!slot.booked && (
                        <button onClick={() => deleteSlot(slot.id)} className="text-red-400 hover:text-red-600 ml-2 text-xs">✕</button>
                      )}
                      {slot.booked && <span className="text-xs text-orange-500 ml-2">Réservé</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Ajouter un créneau */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Ajouter un créneau</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Heure</label>
                  <select value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white">
                    {HOURS.map((h) => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Durée</label>
                  <select value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5a8a5e] bg-white">
                    <option value={60}>1h — Suivi nutritionnel</option>
                    <option value={90}>1h30 — 1ère consultation</option>
                  </select>
                </div>
                <button onClick={addSlot} disabled={loading}
                  className="w-full py-2 rounded-xl text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors">
                  {loading ? "Ajout..." : "+ Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
