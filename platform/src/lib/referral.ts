// Referral program — pure money math & rules (no DB, unit-tested in referral.test.ts).
// All money is integer paise. DB side lives in lib/referralServer.ts.

export type ReferralSettings = {
  enabled: boolean;
  commissionPct: number; // % of the pre-GST order amount
  minOrderPaise: number; // order must be GREATER than this (pre-GST)
  minWithdrawalPaise: number; // available balance needed to request a payout
  holdDays: number; // commission stays "pending" this long (refund window)
  firstPurchaseOnly: boolean; // false = renewals by a referred customer also earn
  tdsPct: number; // deducted from payouts (0 = none)
};

export const REFERRAL_DEFAULTS: ReferralSettings = {
  enabled: true,
  commissionPct: 20,
  minOrderPaise: 10_000_00,
  minWithdrawalPaise: 15_000_00,
  holdDays: 7,
  firstPurchaseOnly: false,
  tdsPct: 0,
};

export const REF_COOKIE = "ref_code";
export const REF_COOKIE_DAYS = 30;
export const REF_CODE_RE = /^[A-Z0-9]{4,16}$/;

export function normalizeRefCode(raw: string | null | undefined): string {
  const c = (raw ?? "").trim().toUpperCase();
  return REF_CODE_RE.test(c) ? c : "";
}

const int = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;

export function resolveReferralSettings(json: string | null | undefined): ReferralSettings {
  let o: Partial<ReferralSettings> = {};
  try { o = JSON.parse(json || "{}") ?? {}; } catch { o = {}; }
  const d = REFERRAL_DEFAULTS;
  return {
    enabled: typeof o.enabled === "boolean" ? o.enabled : d.enabled,
    commissionPct: int(o.commissionPct, 0, 100, d.commissionPct),
    minOrderPaise: int(o.minOrderPaise, 0, 1e11, d.minOrderPaise),
    minWithdrawalPaise: int(o.minWithdrawalPaise, 0, 1e11, d.minWithdrawalPaise),
    holdDays: int(o.holdDays, 0, 365, d.holdDays),
    firstPurchaseOnly: typeof o.firstPurchaseOnly === "boolean" ? o.firstPurchaseOnly : d.firstPurchaseOnly,
    tdsPct: int(o.tdsPct, 0, 100, d.tdsPct),
  };
}

// Pre-GST amount of a GST-inclusive charge (same rounding as invoice.gstBreakdown).
export function preGstAmount(amountPaise: number, gstRate: number): number {
  return Math.round(amountPaise / (1 + gstRate / 100));
}

const phoneKey = (p: string) => p.replace(/\D/g, "").slice(-10);

/** Buyer is the referrer themself: same tenant, or email/phone matches the referrer's owner/admins. */
export function isSelfReferral(
  buyer: { tenantId?: string | null; email?: string; phone?: string },
  referrer: { tenantId: string; emails: string[]; phones: string[] },
): boolean {
  if (buyer.tenantId && buyer.tenantId === referrer.tenantId) return true;
  const email = (buyer.email ?? "").trim().toLowerCase();
  if (email && referrer.emails.some((e) => e.trim().toLowerCase() === email)) return true;
  const phone = phoneKey(buyer.phone ?? "");
  return phone.length >= 7 && referrer.phones.some((p) => phoneKey(p) === phone);
}

export function qualifies(basePaise: number, s: ReferralSettings): boolean {
  return s.enabled && basePaise > s.minOrderPaise;
}

export function commissionAmount(basePaise: number, s: ReferralSettings): number {
  return Math.round((basePaise * s.commissionPct) / 100);
}

export function availableAtFrom(paidAt: Date, holdDays: number): Date {
  return new Date(paidAt.getTime() + holdDays * 86_400_000);
}

export type CommissionView = "pending" | "available" | "requested" | "paid" | "reversed";

// Stored status → what the tenant sees. "earned" splits into pending/available by date (no cron).
export function commissionState(c: { status: string; availableAt: Date }, now: Date): CommissionView {
  if (c.status === "reversed" || c.status === "requested" || c.status === "paid") return c.status;
  return now.getTime() >= new Date(c.availableAt).getTime() ? "available" : "pending";
}

export type Balances = Record<CommissionView, number>;

export function balances(rows: { status: string; availableAt: Date; amount: number }[], now: Date): Balances {
  const b: Balances = { pending: 0, available: 0, requested: 0, paid: 0, reversed: 0 };
  for (const r of rows) b[commissionState(r, now)] += r.amount;
  return b;
}

export function canWithdraw(availablePaise: number, s: ReferralSettings, hasOpenRequest: boolean): boolean {
  return !hasOpenRequest && availablePaise > 0 && availablePaise >= s.minWithdrawalPaise;
}

export function tdsSplit(grossPaise: number, tdsPct: number): { gross: number; tds: number; net: number } {
  const tds = Math.round((grossPaise * tdsPct) / 100);
  return { gross: grossPaise, tds, net: grossPaise - tds };
}

export function maskAccount(acc: string): string {
  const a = acc.replace(/\s/g, "");
  return a.length <= 4 ? a : `${"•".repeat(Math.min(8, a.length - 4))}${a.slice(-4)}`;
}

// "Sunrise Yoga Studio" → "Su***** Yo** St****"
export function maskName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w[0] + "*" : w.slice(0, 2) + "*".repeat(Math.min(5, w.length - 2))))
    .join(" ");
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
// Readable code: up to 5 letters from the subdomain + 3 random chars, e.g. "SUNRI7KQ".
export function referralCodeCandidate(subdomain: string, rand: () => number = Math.random): string {
  const head = subdomain.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) || "REF";
  let tail = "";
  for (let i = 0; i < 3; i++) tail += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
  return head + tail;
}

export const UPI_RE = /^[a-zA-Z0-9._-]{2,64}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/;
export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const ACCOUNT_RE = /^[0-9]{9,18}$/;
