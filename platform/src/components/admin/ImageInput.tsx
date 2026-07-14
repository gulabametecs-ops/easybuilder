"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

const MAX_BYTES = 2 * 1024 * 1024;

// Reusable image field: upload a file (≤2MB) OR paste a URL. Submits the final
// URL via a hidden input named `name`, so it works inside any <form>.
export function ImageInput({
  name,
  label,
  defaultValue = "",
  value,
  onChange,
  aspect = "aspect-video",
}: {
  name?: string; // when set, submits the URL via a hidden input (form mode)
  label?: string;
  defaultValue?: string;
  value?: string; // controlled mode
  onChange?: (url: string) => void; // controlled mode
  aspect?: string;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const url = value !== undefined ? value : internal;
  const setUrl = (u: string) => {
    if (value === undefined) setInternal(u);
    onChange?.(u);
  };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > MAX_BYTES) {
      setError("Image must be 2MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <span className="block text-sm font-medium text-slate-600 mb-1">{label}</span>}
      {name && <input type="hidden" name={name} value={url} />}

      <div className="flex items-start gap-3">
        <div className={`w-28 shrink-0 ${aspect} rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
          {url && (
            <button type="button" onClick={() => setUrl("")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow" title="Remove">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {busy ? "Uploading..." : "Upload image"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 outline-none focus:border-lime-500"
          />
          <p className="text-xs text-slate-400">JPG, PNG, WEBP, GIF or SVG · max 2MB</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
