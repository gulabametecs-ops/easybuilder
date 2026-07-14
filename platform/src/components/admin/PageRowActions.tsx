"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePage } from "@/lib/actions/content";

export function DeletePageButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => { if (confirm("Delete this page? This cannot be undone.")) start(() => deletePage(id)); }}
      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
      title="Delete page"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
