"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMedia } from "@/lib/actions/storage";

export function DeleteMediaButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      title="Delete file"
      onClick={() => {
        if (!confirm("Delete this file permanently?")) return;
        start(async () => { const r = await deleteMedia(id); if (r?.error) alert(r.error); });
      }}
      className="p-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
