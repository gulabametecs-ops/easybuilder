import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { isDemoSubdomain } from "@/lib/demoSession";
import { formatINR } from "@/lib/plans";
import { balances, canWithdraw, commissionState, maskAccount, maskName, tdsSplit, type CommissionView } from "@/lib/referral";
import { ensureReferralCode, getReferralSettings } from "@/lib/referralServer";
import { PageHeader, Card, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import { ShareLink, WithdrawForm } from "@/components/admin/ReferralWidgets";

export const metadata = { title: "Refer & Earn" };

const TONE: Record<CommissionView, "amber" | "green" | "blue" | "slate" | "red"> = {
  pending: "amber", available: "green", requested: "blue", paid: "slate", reversed: "red",
};
const W_TONE: Record<string, "blue" | "green" | "red"> = { requested: "blue", paid: "green", rejected: "red" };
const date = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function ReferralsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant, session } = authed;
  const s = await getReferralSettings();

  const blocked =
    session.demo || isDemoSubdomain(tenant.subdomain)
      ? "Refer & Earn is available on your own live website, not on demo sites."
      : session.role !== "owner" && session.role !== "admin"
        ? "Only the account owner or an admin can use Refer & Earn."
        : !s.enabled
          ? "The referral program is paused right now. Check back soon."
          : "";
  if (blocked) {
    return (
      <>
        <PageHeader title="Refer & Earn" />
        <Card><EmptyState title={blocked} /></Card>
      </>
    );
  }

  const code = await ensureReferralCode(tenant);
  const [commissions, withdrawals, signups, purchases] = await Promise.all([
    db.referralCommission.findMany({ where: { referrerTenantId: tenant.id }, orderBy: { createdAt: "desc" }, take: 200 }),
    db.referralWithdrawal.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.tenant.count({ where: { referredByTenantId: tenant.id } }),
    db.order.count({ where: { referrerTenantId: tenant.id, status: { in: ["paid", "provisioned"] } } }),
  ]);
  const now = new Date();
  const b = balances(commissions, now);
  const open = withdrawals.some((w) => w.status === "requested");
  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const link = `${proto}://${ROOT_DOMAIN}/?ref=${code}`;
  const pct = `${s.commissionPct}%`;
  const split = tdsSplit(b.available, s.tdsPct);

  return (
    <>
      <PageHeader title="Refer & Earn" subtitle={`Share your link and earn ${pct} on every qualifying purchase by businesses you refer.`} />

      <Card className="p-5 mb-5">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Your referral link</p>
        <ShareLink link={link} code={code} message={`I built my business website with this — try it:`} />
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Sign-ups" value={signups} hint={`${purchases} paid purchase${purchases === 1 ? "" : "s"}`} />
        <StatCard label="Pending" value={formatINR(b.pending)} hint={`Held ${s.holdDays} days after payment`} />
        <StatCard label="Available" value={formatINR(b.available)} hint={b.requested ? `${formatINR(b.requested)} in a payout request` : `Min. withdrawal ${formatINR(s.minWithdrawalPaise)}`} />
        <StatCard label="Paid out" value={formatINR(b.paid)} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5 mb-5">
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">How it works</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>Share your link or code with other business owners.</li>
            <li>When someone you referred buys a plan worth more than {formatINR(s.minOrderPaise)} (before GST), you earn {pct} of that amount.</li>
            <li>{s.firstPurchaseOnly ? "Only their first purchase counts." : "Their later renewals and upgrades earn too."} They pay the normal price — only you earn.</li>
            <li>Earnings stay pending for {s.holdDays} days (the refund window). Refunded orders are reversed.</li>
            <li>Withdraw to UPI or bank once your available balance reaches {formatINR(s.minWithdrawalPaise)}.</li>
          </ol>
          <p className="text-xs text-slate-400 mt-3">You can&apos;t refer yourself or your own business. <a href={`${proto}://${ROOT_DOMAIN}/terms#referral-program`} target="_blank" rel="noreferrer" className="underline">Program terms</a></p>
        </Card>

        <Card className="p-5 lg:col-span-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Withdraw</p>
          {open ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">Your payout request is being processed. You can request again once it&apos;s paid or rejected.</p>
          ) : canWithdraw(b.available, s, open) ? (
            <WithdrawForm
              amountLabel={formatINR(b.available)}
              tdsNote={s.tdsPct > 0 ? `TDS ${s.tdsPct}% (${formatINR(split.tds)}) will be deducted — you receive ${formatINR(split.net)}.` : undefined}
            />
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You need at least {formatINR(s.minWithdrawalPaise)} available to withdraw. Available now: <b>{formatINR(b.available)}</b>.
            </p>
          )}
          {withdrawals.length > 0 && (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
              {withdrawals.map((w) => (
                <li key={w.id} className="py-2.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(w.amount)}</span>
                  {w.tdsAmount > 0 && <span className="text-xs text-slate-400">net {formatINR(w.netAmount)}</span>}
                  <span className="text-xs text-slate-400">{w.method === "upi" ? w.upiId : `A/c ${maskAccount(w.accountNumber)}`} · {date(w.createdAt)}</span>
                  <span className="ml-auto"><Badge tone={W_TONE[w.status] ?? "slate"}>{w.status}</Badge></span>
                  {w.status === "paid" && w.reference && <span className="w-full text-xs text-slate-400">UTR {w.reference}</span>}
                  {w.status === "rejected" && <span className="w-full text-xs text-red-500">{w.rejectReason}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <p className="px-5 pt-4 text-sm font-semibold text-slate-900 dark:text-white">Referred customers &amp; commissions</p>
        {commissions.length === 0 ? (
          <EmptyState title="No commissions yet" hint="When someone you referred buys a qualifying plan, it shows up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Purchase (excl. GST)</th>
                  <th className="p-4 font-medium">Commission</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {commissions.map((c) => {
                  const st = commissionState(c, now);
                  return (
                    <tr key={c.id}>
                      <td className="p-4 text-slate-800 dark:text-slate-100">{maskName(c.referredName || "Customer")}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{formatINR(c.baseAmount)}</td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{formatINR(c.amount)} <span className="text-xs font-normal text-slate-400">({c.ratePct}%)</span></td>
                      <td className="p-4">
                        <Badge tone={TONE[st]}>{st}</Badge>
                        {st === "pending" && <span className="block text-xs text-slate-400 mt-1">available {date(c.availableAt)}</span>}
                      </td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">{date(c.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
