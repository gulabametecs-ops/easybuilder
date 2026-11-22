"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/actions/guard";
import { getSuperSession } from "@/lib/superAuth";
import { isDemoSubdomain } from "@/lib/demoSession";
import { rateLimit } from "@/lib/rateLimit";
import { requestWithdrawalFor, markWithdrawalPaidById, rejectWithdrawalById } from "@/lib/referralServer";
import { UPI_RE, IFSC_RE, PAN_RE, ACCOUNT_RE } from "@/lib/referral";

export type ReferralActionState = { ok: boolean; message: string };

const str = (fd: FormData, k: string) => (fd.get(k)?.toString() ?? "").trim();

const payoutSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("upi"),
    upiId: z.string().regex(UPI_RE, "Enter a valid UPI ID, e.g. name@okbank"),
  }),
  z.object({
    method: z.literal("bank"),
    accountName: z.string().min(2, "Enter the account holder's name").max(100),
    accountNumber: z.string().regex(ACCOUNT_RE, "Account number must be 9–18 digits"),
    ifsc: z.string().regex(IFSC_RE, "Enter a valid IFSC, e.g. HDFC0001234"),
  }),
]);

export async function requestWithdrawal(_prev: ReferralActionState, formData: FormData): Promise<ReferralActionState> {
  try {
    const authed = await requireRole(["owner", "admin"]);
    if (isDemoSubdomain(authed.tenant.subdomain)) return { ok: false, message: "Referrals aren't available on demo sites." };
    const rl = rateLimit(`withdraw:${authed.tenant.id}`, 5, 15 * 60_000);
    if (!rl.ok) return { ok: false, message: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

    const parsed = payoutSchema.safeParse({
      method: str(formData, "method"),
      upiId: str(formData, "upiId"),
      accountName: str(formData, "accountName"),
      accountNumber: str(formData, "accountNumber").replace(/\s/g, ""),
      ifsc: str(formData, "ifsc").toUpperCase(),
    });
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your payout details." };
    const pan = str(formData, "pan").toUpperCase();
    if (pan && !PAN_RE.test(pan)) return { ok: false, message: "Enter a valid PAN, e.g. ABCDE1234F (or leave it blank)." };

    const d = parsed.data;
    await requestWithdrawalFor(authed.tenant.id, {
      method: d.method,
      upiId: d.method === "upi" ? d.upiId : "",
      accountName: d.method === "bank" ? d.accountName : "",
      accountNumber: d.method === "bank" ? d.accountNumber : "",
      ifsc: d.method === "bank" ? d.ifsc : "",
      pan,
    });
    revalidatePath("/admin/referrals");
    revalidatePath("/super/payouts");
    return { ok: true, message: "Withdrawal requested — we'll transfer it after review." };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not request a withdrawal." };
  }
}

async function requireSuper() {
  if (!(await getSuperSession())) throw new Error("Unauthorized");
}

export async function markWithdrawalPaid(_prev: ReferralActionState, formData: FormData): Promise<ReferralActionState> {
  await requireSuper();
  const id = str(formData, "id");
  const reference = str(formData, "reference");
  if (!id || reference.length < 4 || reference.length > 64) return { ok: false, message: "Enter the UTR / transaction reference." };
  try {
    await markWithdrawalPaidById(id, reference);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed." };
  }
  revalidatePath("/super/payouts");
  revalidatePath("/super/referrals");
  return { ok: true, message: "Marked as paid." };
}

export async function rejectWithdrawal(_prev: ReferralActionState, formData: FormData): Promise<ReferralActionState> {
  await requireSuper();
  const id = str(formData, "id");
  const reason = str(formData, "reason");
  if (!id || reason.length < 3 || reason.length > 300) return { ok: false, message: "Give a short reason (shown to the customer)." };
  try {
    await rejectWithdrawalById(id, reason);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed." };
  }
  revalidatePath("/super/payouts");
  revalidatePath("/super/referrals");
  return { ok: true, message: "Rejected — balance unlocked." };
}
