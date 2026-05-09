"use client";

import { useEffect, useState, useCallback } from "react";

type Slot = { id: string; date: string; duration: number };

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const TYPE_OPTIONS = [
  { value: "FIRST_CONSULTATION", label: "Première consultation", price: "60 €", duration: 90 },
  { value: "FOLLOW_UP", label: "Suivi nutritionnel", price: "50 €", duration: 60 },
];

type Step = "calendar" | "form" | "success";

export default function ReservationCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<Step>("calendar");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", type: "FIRST_CONSULTATION" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(async () => {
    const res = await fetch(`/api/slots?year=${year}&month=${month}`);
    setSlots(await res.json());
  }, [year, month]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  function prevMonth() {
    setSelectedDay(null); setSelectedSlot(null);
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  }
  function nextMonth() {
    setSelectedDay(null); setSelectedSlot(null);
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function slotsForDay(day: number) {
    return slots.filter((s) => {
      const d = new Date(s.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  function selectDay(day: number) {
    const daySlots = slotsForDay(day);
    if (daySlots.length === 0) return;
    setSelectedDay(day);
    setSelectedSlot(null);
  }

  function selectSlot(slot: Slot) {
    setSelectedSlot(slot);
    // Auto-select consultation type based on slot duration
    const matchedType = slot.duration === 90 ? "FIRST_CONSULTATION" : "FOLLOW_UP";
    setForm(f => ({ ...f, type: matchedType }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setError(""); setLoading(true);
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slotId: selectedSlot.id }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    setStep("success");
  }

  // --- Success screen ---
  if (step === "success") {
    return (
      <div className="bg-[#e8f0e9] rounded-2xl p-12 text-center max-w-lg mx-auto">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-[#3d6b41] mb-2">Rendez-vous confirmé !</h2>
        <p className="text-gray-600 mb-2">
          Votre demande a bien été enregistrée pour le{" "}
          <strong>{new Date(selectedSlot!.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</strong>{" "}
          à <strong>{new Date(selectedSlot!.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</strong>.
        </p>
        <p className="text-gray-500 text-sm">Vous recevrez une confirmation par email.</p>
        <button onClick={() => { setStep("calendar"); setSelectedDay(null); setSelectedSlot(null); fetchSlots(); }}
          className="mt-6 px-6 py-2 rounded-full text-sm font-medium border border-[#5a8a5e] text-[#5a8a5e] hover:bg-white transition-colors">
          Retour
        </button>
      </div>
    );
  }

  // --- Form screen ---
  if (step === "form" && selectedSlot) {
    const slotDate = new Date(selectedSlot.date);
    const typeOption = TYPE_OPTIONS.find(t => t.value === form.type)!;
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={() => setStep("calendar")} className="text-sm text-[#5a8a5e] hover:underline mb-6 inline-block">
          ← Changer de créneau
        </button>

        <div className="bg-[#e8f0e9] rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="text-3xl">📅</div>
          <div>
            <p className="font-semibold text-[#3d6b41]">
              {slotDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-sm text-gray-600">
              {slotDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} — {selectedSlot.duration} min
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type de prestation */}
          <div>
            <label className="block text-sm font-medium mb-2">Type de prestation</label>
            <div className="grid grid-cols-2 gap-3">
              {TYPE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-colors ${form.type === opt.value ? "border-[#5a8a5e] bg-[#e8f0e9]" : "border-gray-200 hover:border-[#5a8a5e]"}`}>
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-gray-500">{opt.duration === 90 ? "1h30" : "1h"} — {opt.price}</p>
                </button>
              ))}
            </div>
            {selectedSlot.duration !== typeOption.duration && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠ Ce créneau est prévu pour {selectedSlot.duration} min — vérifiez votre choix.
              </p>
            )}
          </div>

          {[
            { name: "name", label: "Nom complet", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Téléphone (optionnel)", type: "tel", required: false },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input type={field.type} required={field.required}
                value={form[field.name as keyof typeof form] as string}
                onChange={(e) => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] transition-colors" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Message (optionnel)</label>
            <textarea rows={3} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Votre objectif ou vos questions..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors">
            {loading ? "Envoi en cours..." : "Confirmer le rendez-vous"}
          </button>
        </form>
      </div>
    );
  }

  // --- Calendar screen ---
  const daySlots = selectedDay ? slotsForDay(selectedDay) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Calendrier */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} disabled={year === today.getFullYear() && month === today.getMonth()}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors">‹</button>
          <h2 className="font-bold text-lg text-gray-800">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">›</button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const daySlotList = slotsForDay(day);
            const hasSlots = daySlotList.length > 0;
            const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isSelected = selectedDay === day;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                disabled={isPast || !hasSlots}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all
                  ${isPast || !hasSlots ? "text-gray-300 cursor-default" : "cursor-pointer"}
                  ${hasSlots && !isPast && !isSelected ? "hover:bg-[#e8f0e9] text-[#3d6b41] font-medium" : ""}
                  ${isSelected ? "bg-[#5a8a5e] text-white font-bold ring-2 ring-[#3d6b41]" : ""}
                  ${isToday && !isSelected ? "ring-1 ring-[#5a8a5e]" : ""}
                `}
              >
                {day}
                {hasSlots && !isPast && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-[#5a8a5e]"}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5a8a5e] inline-block" /> Créneaux disponibles
          </span>
        </div>
      </div>

      {/* Créneaux du jour sélectionné */}
      <div className="lg:col-span-2">
        {!selectedDay ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 h-full flex flex-col items-center justify-center">
            <p className="text-3xl mb-3">👆</p>
            <p className="text-sm">Sélectionnez un jour disponible pour voir les créneaux</p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">
              {selectedDay} {MONTHS[month]} {year}
            </h3>
            {daySlots.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucun créneau disponible ce jour.</p>
            ) : (
              <div className="space-y-3">
                {daySlots.map((slot) => {
                  const d = new Date(slot.date);
                  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                  const isChosen = selectedSlot?.id === slot.id;
                  const typeLabel = slot.duration === 90 ? "1ère consultation" : "Suivi nutritionnel";
                  return (
                    <button
                      key={slot.id}
                      onClick={() => selectSlot(slot)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                        isChosen
                          ? "border-[#5a8a5e] bg-[#e8f0e9]"
                          : "border-gray-100 bg-white hover:border-[#5a8a5e] hover:shadow-sm"
                      }`}
                    >
                      <p className="font-semibold text-gray-800">{time}</p>
                      <p className="text-sm text-gray-500">{slot.duration} min — {typeLabel}</p>
                    </button>
                  );
                })}

                {selectedSlot && (
                  <button
                    onClick={() => setStep("form")}
                    className="w-full mt-2 py-3 rounded-full font-semibold text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
                  >
                    Réserver ce créneau →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
