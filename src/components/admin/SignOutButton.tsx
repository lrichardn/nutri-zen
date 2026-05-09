"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 w-full px-5 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      <span>🚪</span>
      Déconnexion
    </button>
  );
}
