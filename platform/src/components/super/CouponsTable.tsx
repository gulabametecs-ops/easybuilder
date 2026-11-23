"use client";

import { useTransition } from "react";
import { Trash2, Power } from "lucide-react";
import { toggleCoupon, deleteCoupon } from "@/lib/actions/coupons";
import { Pill, tbl, thead, th, tbody, tr, td, type Tone } from "@/components/super/kit";

type Coupon = { id: string; code: string; percentOff: number; active: boolean; maxUses: number; usedCount: number; expiresAt: Date | null; state: string };
const TONE: Record<string, Tone> = { active: "green", off: "slate", expired: "amber", "used up": "violet" };

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [pending, start] = useTransition();
  return (
    <div className={`overflow-x-auto ${pending ? "opacity-60" : ""}`}>
      <table className={tbl}>
        <thead className={thead}>
          <tr><th className={th}>Code</th><th className={th}>Discount</th><th className={th}>Usage</th><th className={th}>Expires</th><th className={th}>Status</th><th className={th}></th></tr>
        </thead>
        <tbody className={tbody}>
          {coupons.map((c) => (
            <tr key={c.id} className={tr}>
              <td className={td}>
                <span className="inline-flex items-center rounded-lg border border-dashed border-lime-400 bg-lime-500/5 px-2.5 py-1 font-mono text-sm font-bold tracking-wide text-lime-700 dark:text-lime-300">{c.code}</span>
              </td>
              <td className={`${td} whitespace-nowrap font-bold text-slate-900 dark:text-white`}>{c.percentOff}% off</td>
              <td className={td}>
                <span className="whitespace-nowrap">{c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : " used"}</span>
                {c.maxUses > 0 && (
                  <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2563ff] to-[#7c3aed]" style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }} />
                  </div>
                )}
              </td>
              <td className={`${td} whitespace-nowrap`}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never"}</td>
              <td className={td}><Pill tone={TONE[c.state] ?? "slate"}>{c.state}</Pill></td>
              <td className={td}>
                <div className="flex justify-end gap-2">
                  <button onClick={() => start(() => toggleCoupon(c.id))} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-lime-400 hover:text-lime-600 dark:border-white/10 dark:text-slate-300" title={c.active ? "Turn off" : "Turn on"} aria-label={c.active ? "Turn off" : "Turn on"}><Power className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete coupon?")) start(() => deleteCoupon(c.id)); }} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10" title="Delete" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
