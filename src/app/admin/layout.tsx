import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/reservations", label: "Réservations", icon: "📅" },
  { href: "/admin/disponibilites", label: "Disponibilités", icon: "🗓️" },
  { href: "/admin/recettes", label: "Recettes", icon: "🥗" },
  { href: "/admin/articles", label: "Articles", icon: "📖" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1a2e1b] text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Administration</p>
          <p className="font-bold text-[#a8d5ab]">Nutri&apos;Zen</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
