import AdminCalendar from "@/components/admin/AdminCalendar";

export default function DisponibilitesAdmin() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Disponibilités</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cliquez sur un jour pour ajouter ou supprimer des créneaux. Les créneaux réservés ne peuvent pas être supprimés.
        </p>
      </div>
      <AdminCalendar />
    </div>
  );
}
