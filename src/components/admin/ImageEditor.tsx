"use client";

import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import { getCroppedImg } from "@/lib/canvasUtils";

type Area = { x: number; y: number; width: number; height: number };

type Props = {
  src: string;
  onDone: (blob: Blob) => void;
  onCancel: () => void;
};

const ASPECTS = [
  { label: "Libre", value: 0 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

type Slider = { key: "brightness" | "contrast" | "saturation"; label: string; min: number; max: number; default: number };

const SLIDERS: Slider[] = [
  { key: "brightness", label: "Luminosité", min: 0, max: 200, default: 100 },
  { key: "contrast",   label: "Contraste",  min: 0, max: 200, default: 100 },
  { key: "saturation", label: "Saturation", min: 0, max: 200, default: 100 },
];

export default function ImageEditor({ src, onDone, onCancel }: Props) {
  const [crop, setCrop]                   = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                   = useState(1);
  const [aspect, setAspect]               = useState<number | undefined>(4 / 3);
  const [croppedArea, setCroppedArea]     = useState<Area | null>(null);
  const [filters, setFilters]             = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [applying, setApplying]           = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleApply() {
    if (!croppedArea) return;
    setApplying(true);
    const blob = await getCroppedImg(src, croppedArea, filters);
    setApplying(false);
    onDone(blob);
  }

  function resetFilters() {
    setFilters({ brightness: 100, contrast: 100, saturation: 100 });
  }

  const previewFilter = [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturation}%)`,
  ].join(" ");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Modifier l&apos;image</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Zone de recadrage */}
          <div className="relative flex-1 bg-gray-900" style={{ minHeight: 320 }}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { borderRadius: 0 },
                mediaStyle: { filter: previewFilter },
              }}
            />
          </div>

          {/* Panneau de contrôles */}
          <div className="w-full md:w-64 shrink-0 p-5 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-100 flex flex-col gap-6">

            {/* Ratio */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Format</p>
              <div className="flex flex-wrap gap-1.5">
                {ASPECTS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => setAspect(a.value === 0 ? undefined : a.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      (a.value === 0 ? aspect === undefined : aspect === a.value)
                        ? "bg-[#5a8a5e] text-white border-[#5a8a5e]"
                        : "border-gray-200 text-gray-600 hover:border-[#5a8a5e]"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Zoom</p>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#5a8a5e]"
              />
            </div>

            {/* Filtres */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ajustements</p>
                <button type="button" onClick={resetFilters} className="text-xs text-[#5a8a5e] hover:underline">
                  Réinitialiser
                </button>
              </div>
              <div className="space-y-4">
                {SLIDERS.map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{s.label}</span>
                      <span className="text-gray-400 tabular-nums">{filters[s.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={1}
                      value={filters[s.key]}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, [s.key]: Number(e.target.value) }))
                      }
                      className="w-full accent-[#5a8a5e]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-full border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="px-6 py-2 rounded-full text-sm font-medium text-white bg-[#5a8a5e] hover:bg-[#3d6b41] disabled:opacity-50 transition-colors"
          >
            {applying ? "Traitement..." : "Appliquer"}
          </button>
        </div>
      </div>
    </div>
  );
}
