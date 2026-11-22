"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { getPlatformConfig, getAiConfig } from "@/lib/platformConfig";
import { getProvider, isValidModelId, parseMap } from "@/lib/ai/providers";
import { callGroqJson, GroqError, friendlyGroqError } from "@/lib/ai/groq";
import { TIERS, DURATIONS, LIMIT_KEYS, type PlanLimits } from "@/lib/plans";
import type { ReferralSettings } from "@/lib/referral";
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
    update: { platformName: s(formData, "platformName") || "SitePixl", supportEmail: s(formData, "supportEmail"), supportPhone: s(formData, "supportPhone") },
    create: { id: "singleton", platformName: s(formData, "platformName") || "SitePixl", supportEmail: s(formData, "supportEmail"), supportPhone: s(formData, "supportPhone") },
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

// No-code plan editor: price (₹/month) + every limit per tier (0 = unlimited).
// Blank fields fall back to the code defaults in plans.ts.
export async function savePlans(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const overrides: Record<string, { monthlyBase?: number; customDomain?: boolean; limits: Partial<PlanLimits> }> = {};
  for (const t of TIERS) {
    const priceR = parseFloat(formData.get(`price_${t.id}`)?.toString() ?? "");
    overrides[t.id] = { limits: {}, customDomain: formData.get(`customDomain_${t.id}`) === "on" };
    if (!isNaN(priceR)) overrides[t.id].monthlyBase = Math.max(0, Math.round(priceR * 100));
    for (const k of LIMIT_KEYS) {
      const v = parseInt(formData.get(`${k}_${t.id}`)?.toString() ?? "", 10);
      if (!isNaN(v)) overrides[t.id].limits[k] = Math.max(0, v);
    }
  }
  // Per-duration discount % (applies to every tier; checkout charges the same resolved price).
  const durations: Record<string, number> = {};
  for (const d of DURATIONS) {
    const v = parseInt(formData.get(`discount_${d.id}`)?.toString() ?? "", 10);
    if (!isNaN(v)) durations[d.id] = Math.min(90, Math.max(0, v));
  }
  const json = JSON.stringify({ ...overrides, durations });
  await db.platformConfig.upsert({ where: { id: "singleton" }, update: { planOverrides: json }, create: { id: "singleton", planOverrides: json } });
  revalidatePath("/super/settings");
  revalidatePath("/");
  revalidatePath("/subscribe");
  return { ok: true, message: "Plans updated — new prices, discounts & limits are live." };
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

// AI provider for the website builder. Keys/models are kept per provider (JSON maps), so
// switching provider never loses a saved key. A blank key field keeps the saved one.
export async function saveAi(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const provider = getProvider(s(formData, "aiProvider"));
  const apiKey = s(formData, "aiKey");
  const model = s(formData, "aiModel");
  const baseUrl = s(formData, "aiBaseUrl");
  if (model && !isValidModelId(model)) return { ok: false, message: `"${model}" doesn't look like a model id.` };
  if (provider.id === "custom") {
    if (!/^https?:\/\/\S+$/i.test(baseUrl)) return { ok: false, message: "Enter the provider's base URL, e.g. https://api.together.xyz/v1" };
    if (!model) return { ok: false, message: "Enter the model id for your custom provider." };
  }

  const cfg = await getPlatformConfig();
  const keys = parseMap(cfg.aiKeys);
  const models = parseMap(cfg.aiModels);
  if (apiKey) keys[provider.id] = apiKey;
  if (model) models[provider.id] = model;
  else delete models[provider.id];
  const data = {
    aiProvider: provider.id,
    aiKeys: JSON.stringify(keys),
    aiModels: JSON.stringify(models),
    ...(provider.id === "custom" ? { aiBaseUrl: baseUrl } : {}),
  };
  await db.platformConfig.upsert({ where: { id: "singleton" }, update: data, create: { id: "singleton", ...data } });
  revalidatePath("/super/settings");

  const hasKey = Boolean(keys[provider.id] || (provider.id === "groq" && (cfg.groqApiKey || process.env.GROQ_API_KEY)));
  const usedModel = model || (provider.id === "groq" ? cfg.groqModel : "") || provider.defaultModel;
  return {
    ok: true,
    message: hasKey
      ? `Saved — AI builder now uses ${provider.name} (${usedModel}). Use “Test connection” to check it.`
      : `Saved ${provider.name}, but no API key yet — add one to enable the AI builder.`,
  };
}

/** One tiny real request through the saved settings. */
export async function testAi(_prev: SettingsState): Promise<SettingsState> {
  await requireSuper();
  const { provider, model } = await getAiConfig();
  const t0 = Date.now();
  try {
    const out = await callGroqJson<{ ok?: boolean }>(
      [{ role: "user", content: 'Reply with exactly this JSON: {"ok":true}' }],
      200,
    );
    const ms = Date.now() - t0;
    return out?.ok
      ? { ok: true, message: `✓ ${provider.name} is working (${model}, ${ms} ms).` }
      : { ok: false, message: `${provider.name} answered, but not with the expected JSON. Try another model.` };
  } catch (e) {
    return { ok: false, message: e instanceof GroqError ? friendlyGroqError(e) : "Test failed." };
  }
}

export async function saveDemoSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const mode = formData.get("demoOtpMode")?.toString() === "whatsapp" ? "whatsapp" : "screen";
  const mins = parseInt(formData.get("demoDurationMinutes")?.toString() ?? "10", 10);
  const token = s(formData, "demoWhatsAppToken");
  const phoneId = s(formData, "demoWhatsAppPhoneId");
  await db.platformConfig.upsert({
    where: { id: "singleton" },
    update: {
      demoOtpMode: mode,
      demoDurationMinutes: isNaN(mins) ? 10 : Math.min(60, Math.max(5, mins)),
      ...(token ? { demoWhatsAppToken: token } : {}),
      ...(phoneId ? { demoWhatsAppPhoneId: phoneId } : {}),
    },
    create: {
      id: "singleton",
      demoOtpMode: mode,
      demoDurationMinutes: isNaN(mins) ? 10 : Math.min(60, Math.max(5, mins)),
      demoWhatsAppToken: token,
      demoWhatsAppPhoneId: phoneId,
    },
  });
  revalidatePath("/super/settings");
  return { ok: true, message: `Demo settings saved (${mode === "whatsapp" ? "WhatsApp OTP" : "on-screen test OTP"} · ${isNaN(mins) ? 10 : mins} min).` };
}

// Referral program rules. Rupee inputs are stored as paise.
export async function saveReferralSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSuper();
  const num = (k: string) => parseFloat(formData.get(k)?.toString() ?? "");
  const pct = num("commissionPct"), minOrder = num("minOrder"), minW = num("minWithdrawal"), hold = num("holdDays"), tds = num("tdsPct");
  if ([pct, minOrder, minW, hold, tds].some((v) => isNaN(v) || v < 0)) return { ok: false, message: "Enter valid non-negative numbers." };
  if (pct > 100 || tds > 100 || hold > 365) return { ok: false, message: "Percentages must be 0–100 and hold days 0–365." };
  const settings: ReferralSettings = {
    enabled: formData.get("enabled") === "on",
    commissionPct: Math.round(pct),
    minOrderPaise: Math.round(minOrder * 100),
    minWithdrawalPaise: Math.round(minW * 100),
    holdDays: Math.round(hold),
    firstPurchaseOnly: formData.get("firstPurchaseOnly") === "on",
    tdsPct: Math.round(tds),
  };
  const json = JSON.stringify(settings);
  await db.platformConfig.upsert({ where: { id: "singleton" }, update: { referralSettings: json }, create: { id: "singleton", referralSettings: json } });
  revalidatePath("/super/settings");
  return { ok: true, message: settings.enabled ? "Referral program saved — it's live." : "Saved. The referral program is paused." };
}
