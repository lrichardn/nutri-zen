export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">Nutri&apos;Zen</h3>
          <p className="text-sm">Conseils en nutrition et rééquilibrage alimentaire pour une alimentation équilibrée et personnalisée.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
            <li><a href="/zoom-sur" className="hover:text-white transition-colors">Zoom Sur...</a></li>
            <li><a href="/recettes" className="hover:text-white transition-colors">Coin Recettes</a></li>
            <li><a href="/reservation" className="hover:text-white transition-colors">Réservation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>06 79 16 75 59</li>
            <li>nutrizen@gmail.com</li>
            <li>311 ch. de la Truque<br />30250 VILLEVIEILLE</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Nutri&apos;Zen — Tous droits réservés
      </div>
    </footer>
  );
}
