"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import ImageEditor from "./ImageEditor";

type ArticleData = { title: string; content: string; published: boolean; imageUrl: string | null };

export default function ArticleForm({ initial, id }: { initial?: Partial<ArticleData>; id?: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ArticleData>({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    published: initial?.published ?? false,
    imageUrl: initial?.imageUrl ?? null,
  });

  const [editorSrc, setEditorSrc]   = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // Ouvre l'éditeur dès qu'un fichier est sélectionné
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setEditorSrc(localUrl);
    e.target.value = "";          // reset pour pouvoir re-sélectionner le même fichier
  }

  // Reçoit le blob produit par l'éditeur, l'uploade, stocke l'URL
  async function handleEditorDone(blob: Blob) {
    setEditorSrc(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, "image.jpg");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'upload.");
      return;
    }
    const { url } = await res.json();
    setForm((f) => ({ ...f, imageUrl: url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(id ? `/api/admin/articles/${id}` : "/api/admin/articles", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) { setError("Une erreur est survenue."); return; }
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <>
      {/* Éditeur d'image — modal plein écran */}
      {editorSrc && (
        <ImageEditor
          src={editorSrc}
          onDone={handleEditorDone}
          onCancel={() => { setEditorSrc(null); }}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e]"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Image de l&apos;article</label>
          <div className="flex gap-4 items-start">
            {/* Aperçu */}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-40 h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#5a8a5e] flex items-center justify-center overflow-hidden cursor-pointer transition-colors shrink-0 bg-gray-50"
            >
              {form.imageUrl ? (
                <Image
                  src={form.imageUrl}
                  alt="Aperçu"
                  width={160}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : uploading ? (
                <span className="text-xs text-gray-400">Upload…</span>
              ) : (
                <div className="text-center p-2">
                  <p className="text-2xl mb-1">🖼️</p>
                  <p className="text-xs text-gray-400">Cliquer pour<br />choisir une image</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {uploading ? "Upload en cours…" : form.imageUrl ? "Changer l'image" : "Choisir une image"}
              </button>

              {form.imageUrl && !uploading && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 text-sm rounded-xl border border-[#5a8a5e] text-[#5a8a5e] hover:bg-[#e8f0e9] transition-colors"
                >
                  ✂ Recadrer / Ajuster
                </button>
              )}

              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
                  className="px-4 py-2 text-sm rounded-xl text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
                >
                  Supprimer l&apos;image
                </button>
              )}

              <p className="text-xs text-gray-400">JPG, PNG, WebP — max 5 Mo</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contenu *</label>
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Rédigez votre article ici..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5a8a5e] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 accent-[#5a8a5e]"
          />
          <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2.5 rounded-full font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors"
          >
            {loading ? "Enregistrement…" : id ? "Mettre à jour" : "Créer l'article"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </>
  );
}
