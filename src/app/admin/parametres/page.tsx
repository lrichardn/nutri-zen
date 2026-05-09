"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageEditor from "@/components/admin/ImageEditor";

export default function ParametresPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [heroUrl, setHeroUrl]     = useState<string | null>(null);
  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setHeroUrl(data.heroImageUrl ?? null));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditorSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleEditorDone(blob: Blob) {
    setEditorSrc(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, "hero.jpg");
    const res = await fetch("/api/upload?folder=settings", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) { setError("Erreur lors de l'upload."); return; }
    const { url } = await res.json();
    setHeroUrl(url);
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImageUrl: heroUrl ?? "" }),
    });
    setSaving(false);
    if (!res.ok) { setError("Erreur lors de la sauvegarde."); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <>
      {editorSrc && (
        <ImageEditor
          src={editorSrc}
          onDone={handleEditorDone}
          onCancel={() => setEditorSrc(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-8">Paramètres du site</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <h2 className="font-semibold text-gray-700 mb-1">Image d&apos;accueil</h2>
        <p className="text-sm text-gray-400 mb-5">
          Bandeau pleine largeur affiché sous le titre de la page d&apos;accueil.
          Format recommandé : paysage 16:9 ou plus large.
        </p>

        {/* Aperçu */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-full h-48 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5a8a5e] overflow-hidden cursor-pointer transition-colors bg-gray-50 mb-4 flex items-center justify-center"
        >
          {heroUrl ? (
            <Image src={heroUrl} alt="Image d'accueil" fill className="object-cover" />
          ) : uploading ? (
            <p className="text-sm text-gray-400">Upload en cours…</p>
          ) : (
            <div className="text-center">
              <p className="text-3xl mb-2">🖼️</p>
              <p className="text-sm text-gray-400">Cliquer pour choisir une image</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Upload…" : heroUrl ? "Changer l'image" : "Choisir une image"}
          </button>
          {heroUrl && !uploading && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 text-sm rounded-xl border border-[#5a8a5e] text-[#5a8a5e] hover:bg-[#e8f0e9] transition-colors"
            >
              ✂ Recadrer / Ajuster
            </button>
          )}
          {heroUrl && (
            <button
              type="button"
              onClick={() => setHeroUrl(null)}
              className="px-4 py-2 text-sm rounded-xl text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">Enregistré ✓</p>}

        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="px-6 py-2.5 rounded-full font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}
