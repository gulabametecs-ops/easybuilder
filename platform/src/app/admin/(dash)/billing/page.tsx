import { Check, Minus } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { LIMIT_KEYS, LIMIT_LABELS, formatINR, formatLimit, perMonth, priceFor, resolveDurations, resolveTiers } from "@/lib/plans";
import { getUsage, planFor } from "@/lib/usage";
import { BillingManager } from "@/components/admin/BillingManager";
import { PlanUsageCard } from "@/components/admin/PlanUsageCard";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;

  const [orders, cfg, usage, plan] = await Promise.all([
    db.order.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" } }),
    getPlatformConfig(),
    getUsage(tenant.id),
    planFor(tenant),
  ]);
  // Same resolvers as the pricing page and checkout, so shown = charged.
  const resolved = resolveTiers(cfg.planOverrides);
  const durs = resolveDurations(cfg.planOverrides);
  const prices: Record<string, number> = {};
  for (const t of resolved) for (const d of durs) prices[`${t.id}-${d.id}`] = priceFor(t, d);
  const canRenew = authed.session.role === "owner" || authed.session.role === "admin";
  const cur = plan.tier;
  const domainTiers = resolved.filter((t) => t.customDomain).map((t) => t.name);
  const ends = tenant.subscriptionEndsAt;

  const overview = (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Current plan: <span className="text-lime-700 dark:text-lime-400">{cur?.name ?? tenant.plan}</span>
          </p>
          <p className="text-xs text-slate-500">
            {ends ? `Valid till ${new Date(ends).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "No expiry"}
          </p>
        </div>
        {cur ? (
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            <ul className="text-xs space-y-1.5">
              {LIMIT_KEYS.map((k) => (
                <li key={k} className="flex justify-between gap-2 text-slate-600 dark:text-slate-300">
                  <span>{LIMIT_LABELS[k]}</span><b className="text-slate-900 dark:text-white">{formatLimit(k, cur.limits[k])}</b>
                </li>
              ))}
              <li className="flex justify-between gap-2 text-slate-600 dark:text-slate-300">
                <span>Custom domain</span><b className="text-slate-900 dark:text-white">{cur.customDomain ? "Included" : "Not included"}</b>
              </li>
            </ul>
            <ul className="text-xs space-y-1.5">
              {cur.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300"><Check className="w-3.5 h-3.5 text-lime-600 mt-0.5 shrink-0" />{f}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-2">This account is on a custom plan without limits.</p>
        )}
      </div>

      <PlanUsageCard planName={cur?.name ?? tenant.plan} limits={plan.limits} usage={usage} />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
        <p className="px-4 pt-4 text-sm font-bold text-slate-900 dark:text-white">Compare plans</p>
        <table className="w-full text-xs mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="p-3 font-medium" />
              {resolved.map((t) => (
                <th key={t.id} className="p-3 font-semibold text-slate-900 dark:text-white">
                  {t.name}
                  {t.id === tenant.plan && <span className="ml-1.5 text-[9px] font-bold uppercase text-lime-700 bg-lime-100 px-1.5 py-0.5 rounded-full">Current</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {durs.map((d) => (
              <tr key={d.id}>
                <td className="p-3 whitespace-nowrap">{d.label}{d.discountPct ? <span className="ml-1 text-lime-700 dark:text-lime-400">−{d.discountPct}%</span> : null}</td>
                {resolved.map((t) => (
                  <td key={t.id} className="p-3 whitespace-nowrap">
                    <b className="text-slate-900 dark:text-white">{formatINR(prices[`${t.id}-${d.id}`])}</b>
                    <span className="block text-[10px] text-slate-400">~{formatINR(perMonth(t, d))}/mo</span>
                  </td>
                ))}
              </tr>
            ))}
            {LIMIT_KEYS.map((k) => (
              <tr key={k}>
                <td className="p-3">{LIMIT_LABELS[k]}</td>
                {resolved.map((t) => <td key={t.id} className="p-3">{formatLimit(k, t.limits[k])}</td>)}
              </tr>
            ))}
            <tr>
              <td className="p-3">
                Custom domain
                {domainTiers.length > 0 && domainTiers.length < resolved.length && (
                  <span className="block text-[10px] text-slate-400">{domainTiers[0]} and above</span>
                )}
              </td>
              {resolved.map((t) => (
                <td key={t.id} className="p-3">{t.customDomain ? <Check className="w-4 h-4 text-lime-600" /> : <Minus className="w-4 h-4 text-slate-300" />}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="px-4 pb-3 text-[10px] text-slate-400">Prices include GST. Upgrade or renew from the Renew tab.</p>
      </div>
    </div>
  );

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <BillingManager
        tiers={resolved.map((t) => ({ id: t.id, name: t.name, monthlyBase: t.monthlyBase }))}
        durations={durs.map((d) => ({ id: d.id, label: d.label, discountPct: d.discountPct }))}
        prices={prices}
        overview={overview}
        currentPlan={tenant.plan}
        canRenew={canRenew}
        orders={orders.map((o) => ({
          id: o.id,
          invoiceNo: o.invoiceNo,
          createdAt: o.createdAt,
          amount: o.amount,
          status: o.status,
        }))}
      />
    </div>
  );
}
