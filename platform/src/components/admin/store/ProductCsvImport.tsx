"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, FileUp, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { csvObjects, toCsv } from "@/lib/csv";
import { csvToProducts, PRODUCT_CSV_HEADER, type ImportDraft } from "@/lib/productCsv";
import { importProducts } from "@/lib/actions/storeCatalogAdmin";
import { inr } from "@/lib/store";
import { Card, PageHeader, btnPrimary, btnSecondary, Badge } from "../ui";

const SAMPLE = toCsv(PRODUCT_CSV_HEADER, [
  ["cotton-kurta", "Cotton Kurta", "KUR-01", "Women", 899, 1299, "", "Soft cotton kurta.", "", "cotton, festive", "New", "yes", "no", "yes", "no", 300, "6204", 5, "", "", "Size", "S", "Colour", "Blue", "", "", "KUR-01-S-BL", "", "", 5, ""],
  ["cotton-kurta", "Cotton Kurta", "KUR-01", "Women", 899, 1299, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Size", "M", "Colour", "Blue", "", "", "KUR-01-M-BL", 949, "", 8, ""],
  ["steel-bottle", "Steel Water Bottle", "BOT-1L", "Kitchen", 499, 699, 40, "1 litre, leak-proof.", "", "", "", "yes", "no", "yes", "no", 350, "7323", 18, "", "", "", "", "", "", "", "", "", "", "", "", ""],
]);

export function ProductCsvImport({ onClose }: { onClose: () => void }) {
  const [pending, start] = useTransition();
  const [file, setFile] = useState("");
  const [parsed, setParsed] = useState<{ drafts: ImportDraft[]; errors: string[] } | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);
  const [error, setError] = useState("");

  const onFile = async (f: File | undefined) => {
    setResult(null);
    setError("");
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setError("CSV must be under 5 MB.");
    setFile(f.name);
    const p = csvToProducts(csvObjects(await f.text()));
    if (!p.drafts.length && !p.errors.length) p.errors.push("No product rows found — check the header row matches the template.");
    setParsed(p);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + SAMPLE], { type: "text/csv;charset=utf-8" }));
    a.download = "products-template.csv";
    a.click();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-lime-600"><ArrowLeft className="w-4 h-4" /> All products</button>
      <PageHeader icon={<FileUp />} title="Import products" subtitle="Upload a CSV to add or update products. Rows are matched by SKU, then by handle (URL slug)." action={<button type="button" onClick={download} className={btnSecondary}><Download className="w-4 h-4" /> Template</button>} />

      <Card className="p-4 sm:p-6 space-y-3">
        <label className="block rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-lime-400 p-8 text-center cursor-pointer">
          <FileUp className="w-7 h-7 mx-auto text-slate-400" />
          <span className="block mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{file || "Choose a .csv file"}</span>
          <span className="block text-xs text-slate-400 mt-1">One row per product, or one row per variant (same handle, option1/option2 columns). Images: links separated by |</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
      </Card>

      {parsed && !result && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Preview · {parsed.drafts.length} product{parsed.drafts.length === 1 ? "" : "s"}</p>
            <button
              type="button" disabled={pending || !parsed.drafts.length} className={btnPrimary}
              onClick={() => start(async () => {
                const r = await importProducts(parsed.drafts).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "Import failed" }));
                if (r.ok) setResult(r);
                else setError(r.error);
              })}
            >
              {pending ? "Importing…" : `Import ${parsed.drafts.length} products`}
            </button>
          </div>
          {parsed.errors.length > 0 && (
            <ul className="px-4 py-3 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs space-y-1">
              {parsed.errors.slice(0, 20).map((e) => <li key={e} className="flex gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{e} (skipped)</li>)}
            </ul>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 text-left"><tr><th className="px-4 py-2">Product</th><th className="px-4 py-2">SKU</th><th className="px-4 py-2">Category</th><th className="px-4 py-2 text-right">Price</th><th className="px-4 py-2 text-right">Stock</th><th className="px-4 py-2">Variants</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {parsed.drafts.slice(0, 200).map((d) => (
                  <tr key={d.row}>
                    <td className="px-4 py-2"><p className="font-semibold text-slate-900 dark:text-white">{d.name}</p><p className="text-xs text-slate-400">{d.handle || "new"}{!d.published && " · draft"}</p></td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{d.sku || "—"}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{d.category || "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums font-semibold">{inr(d.price)}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{d.variants.length ? d.variants.reduce((n, v) => n + v.stock, 0) : d.stock}</td>
                    <td className="px-4 py-2">{d.variants.length ? <Badge tone="violet">{d.variants.length} · {d.options.map((o) => o.name).join(" × ")}</Badge> : <span className="text-xs text-slate-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {result && (
        <Card className="p-6 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="font-bold text-slate-900 dark:text-white">{result.created} created · {result.updated} updated</p>
          {result.errors.length > 0 && <ul className="text-xs text-rose-600 space-y-0.5">{result.errors.slice(0, 20).map((e) => <li key={e}>{e}</li>)}</ul>}
          <button type="button" onClick={onClose} className={btnPrimary}>Back to products</button>
        </Card>
      )}
    </div>
  );
}
