"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { describeSelection, isColorGroup, swatchOf, type ServiceOption } from "@/lib/serviceOptions";
import { SERVICE_IMAGE_EVENT } from "./ServiceImage";
import { waLink } from "@/lib/whatsapp";

// Service / product detail sidebar: pick variety (size, colour…) → enquiry form or WhatsApp carries the choice.
export function ServiceEnquiry({
  title, category, options, ctaHref, ctaLabel, phone, waNum,
}: {
  title: string; category: string; options: ServiceOption[];
  ctaHref: string; ctaLabel: string; phone?: string; waNum: string;
}) {
  const [sel, setSel] = useState<Record<string, string>>({});
  // Pick / unpick a value; if any picked value has its own photo, show it on the left (last group with a photo wins).
  const pick = (g: ServiceOption, v: string) => {
    const next = { ...sel, [g.name]: sel[g.name] === v ? "" : v };
    setSel(next);
    const photo = [...options].reverse().map((o) => (next[o.name] ? o.images?.[next[o.name]] : "")).find(Boolean) ?? "";
    window.dispatchEvent(new CustomEvent(SERVICE_IMAGE_EVENT, { detail: photo }));
  };
  const chosen = describeSelection(sel);
  const q = new URLSearchParams({ service: title, ...(chosen ? { opts: chosen } : {}) });
  const formHref = `${ctaHref}${ctaHref.includes("?") ? "&" : "?"}${q}`;
  const waText = `Hi, I'm interested in "${title}" (${category}) from your website.${chosen ? `\nSelected: ${chosen}` : ""}\nPlease share details and a quotation.`;

  return (
    <>
      {options.map((g) => (
        <div key={g.name} className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {g.name}{sel[g.name] ? <span className="normal-case tracking-normal font-medium text-slate-700">: {sel[g.name]}</span> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {g.values.map((v) => {
              const on = sel[g.name] === v;
              const sw = isColorGroup(g) ? swatchOf(g, v) : "";
              if (sw) {
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={on}
                    aria-label={v}
                    title={v}
                    onClick={() => pick(g, v)}
                    className={`w-9 h-9 rounded-full border border-black/10 shadow-sm transition ${on ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"}`}
                    style={{ background: sw }}
                  />
                );
              }
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(g, v)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium tabular-nums transition ${on ? "border-primary bg-primary text-white" : "border-slate-300 bg-white text-slate-700 hover:border-primary"}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <Link href={formHref} className="btn-primary mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold"><Icon name="edit" className="w-4 h-4" /> {ctaLabel}</Link>
      {waNum && (
        <a href={waLink(waNum, waText)} target="_blank" rel="noopener noreferrer" className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 font-semibold text-white hover:bg-[#1ebe5b]">
          <Icon name="whatsapp" className="w-4 h-4" /> Enquire on WhatsApp
        </a>
      )}
      {phone && <a href={`tel:${phone}`} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"><Icon name="phone" className="w-4 h-4 text-primary" /> {phone}</a>}
    </>
  );
}
