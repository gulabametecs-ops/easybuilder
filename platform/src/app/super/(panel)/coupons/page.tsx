import { CheckCircle2, Clock, Plus, Repeat, Ticket } from "lucide-react";
import { db } from "@/lib/db";
import { createCoupon } from "@/lib/actions/coupons";
import { PageHeader, Card, EmptyState, btnPrimary } from "@/components/admin/ui";
import { CouponsTable } from "@/components/super/CouponsTable";
import { FilterBar } from "@/components/super/FilterBar";
import { Kpi } from "@/components/super/kit";

export const metadata = { title: "Coupons" };

const STATUS = ["active", "off", "expired", "used up"];
const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const label = "mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400";

export default async function CouponsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const status = STATUS.find((s) => s === sp.status);
  const q = sp.q?.trim().toUpperCase();
  const all = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  const now = new Date();
  const stateOf = (c: (typeof all)[number]) =>
    c.expiresAt && c.expiresAt < now ? "expired" : c.maxUses > 0 && c.usedCount >= c.maxUses ? "used up" : c.active ? "active" : "off";
  // ponytail: filtered in memory — coupon lists are small.
  const coupons = all.filter((c) => (!q || c.code.includes(q)) && (!status || stateOf(c) === status));
  const live = all.filter((c) => stateOf(c) === "active").length;
  const uses = all.reduce((n, c) => n + c.usedCount, 0);
  const expired = all.filter((c) => stateOf(c) === "expired").length;

  return (
    <>
      <PageHeader title="Coupons" subtitle="Discount codes for the checkout." icon={<Ticket />} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Coupons" value={all.length} icon={<Ticket />} tone="blue" />
        <Kpi label="Live now" value={live} hint="Active, valid and not used up" icon={<CheckCircle2 />} tone="green" href="/super/coupons?status=active" />
        <Kpi label="Redemptions" value={uses} hint="Total times used" icon={<Repeat />} tone="violet" />
        <Kpi label="Expired" value={expired} icon={<Clock />} tone="amber" href="/super/coupons?status=expired" />
      </div>

      <Card className="relative mb-6 overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 admin-grad" aria-hidden />
        <p className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="admin-grad inline-flex h-8 w-8 items-center justify-center rounded-lg"><Plus className="h-4 w-4" /></span> Create a coupon
        </p>
        <form action={createCoupon} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block"><span className={label}>Code</span><input name="code" required placeholder="WELCOME20" className={`${input} font-mono uppercase`} /></label>
          <label className="block"><span className={label}>% off</span><input name="percentOff" type="number" min="1" max="100" required placeholder="20" className={input} /></label>
          <label className="block"><span className={label}>Max uses (0 = ∞)</span><input name="maxUses" type="number" min="0" defaultValue="0" className={input} /></label>
          <label className="block"><span className={label}>Expires (optional)</span><input name="expiresAt" type="date" className={input} /></label>
          <button className={`${btnPrimary} h-[42px]`}><Plus className="h-4 w-4" /> Create</button>
        </form>
      </Card>

      <FilterBar
        q={sp.q}
        placeholder="Search code…"
        selects={[{ name: "status", label: "Status", value: status, options: STATUS.map((s) => ({ value: s, label: s })) }]}
      />
      <Card className="overflow-hidden">
        {coupons.length === 0
          ? <EmptyState icon={<Ticket />} title={all.length ? "No matching coupons" : "No coupons yet"} hint={all.length ? "Try clearing the filters." : "Create your first discount code above."} />
          : <CouponsTable coupons={coupons.map((c) => ({ ...c, state: stateOf(c) }))} />}
      </Card>
    </>
  );
}
