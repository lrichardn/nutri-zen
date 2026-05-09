"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
          Nutri&apos;Zen
        </Link>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-600" />
        </button>

        <nav
          className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none gap-1 md:gap-6 p-4 md:p-0 items-start md:items-center`}
        >
          <Link href="/" className="text-gray-700 hover:text-[--primary] font-medium transition-colors">Accueil</Link>
          <Link href="/zoom-sur" className="text-gray-700 hover:text-[--primary] font-medium transition-colors">Zoom Sur...</Link>
          <Link href="/recettes" className="text-gray-700 hover:text-[--primary] font-medium transition-colors">Coin Recettes</Link>
          <Link href="/reservation" className="text-gray-700 hover:text-[--primary] font-medium transition-colors">Réservation</Link>

          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-[--primary] font-medium transition-colors">Mon espace</Link>
              <button
                onClick={() => signOut()}
                className="text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              className="text-sm px-4 py-2 rounded-full text-white transition-colors"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Mon espace
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
