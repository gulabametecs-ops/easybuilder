"use client";

import { useTransition } from "react";
import { Trash2, Power } from "lucide-react";
import { toggleCoupon, deleteCoupon } from "@/lib/actions/coupons";
import { Badge } from "@/components/admin/ui";

type Coupon = { id: string; code: string; percentOff: number; active: boolean; maxUses: number; usedCount: number; expiresAt: Date | null };

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [pending, start] = useTransition();
  return (
    <div className={pending ? "opacity-60" : ""}>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400 border-b border-slate-100">
          <tr><th className="p-4 font-medium">Code</th><th className="p-4 font-medium">Discount</th><th className="p-4 font-medium">Used</th><th className="p-4 font-medium">Expires</th><th className="p-4 font-medium">Status</th><th className="p-4"></th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {coupons.map((c) => (
            <tr key={c.id}>
              <td className="p-4 font-mono font-semibold text-slate-900">{c.code}</td>
              <td className="p-4 text-slate-600">{c.percentOff}% off</td>
              <td className="p-4 text-slate-600">{c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : ""}</td>
              <td className="p-4 text-slate-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
              <td className="p-4"><Badge tone={c.active ? "green" : "slate"}>{c.active ? "active" : "off"}</Badge></td>
              <td className="p-4 flex gap-2">
                <button onClick={() => start(() => toggleCoupon(c.id))} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Toggle"><Power className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete coupon?")) start(() => deleteCoupon(c.id)); }} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
