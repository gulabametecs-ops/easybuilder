"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportCsv } from "@/lib/actions/storeCatalogAdmin";
import { btnSecondary } from "../ui";

const LABEL = { products: "Export CSV", orders: "Export orders", customers: "Export customers" } as const;

export function CsvExportButton({ kind, label }: { kind: keyof typeof LABEL; label?: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={btnSecondary}
      onClick={() =>
        start(async () => {
          const r = await exportCsv(kind).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "Export failed" }));
          if (!r.ok) return alert(r.error);
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob(["﻿" + r.csv], { type: "text/csv;charset=utf-8" }));
          a.download = r.filename;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        })
      }
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {label ?? LABEL[kind]}
    </button>
  );
}
