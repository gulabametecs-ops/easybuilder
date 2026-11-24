import Link from "next/link";
import { ArrowRight, Globe, IndianRupee, ShoppingBag, Package, AlertTriangle, TrendingUp, Plus, Store, Palette, Eye, UserRound, ShoppingCart, TicketPercent, CreditCard } from "lucide-react";
import { db } from "@/lib/db";
import { demoVisibleWhere } from "@/lib/demoSession";
import { adminOrders } from "@/lib/storeAdmin";
import { getStoreSettings } from "@/lib/storeServer";
import { lastDays } from "@/lib/analytics";
import { inr, orderLabel, PAYMENT_LABEL } from "@/lib/store";
import { Badge } from "@/components/admin/ui";

const card = "rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]";
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const TONE: Record<string, "violet" | "blue" | "amber" | "slate" | "green" | "red"> = { new: "violet", confirmed: "blue", packed: "amber", shipped: "slate", delivered: "green", cancelled: "red" };

/** Store-sector dashboard: sales first (replaces the leads/appointments dashboard). */
export async function StoreDashboard({ tenant, userName, demoId, liveUrl }: { tenant: { id: string; name: string }; userName: string; demoId: string | null; liveUrl: string }) {
  const [orders, products, settings, views7, abandoned] = await Promise.all([
    adminOrders(tenant.id, demoId, 1000),
    db.product.findMany({ where: demoVisibleWhere(tenant.id, demoId), select: { id: true, name: true, stock: true, images: true, published: true } }),
    getStoreSettings(tenant.id, demoId),
    db.pageView.aggregate({ where: { tenantId: tenant.id, day: { gte: lastDays(7)[0] } }, _sum: { views: true } }),
    db.abandonedCart.groupBy({ by: ["recovered"], where: { tenantId: tenant.id, demoSessionId: demoId, updatedAt: { gte: daysAgo(30) } }, _count: { _all: true }, _sum: { subtotal: true } }),
  ]);

  // Day buckets in IST so "today" matches the shop owner's day.
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const now = new Date();
  const today = dayKey(now);
  const days = Array.from({ length: 7 }, (_, i) => dayKey(new Date(now.getTime() - (6 - i) * 86_400_000)));
  // Sales = non-cancelled orders, minus online orders still waiting for payment.
  const live = orders.filter((o) => o.status !== "cancelled" && !(o.paymentMethod === "online" && (o.paymentStatus === "pending" || o.paymentStatus === "failed")));
  const salesBy = new Map(days.map((d) => [d, 0]));
  for (const o of live) {
    const k = dayKey(new Date(o.createdAt));
    if (salesBy.has(k)) salesBy.set(k, salesBy.get(k)! + o.total);
  }
  const salesToday = salesBy.get(today) ?? 0;
  const sales7 = [...salesBy.values()].reduce((a, b) => a + b, 0);
  const orders7 = live.filter((o) => salesBy.has(dayKey(new Date(o.createdAt)))).length;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const aov = live.length ? live.reduce((n, o) => n + o.total, 0) / live.length : 0;
  const maxDay = Math.max(1, ...salesBy.values());

  const sold = new Map<string, { name: string; qty: number; revenue: number; image: string }>();
  for (const o of live) for (const i of o.items) {
    const x = sold.get(i.productId) ?? { name: i.name, qty: 0, revenue: 0, image: i.image };
    x.qty += i.qty;
    x.revenue += i.qty * i.price;
    sold.set(i.productId, x);
  }
  const top = [...sold.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const low = products.filter((p) => p.published && p.stock <= settings.lowStockAt).sort((a, b) => a.stock - b.stock).slice(0, 6);
  const visitors = views7._sum.views ?? 0;
  const conversion = visitors ? Math.round((orders7 / visitors) * 1000) / 10 : 0;
  const byMethod = new Map<string, { n: number; total: number }>();
  for (const o of live) { const m = byMethod.get(o.paymentMethod) ?? { n: 0, total: 0 }; m.n += 1; m.total += o.total; byMethod.set(o.paymentMethod, m); }
  const methodRows = [...byMethod.entries()].sort((a, b) => b[1].total - a[1].total);
  const methodMax = Math.max(1, ...methodRows.map(([, m]) => m.total));
  const lost = abandoned.find((a) => !a.recovered);
  const won = abandoned.find((a) => a.recovered);
  const couponOrders = live.filter((o) => o.couponCode).length;

  const kpis = [
    { label: "Sales today", value: inr(salesToday), hint: `${live.filter((o) => dayKey(new Date(o.createdAt)) === today).length} orders`, icon: IndianRupee, accent: "from-emerald-500 to-teal-500", href: "/admin/orders" },
    { label: "Sales · 7 days", value: inr(sales7), hint: `${orders7} orders`, icon: TrendingUp, accent: "from-blue-500 to-violet-500", href: "/admin/orders" },
    { label: "New orders", value: newOrders, hint: "Waiting to confirm", icon: ShoppingBag, accent: "from-violet-500 to-fuchsia-500", href: "/admin/orders" },
    { label: "Avg. order value", value: inr(aov), hint: `${visitors.toLocaleString("en-IN")} visitors · 7d`, icon: Eye, accent: "from-amber-500 to-orange-500", href: "/admin/analytics" },
  ];
  const quick = [
    { href: "/admin/products", label: "Add product", icon: Plus },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/customers", label: "Customers", icon: UserRound },
    { href: "/admin/store-settings", label: "Store settings", icon: Store },
    { href: "/admin/appearance", label: "Appearance", icon: Palette },
    { href: "/admin/discounts", label: "Discounts", icon: TicketPercent },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="admin-grad relative overflow-hidden rounded-3xl shadow-xl shadow-blue-600/15">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" aria-hidden />
        <div className="relative p-5 sm:p-7 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">Your store today</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 break-words">{inr(salesToday)} <span className="text-base font-semibold text-white/80">in sales</span></h1>
            <p className="text-sm text-white/80 mt-1.5">Hi {userName || "there"} · {tenant.name} · {products.filter((p) => p.published).length} products live</p>
            {newOrders > 0 && (
              <Link href="/admin/orders" className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> {newOrders} new order{newOrders === 1 ? "" : "s"} to confirm <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 text-blue-700 px-3.5 py-2 text-sm font-bold hover:bg-white/90 shadow-sm"><Globe className="w-4 h-4" /> View store</a>
            <Link href="/admin/products" className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Add product</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className={`${card} p-4 hover:-translate-y-0.5 hover:shadow-lg hover:border-lime-400/60 transition group`}>
            <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center text-white bg-gradient-to-br shadow-sm mb-2 ${k.accent}`}><k.icon className="w-4 h-4" /></span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-xl sm:text-2xl tracking-tight font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">{k.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{k.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${card} p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Sales · last 7 days</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">{inr(sales7)}</p>
          </div>
          <div className="flex items-end gap-2 h-36" role="img" aria-label={`Daily sales for the last 7 days, total ${inr(sales7)}`}>
            {days.map((d) => {
              const v = salesBy.get(d) ?? 0;
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end" title={`${d}: ${inr(v)}`}>
                  <span className="text-[10px] font-semibold text-slate-500 tabular-nums">{v ? inr(v).replace(/,\d{3}$/, "k") : ""}</span>
                  <span className={`w-full max-w-10 rounded-t-lg ${d === today ? "bg-gradient-to-t from-[#2563ff] to-[#7c3aed]" : "bg-lime-500/70"}`} style={{ height: `${Math.max(3, (v / maxDay) * 100)}%` }} />
                  <span className="text-[10px] text-slate-400">{new Date(`${d}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${card} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Top products</p>
            <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {top.length === 0 ? <p className="p-8 text-center text-xs text-slate-400">Best sellers show up after your first orders.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {top.map((t, i) => (
                <li key={t.name} className="px-4 py-2.5 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <span className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {t.image && <img src={t.image} alt="" className="w-full h-full object-cover" />}
                  </span>
                  <span className="flex-1 min-w-0"><span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{t.name}</span><span className="text-[11px] text-slate-400">{t.qty} sold</span></span>
                  <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{inr(t.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${card} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-lime-600" /><p className="text-sm font-bold text-slate-900 dark:text-white">Revenue by payment method</p><span className="ml-auto text-[11px] text-slate-400">all orders</span></div>
          {methodRows.length === 0 ? <p className="py-6 text-center text-xs text-slate-400">Shows up after your first orders.</p> : (
            <ul className="space-y-3">
              {methodRows.map(([m, v]) => (
                <li key={m}>
                  <div className="flex items-center justify-between text-xs mb-1"><span className="font-semibold text-slate-700 dark:text-slate-200">{PAYMENT_LABEL[m] ?? m} <span className="font-normal text-slate-400">· {v.n} orders</span></span><span className="font-bold tabular-nums text-slate-900 dark:text-white">{inr(v.total)}</span></div>
                  <span className="block h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-[#2563ff] to-[#7c3aed]" style={{ width: `${Math.max(3, (v.total / methodMax) * 100)}%` }} /></span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={`${card} p-4 sm:p-5 grid grid-cols-2 gap-4 content-start`}>
          <Link href="/admin/abandoned" className="col-span-2 rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3.5 hover:ring-1 hover:ring-amber-300 transition">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200"><ShoppingCart className="w-3.5 h-3.5" /> Abandoned checkouts · 30 days</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{inr(lost?._sum.subtotal ?? 0)} <span className="text-xs font-semibold text-slate-500">in {lost?._count._all ?? 0} carts</span></p>
            <p className="text-[11px] text-slate-500 mt-0.5">{won?._count._all ?? 0} recovered · tap to nudge on WhatsApp →</p>
          </Link>
          <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Conversion · 7d</p><p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">{conversion}%</p><p className="text-[11px] text-slate-400">{orders7} orders / {visitors.toLocaleString("en-IN")} visits</p></div>
          <Link href="/admin/discounts" className="hover:opacity-80"><p className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400"><TicketPercent className="w-3.5 h-3.5" /> With a coupon</p><p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">{couponOrders}</p><p className="text-[11px] text-slate-400">orders</p></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className={`${card} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Recent orders</p>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center"><ShoppingBag className="w-6 h-6 text-lime-600 mx-auto mb-2" /><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No orders yet</p><p className="text-xs text-slate-400 mt-0.5">Share your store link to get your first sale.</p></div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-500 w-12">{orderLabel(o.orderNo)}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">{o.customerName}</span><span className="block text-xs text-slate-400 truncate">{PAYMENT_LABEL[o.paymentMethod]} · {o.city || o.pincode}</span></span>
                  <Badge tone={TONE[o.status] ?? "slate"}>{o.status}</Badge>
                  <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white w-20 text-right">{inr(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${card} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Low stock</p>
            <span className="ml-auto text-[11px] text-slate-400">≤ {settings.lowStockAt} units</span>
          </div>
          {low.length === 0 ? <p className="p-8 text-center text-xs text-slate-400"><Package className="w-5 h-5 mx-auto mb-1.5 text-emerald-500" />All products are well stocked.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {low.map((p) => (
                <li key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{p.name}</span>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${p.stock === 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`${card} p-4 sm:p-5`}>
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick actions</p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {quick.map((q) => (
            <Link key={q.label} href={q.href} className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 dark:border-white/10 px-2 py-3.5 text-center hover:border-lime-400/60 hover:bg-lime-50/50 dark:hover:bg-lime-500/5 transition">
              <span className="inline-flex w-10 h-10 rounded-xl bg-lime-500/12 text-lime-600 items-center justify-center group-hover:scale-105 transition"><q.icon className="w-4 h-4" /></span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
