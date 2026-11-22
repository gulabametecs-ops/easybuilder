"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAuth, type Authed } from "./guard";
import { rateLimit } from "@/lib/rateLimit";
import { type AdminPrefs, parseAdminPrefs } from "@/lib/adminPrefs";
import { parsePayments } from "@/lib/payments";

export type SettingsState = { ok: boolean; message: string };

// Same guard as every other admin action: refuses demo visitors and
// suspended/expired accounts, and (optionally) non-manager roles.
async function authedOr(roles?: string[]): Promise<Authed | SettingsState> {
  try {
    const a = await requireAuth();
    if (roles && !roles.includes(a.session.role)) return { ok: false, message: "Only the owner or an admin can change this." };
    return a;
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unauthorized" };
  }
}
const MANAGERS = ["owner", "admin"];

export async function updateBusiness(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr(MANAGERS);
  if ("ok" in authed) return authed;
  const name = (formData.get("name")?.toString() ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Business name is too short." };
  await db.tenant.update({ where: { id: authed.tenant.id }, data: { name } });
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { ok: true, message: "Business name updated." };
}

export async function updateProfile(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr();
  if ("ok" in authed) return authed;
  const name = (formData.get("name")?.toString() ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Name is too short." };
  await db.user.update({ where: { id: authed.session.userId }, data: { name } });
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { ok: true, message: "Profile updated." };
}

export async function changePassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr();
  if ("ok" in authed) return authed;

  const rl = rateLimit(`pwchange:${authed.session.userId}`, 5, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterSec / 60)} min.` };
  const current = formData.get("current")?.toString() ?? "";
  const next = formData.get("next")?.toString() ?? "";
  if (next.length < 6) return { ok: false, message: "New password must be at least 6 characters." };
  if (formData.has("confirm") && formData.get("confirm") !== next) return { ok: false, message: "New passwords don't match." };

  const user = await db.user.findUnique({ where: { id: authed.session.userId } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    return { ok: false, message: "Current password is incorrect." };
  }
  await db.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 10) } });
  return { ok: true, message: "Password changed successfully." };
}

export async function saveAdminPrefs(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr(MANAGERS);
  if ("ok" in authed) return authed;
  const existing = await db.siteConfig.findUnique({ where: { tenantId: authed.tenant.id }, select: { adminPrefs: true } });
  const prefs: AdminPrefs = {
    ...parseAdminPrefs(existing?.adminPrefs), // keep other keys (e.g. setupChecklistHidden)
    notifyLeads: formData.get("notifyLeads") === "on",
    notifyAppointments: formData.get("notifyAppointments") === "on",
    notifyWeeklySummary: formData.get("notifyWeeklySummary") === "on",
  };
  await db.siteConfig.upsert({
    where: { tenantId: authed.tenant.id },
    update: { adminPrefs: JSON.stringify(prefs) },
    create: { tenantId: authed.tenant.id, adminPrefs: JSON.stringify(prefs) },
  });
  revalidatePath("/admin/settings");
  return { ok: true, message: "Notification preferences saved." };
}

export async function saveTenantPayments(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr(MANAGERS);
  if ("ok" in authed) return authed;
  const s = (k: string) => (formData.get(k)?.toString() ?? "").trim();
  const existing = await db.siteConfig.findUnique({ where: { tenantId: authed.tenant.id } });
  const prev = parsePayments(existing?.payments);
  const secret = s("razorpayKeySecret");
  const next = {
    razorpayKeyId: s("razorpayKeyId"),
    razorpayKeySecret: secret || prev.razorpayKeySecret,
    upiId: s("upiId"),
    upiQrImage: s("upiQrImage"),
    accountName: s("accountName"),
    accountNumber: s("accountNumber"),
    ifsc: s("ifsc"),
    bankName: s("bankName"),
    paymentNote: s("paymentNote"),
  };
  await db.siteConfig.upsert({
    where: { tenantId: authed.tenant.id },
    update: { payments: JSON.stringify(next) },
    create: { tenantId: authed.tenant.id, payments: JSON.stringify(next) },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/donate");
  const live = Boolean(next.razorpayKeyId && next.razorpayKeySecret);
  return {
    ok: true,
    message: live
      ? "Saved. Razorpay is ready for donations on your site."
      : "Saved. Add Razorpay keys for online pay, or use UPI / QR without them.",
  };
}

export async function requestCancellation(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await authedOr();
  if ("ok" in authed) return authed;
  if (authed.session.role !== "owner") return { ok: false, message: "Only the owner can request cancellation." };
  const reason = (formData.get("reason")?.toString() ?? "").trim();
  if (reason.length < 5) return { ok: false, message: "Please share a short reason (at least 5 characters)." };
  await db.tenant.update({
    where: { id: authed.tenant.id },
    data: { cancelReason: reason, cancelledAt: new Date() },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/billing");
  return { ok: true, message: "Cancellation request submitted. Support will follow up shortly." };
}
