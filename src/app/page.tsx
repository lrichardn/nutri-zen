import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

async function getHeroImageUrl(): Promise<string | null> {
  const setting = await db.siteSetting.findUnique({ where: { key: "heroImageUrl" } });
  return setting?.value || null;
}

export default async function HomePage() {
  const heroImageUrl = await getHeroImageUrl();

  return (
    <div>
      {/* Hero texte */}
      <section
        className="relative py-28 px-4 text-white text-center"
        style={!heroImageUrl ? { background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)" } : undefined}
      >
        {heroImageUrl && (
          <>
            <div className="absolute -top-8 -bottom-8 left-0 right-0">
              <Image
                src={heroImageUrl}
                alt="Nutri'Zen"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -top-8 -bottom-8 left-0 right-0 bg-black/45" />
          </>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Votre santé commence dans votre assiette
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Ici vous découvrirez des conseils en nutrition et rééquilibrage alimentaire pour une alimentation équilibrée et personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="px-8 py-3 rounded-full font-semibold text-white border-2 border-white hover:bg-white hover:text-[#3d6b41] transition-colors"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/recettes"
              className="px-8 py-3 rounded-full font-semibold bg-white text-[#3d6b41] hover:bg-opacity-90 transition-colors"
            >
              Découvrir les recettes
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#3d6b41]">
            Mes prestations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold mb-2">Première consultation</h3>
              <p className="text-gray-500 text-sm mb-4">1h30</p>
              <p className="text-gray-600 mb-6">
                Un bilan complet de vos habitudes alimentaires pour établir un programme personnalisé adapté à vos objectifs.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#5a8a5e]">60 €</span>
                <Link
                  href="/reservation"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
                >
                  Réserver
                </Link>
              </div>
            </div>

            <div className="rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Suivi nutritionnel</h3>
              <p className="text-gray-500 text-sm mb-4">1h</p>
              <p className="text-gray-600 mb-6">
                Un accompagnement régulier pour ajuster votre programme, répondre à vos questions et maintenir vos progrès.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#5a8a5e]">50 €</span>
                <Link
                  href="/reservation"
                  className="px-5 py-2 rounded-full text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="py-20 px-4 bg-[#e8f0e9]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#3d6b41]">
            Pourquoi Nutri&apos;Zen ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "🥗", title: "Approche personnalisée", desc: "Chaque programme est adapté à votre profil, vos goûts et vos objectifs." },
              { icon: "📊", title: "Suivi régulier", desc: "Suivez vos repas et votre progression depuis votre espace personnel." },
              { icon: "💚", title: "Sans privation", desc: "Rééquilibrez votre alimentation sans frustration ni régimes stricts." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-[#3d6b41]">
            Prêt(e) à commencer ?
          </h2>
          <p className="text-gray-600 mb-8">
            Créez votre espace personnel pour suivre vos repas au quotidien, ou prenez directement rendez-vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inscription"
              className="px-8 py-3 rounded-full font-semibold text-white bg-[#5a8a5e] hover:bg-[#3d6b41] transition-colors"
            >
              Créer mon espace
            </Link>
            <Link
              href="/reservation"
              className="px-8 py-3 rounded-full font-semibold border-2 border-[#5a8a5e] text-[#5a8a5e] hover:bg-[#e8f0e9] transition-colors"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
