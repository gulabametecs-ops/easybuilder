"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { BrandSpinner } from "@/components/BrandLogo";

// Submit button for plain `<form action={serverAction}>` forms: shows progress, then "Saved".
export function SaveBar({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  const [wasPending, setWasPending] = useState(false);
  const [saved, setSaved] = useState(false);
  // Adjust state during render when a submit finishes (no effect needed).
  if (pending !== wasPending) {
    setWasPending(pending);
    setSaved(!pending);
  }
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {saved && (
        <span role="status" className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <Check className="w-3.5 h-3.5" /> Saved
        </span>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-white font-semibold px-5 py-2.5 text-sm hover:bg-lime-600 disabled:opacity-60"
      >
        {pending && <BrandSpinner className="w-4 h-4" />}
        {pending ? "Saving…" : label}
      </button>
    </div>
  );
}
