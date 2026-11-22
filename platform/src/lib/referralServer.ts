// Referral program — DB side. NOT a "use server" file: nothing here is a public endpoint.
// Callers (server actions / provisioning) do the auth checks.
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { isDemoSubdomain } from "@/lib/demoSession";
import {
  resolveReferralSettings, normalizeRefCode, referralCodeCandidate, isSelfReferral, preGstAmount, qualifies,
  commissionAmount, availableAtFrom, canWithdraw, tdsSplit, type ReferralSettings,
} from "@/lib/referral";

export async function getReferralSettings(): Promise<ReferralSettings> {
  return resolveReferralSettings((await getPlatformConfig()).referralSettings);
}

/** The tenant's referral code, created on first use (readable + unique). */
export async function ensureReferralCode(tenant: { id: string; subdomain: string; referralCode: string | null }): Promise<string> {
  if (tenant.referralCode) return tenant.referralCode;
  for (let i = 0; i < 8; i++) {
    const code = referralCodeCandidate(tenant.subdomain);
    try {
      const r = await db.tenant.updateMany({ where: { id: tenant.id, referralCode: null }, data: { referralCode: code } });
      if (r.count === 1) return code;
      // Someone else set it concurrently — read it back.
      const t = await db.tenant.findUnique({ where: { id: tenant.id }, select: { referralCode: true } });
      if (t?.referralCode) return t.referralCode;
    } catch {
      /* unique clash — try another candidate */
    }
  }
  throw new Error("Could not create a referral code. Please try again.");
}

async function referrerIdentity(tenantId: string) {
  const [users, orders] = await Promise.all([
    db.user.findMany({ where: { tenantId, role: { in: ["owner", "admin"] } }, select: { email: true } }),
    db.order.findMany({ where: { tenantId }, select: { email: true, phone: true }, take: 50 }),
  ]);
  return {
    tenantId,
    emails: [...users.map((u) => u.email), ...orders.map((o) => o.email)].filter(Boolean),
    phones: orders.map((o) => o.phone).filter(Boolean),
  };
}

/**
 * Who to credit for a new checkout. Returns the referrer tenant id, null when no/ignored code,
 * or an error message for a code the buyer typed that is invalid.
 */
export async function resolveReferrer(
  rawCode: string,
  buyer: { email: string; phone: string; tenantId?: string | null },
  typed: boolean,
): Promise<{ tenantId: string | null; error?: string }> {
  const code = normalizeRefCode(rawCode);
  if (!code) return typed && rawCode.trim() ? { tenantId: null, error: "Invalid referral code." } : { tenantId: null };
  if (!(await getReferralSettings()).enabled) return { tenantId: null };
  const ref = await db.tenant.findUnique({ where: { referralCode: code }, select: { id: true, subdomain: true } });
  if (!ref || isDemoSubdomain(ref.subdomain)) return typed ? { tenantId: null, error: "Referral code not found." } : { tenantId: null };
  if (isSelfReferral(buyer, await referrerIdentity(ref.id))) {
    return typed ? { tenantId: null, error: "You can't use your own referral code." } : { tenantId: null };
  }
  return { tenantId: ref.id };
}

/**
 * Called once an order is paid AND provisioned (provisionForOrder / manual payment).
 * Idempotent: links the new tenant to its referrer and creates at most one commission per order.
 */
export async function settleReferralForOrder(orderId: string): Promise<void> {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order?.referrerTenantId || (order.status !== "paid" && order.status !== "provisioned")) return;
  const referrerId = order.referrerTenantId;
  if (order.tenantId === referrerId) return;

  // Permanent link so the customer's later renewals also credit the referrer.
  if (order.tenantId && order.kind === "new") {
    await db.tenant.updateMany({ where: { id: order.tenantId, referredByTenantId: null }, data: { referredByTenantId: referrerId } });
  }

  const cfg = await getPlatformConfig();
  const s = resolveReferralSettings(cfg.referralSettings);
  const base = preGstAmount(order.amount, cfg.gstRate);
  if (!qualifies(base, s)) return;
  if (isSelfReferral(order, await referrerIdentity(referrerId))) return;

  if (s.firstPurchaseOnly && order.tenantId) {
    const earlier = await db.order.count({
      where: { tenantId: order.tenantId, id: { not: order.id }, status: { in: ["paid", "provisioned", "refunded"] }, createdAt: { lt: order.createdAt } },
    });
    if (earlier > 0) return;
  }

  const buyer = order.tenantId ? await db.tenant.findUnique({ where: { id: order.tenantId }, select: { name: true } }) : null;
  try {
    await db.referralCommission.create({
      data: {
        referrerTenantId: referrerId,
        orderId: order.id,
        referredTenantId: order.tenantId,
        referredName: buyer?.name ?? order.company ?? order.customerName,
        baseAmount: base,
        ratePct: s.commissionPct,
        amount: commissionAmount(base, s),
        availableAt: availableAtFrom(new Date(), s.holdDays),
      },
    });
  } catch (e) {
    // P2002 = already created for this order (idempotent); FK = referrer deleted.
    if ((e as { code?: string }).code !== "P2002") console.error("[referral] commission create failed:", e);
  }
}

/** Refund → reverse the order's commission (unless already paid out). Shrinks an open withdrawal. */
export async function reverseReferralForOrder(orderId: string): Promise<void> {
  const c = await db.referralCommission.findUnique({ where: { orderId } });
  if (!c || c.status === "reversed" || c.status === "paid") return;
  await db.$transaction(async (tx) => {
    await tx.referralCommission.update({ where: { id: c.id }, data: { status: "reversed", reversedAt: new Date(), withdrawalId: null } });
    if (c.status !== "requested" || !c.withdrawalId) return;
    const w = await tx.referralWithdrawal.findUnique({ where: { id: c.withdrawalId } });
    if (!w || w.status !== "requested") return;
    const left = await tx.referralCommission.aggregate({ where: { withdrawalId: w.id, status: "requested" }, _sum: { amount: true } });
    const gross = left._sum.amount ?? 0;
    if (gross <= 0) {
      await tx.referralWithdrawal.update({ where: { id: w.id }, data: { status: "rejected", rejectReason: "Commissions reversed after a refund.", processedAt: new Date() } });
    } else {
      const split = tdsSplit(gross, w.tdsPct);
      await tx.referralWithdrawal.update({ where: { id: w.id }, data: { amount: split.gross, tdsAmount: split.tds, netAmount: split.net } });
    }
  });
}

export type PayoutDetails = {
  method: "upi" | "bank";
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
};

/** Lock the whole available balance into one withdrawal request (transaction; one open request max). */
export async function requestWithdrawalFor(tenantId: string, details: PayoutDetails) {
  const s = await getReferralSettings();
  if (!s.enabled) throw new Error("The referral program is paused.");
  const now = new Date();
  return db.$transaction(async (tx) => {
    const open = await tx.referralWithdrawal.findFirst({ where: { tenantId, status: "requested" } });
    if (open) throw new Error("You already have a withdrawal request in progress.");
    const rows = await tx.referralCommission.findMany({
      where: { referrerTenantId: tenantId, status: "earned", availableAt: { lte: now } },
      select: { id: true, amount: true },
    });
    const gross = rows.reduce((sum, r) => sum + r.amount, 0);
    if (!canWithdraw(gross, s, false)) throw new Error("Your available balance is below the minimum withdrawal.");
    const split = tdsSplit(gross, s.tdsPct);
    const w = await tx.referralWithdrawal.create({
      data: { tenantId, amount: split.gross, tdsPct: s.tdsPct, tdsAmount: split.tds, netAmount: split.net, ...details },
    });
    const locked = await tx.referralCommission.updateMany({
      where: { id: { in: rows.map((r) => r.id) }, status: "earned" },
      data: { status: "requested", withdrawalId: w.id },
    });
    if (locked.count !== rows.length) throw new Error("Your balance changed — please try again.");
    return w;
  });
}

export async function markWithdrawalPaidById(id: string, reference: string) {
  await db.$transaction(async (tx) => {
    const r = await tx.referralWithdrawal.updateMany({
      where: { id, status: "requested" },
      data: { status: "paid", reference, processedAt: new Date() },
    });
    if (r.count !== 1) throw new Error("This request is no longer open.");
    await tx.referralCommission.updateMany({ where: { withdrawalId: id, status: "requested" }, data: { status: "paid" } });
  });
}

export async function rejectWithdrawalById(id: string, reason: string) {
  await db.$transaction(async (tx) => {
    const r = await tx.referralWithdrawal.updateMany({
      where: { id, status: "requested" },
      data: { status: "rejected", rejectReason: reason, processedAt: new Date() },
    });
    if (r.count !== 1) throw new Error("This request is no longer open.");
    // Unlock the balance.
    await tx.referralCommission.updateMany({ where: { withdrawalId: id, status: "requested" }, data: { status: "earned", withdrawalId: null } });
  });
}
