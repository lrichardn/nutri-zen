import ReservationCalendar from "@/components/vitrine/ReservationCalendar";

export default function ReservationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3 text-[#3d6b41]">Réservation en ligne</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Choisissez un créneau disponible dans le calendrier ci-dessous.
      </p>
      <ReservationCalendar />
    </div>
  );
}
