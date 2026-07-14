"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { getPlatformConfig } from "@/lib/platformConfig";
import { TIERS } from "@/lib/plans";
import { runRenewalReminders } from "@/lib/reminders";

export type SettingsState = { ok: boolean; message: string };

async function requireSuper() {
  const s = await getSuperSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}
function s(fd: FormData, k: string): string {
  return (fd.get(k)?.toString() ?? "").trim();
}

// Save Razorpay keys. The secret is only overwritten if a new value is entered.
export async function saveRazorpay(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const keyId = s(formData, "razorpayKeyId");
  const secret = s(formData, "razorpayKeySecret");
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: { razorpayKeyId: keyId, ...(secret ? { razorpayKeySecret: secret } : {}) },
    create: { id: "singleton", razorpayKeyId: keyId, razorpayKeySecret: secret },
  });
  revalidatePath("/super/settings");
  const live = Boolean(keyId && (secret || (await getPlatformConfig()).razorpayKeySecret));
  return { ok: true, message: live ? "Saved — live payments are now enabled. 🎉" : "Saved. Add both keys to enable live payments." };
}

export async function savePlatform(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: { platformName: s(formData, "platformName") || "StandardSaaS", supportEmail: s(formData, "supportEmail"), supportPhone: s(formData, "supportPhone") },
    create: { id: "singleton", platformName: s(formData, "platformName") || "StandardSaaS", supportEmail: s(formData, "supportEmail"), supportPhone: s(formData, "supportPhone") },
  });
  revalidatePath("/super/settings");
  return { ok: true, message: "Platform settings saved." };
}

// Broadcast: a message shown at the top of every client's admin panel.
export async function saveBroadcast(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: { broadcastShow: formData.get("broadcastShow") === "on", broadcastText: s(formData, "broadcastText") },
    create: { id: "singleton", broadcastShow: formData.get("broadcastShow") === "on", broadcastText: s(formData, "broadcastText") },
  });
  revalidatePath("/super/settings");
  return { ok: true, message: "Broadcast updated. It now shows in every client's admin panel." };
}

// No-code plan editor: price (₹/month) + service limit per tier.
export async function savePlans(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const overrides: Record<string, { monthlyBase?: number; maxServices?: number }> = {};
  for (const t of TIERS) {
    const priceR = parseFloat(formData.get(`price_${t.id}`)?.toString() ?? "");
    const limit = parseInt(formData.get(`limit_${t.id}`)?.toString() ?? "", 10);
    overrides[t.id] = {};
    if (!isNaN(priceR)) overrides[t.id].monthlyBase = Math.max(0, Math.round(priceR * 100));
    if (!isNaN(limit)) overrides[t.id].maxServices = Math.max(0, limit);
  }
  await db.platformConfig.upsert({ where: { id: "singleton" }, update: { planOverrides: JSON.stringify(overrides) }, create: { id: "singleton", planOverrides: JSON.stringify(overrides) } });
  revalidatePath("/super/plans");
  return { ok: true, message: "Plans updated — new prices & limits are live." };
}

// GST / invoicing details (shown on generated invoices).
export async function saveGst(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const rate = parseInt(formData.get("gstRate")?.toString() ?? "18", 10);
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: { gstin: s(formData, "gstin"), businessAddress: s(formData, "businessAddress"), gstRate: isNaN(rate) ? 18 : rate, invoicePrefix: s(formData, "invoicePrefix") || "INV" },
    create: { id: "singleton", gstin: s(formData, "gstin"), businessAddress: s(formData, "businessAddress"), gstRate: isNaN(rate) ? 18 : rate, invoicePrefix: s(formData, "invoicePrefix") || "INV" },
  });
  revalidatePath("/super/settings");
  return { ok: true, message: "GST & invoice details saved." };
}

// Renewal reminder settings (email).
export async function saveReminders(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const days = parseInt(formData.get("reminderDays")?.toString() ?? "7", 10);
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: { remindersEnabled: formData.get("remindersEnabled") === "on", reminderDays: isNaN(days) ? 7 : days, resendApiKey: s(formData, "resendApiKey"), senderEmail: s(formData, "senderEmail") },
    create: { id: "singleton", remindersEnabled: formData.get("remindersEnabled") === "on", reminderDays: isNaN(days) ? 7 : days, resendApiKey: s(formData, "resendApiKey"), senderEmail: s(formData, "senderEmail") },
  });
  revalidatePath("/super/settings");
  return { ok: true, message: "Reminder settings saved." };
}

// Manually run the renewal reminders now.
export async function triggerReminders(_prev: SettingsState, _formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const r = await runRenewalReminders();
  if (!r.enabled) return { ok: false, message: "Reminders are disabled — enable and save first." };
  return { ok: true, message: `${r.processed} client(s) checked · ${r.sent} reminder(s) ${r.mock ? "queued (mock — add an email key to send for real)" : "sent"}.` };
}

export async function changeSuperPassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await requireSuper();
  const current = s(formData, "current");
  const next = s(formData, "next");
  if (next.length < 6) return { ok: false, message: "New password must be at least 6 characters." };
  const user = await db.platformUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    return { ok: false, message: "Current password is incorrect." };
  }
  await db.platformUser.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 10) } });
  return { ok: true, message: "Password changed successfully." };
}

const addSchema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional().default("") });

export async function addSuperAdmin(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const parsed = addSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), name: formData.get("name") ?? "" });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and a 6+ char password." };
  const email = parsed.data.email.toLowerCase();
  if (await db.platformUser.findUnique({ where: { email } })) return { ok: false, message: "A super admin with that email already exists." };
  await db.platformUser.create({ data: { email, password: await bcrypt.hash(parsed.data.password, 10), name: parsed.data.name || "Admin" } });
  revalidatePath("/super/settings");
  return { ok: true, message: `Super admin ${email} added.` };
}
