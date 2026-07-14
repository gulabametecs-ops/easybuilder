import { db } from "@/lib/db";
import { createCoupon } from "@/lib/actions/coupons";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { CouponsTable } from "@/components/super/CouponsTable";

export const metadata = { title: "Coupons" };

export default async function CouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Coupons" subtitle="Discount codes for the checkout." />

      <Card className="p-5 mb-6">
        <p className="font-medium text-slate-900 mb-3">Create a coupon</p>
        <form action={createCoupon} className="grid sm:grid-cols-5 gap-3 items-end">
          <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Code</span><input name="code" required placeholder="WELCOME20" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase" /></label>
          <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">% off</span><input name="percentOff" type="number" min="1" max="100" required placeholder="20" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Max uses (0 = ∞)</span><input name="maxUses" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="block text-xs font-medium text-slate-500 mb-1">Expires (optional)</span><input name="expiresAt" type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></label>
          <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 hover:bg-slate-800">Create</button>
        </form>
      </Card>

      <Card>
        {coupons.length === 0 ? <EmptyState title="No coupons yet" hint="Create your first discount code above." /> : <CouponsTable coupons={coupons} />}
      </Card>
    </>
  );
}
