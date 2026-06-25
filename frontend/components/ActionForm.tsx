"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Send } from "lucide-react";

const options = [
  { value: "RECICLAJE", label: "Reciclaje" },
  { value: "BICICLETA", label: "Bicicleta" },
  { value: "ENERGIA_SOLAR", label: "Energia Solar" },
  { value: "COMPOSTAJE", label: "Compostaje" },
  { value: "TRANSPORTE_PUBLICO", label: "Transporte Publico" }
];

export function ActionForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const acceptedTypes = useMemo(() => ["image/jpeg", "image/png", "image/webp"], []);

  async function submit(formData: FormData) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "No se pudo registrar la accion.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    setPreview(null);

    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setError("La evidencia debe ser JPG, PNG o WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen no puede superar 10 MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div>
          <label className="text-sm font-medium text-slate-700">Tipo de accion</label>
          <select name="type" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-eco-500">
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Cantidad</label>
          <input name="amount" type="number" min="0.01" step="0.01" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Descripcion</label>
          <textarea name="description" required rows={6} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
        </div>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Validar y tokenizar
        </button>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 shadow-soft">
        <label className="flex h-full min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-50 p-4 text-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Vista previa de evidencia" className="h-full max-h-[420px] w-full rounded-lg object-cover" />
          ) : (
            <>
              <ImagePlus className="h-10 w-10 text-eco-600" />
              <span className="mt-4 text-sm font-semibold text-slate-950">Subir evidencia fotografica</span>
              <span className="mt-1 text-sm text-slate-500">JPG, PNG o WEBP hasta 10 MB</span>
            </>
          )}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="sr-only" />
        </label>
      </div>
    </form>
  );
}
