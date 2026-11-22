"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "./guard";
import { parsePayments } from "@/lib/payments";
import { INTEGRATION_BY_ID, LEGACY_SEO_FIELDS, isConnected, parseIntegrations, serializeIntegrations, validateIntegration } from "@/lib/integrations";

export type IntegrationResult = { ok: boolean; message: string };

const Input = z.object({
  id: z.string().max(40),
  values: z.record(z.string(), z.string().max(600)).default({}),
});

// Owner/admin only; demo-visitor sessions are refused by the guard (no demoOk),
// so a demo can never inject real third-party scripts.
async function auth() {
  try {
    return (await requireRole(["owner", "admin"])).tenant.id;
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unauthorized" } as IntegrationResult;
  }
}

function revalidate() {
  revalidatePath("/admin/integrations");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/seo");
  revalidatePath("/site", "layout");
}

async function load(tenantId: string) {
  const row = await db.siteConfig.findUnique({ where: { tenantId }, select: { integrations: true, payments: true } });
  return { integrations: parseIntegrations(row?.integrations), payments: parsePayments(row?.payments) };
}

async function write(tenantId: string, data: { integrations?: string; payments?: string }) {
  await db.siteConfig.upsert({ where: { tenantId }, update: data, create: { tenantId, ...data } });
}

// GA/GTM/Pixel/Clarity/verification used to live in SEO settings (still read as a
// fallback). Once managed here, clear the SEO copy so Integrations is the only source.
async function clearLegacySeo(tenantId: string, id: string) {
  const legacy = LEGACY_SEO_FIELDS[id];
  if (!legacy) return;
  const row = await db.siteConfig.findUnique({ where: { tenantId }, select: { seo: true } });
  let seo: Record<string, unknown>;
  try { seo = JSON.parse(row?.seo || "{}"); } catch { return; }
  if (!seo[legacy[1]]) return;
  seo[legacy[1]] = "";
  await db.siteConfig.update({ where: { tenantId }, data: { seo: JSON.stringify(seo) } });
}

export async function saveIntegration(input: unknown): Promise<IntegrationResult> {
  const tenantId = await auth();
  if (typeof tenantId !== "string") return tenantId;
  const parsed = Input.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  const { id, values } = parsed.data;
  const def = INTEGRATION_BY_ID.get(id);
  if (!def) return { ok: false, message: "Unknown integration." };

  const current = await load(tenantId);
  if (def.storage === "payments") {
    // Razorpay secret: blank keeps the saved one (it is never sent to the browser).
    if (id === "razorpay" && !values.razorpayKeySecret && !current.payments.razorpayKeySecret) {
      return { ok: false, message: "Key secret is required." };
    }
    const res = validateIntegration(id, values);
    if (!res.ok) return { ok: false, message: res.error };
    const next = { ...current.payments, ...res.values };
    if (id === "razorpay" && !res.values.razorpayKeySecret) next.razorpayKeySecret = current.payments.razorpayKeySecret;
    if (id === "upi") Object.assign(next, { upiId: res.values.upiId ?? "", upiQrImage: res.values.upiQrImage ?? "" });
    const marker = { ...current.integrations, [id]: { enabled: true, values: {}, updatedAt: new Date().toISOString() } };
    await write(tenantId, { payments: JSON.stringify(next), integrations: serializeIntegrations(marker) });
  } else {
    const res = validateIntegration(id, values);
    if (!res.ok) return { ok: false, message: res.error };
    const next = { ...current.integrations, [id]: { enabled: true, values: res.values, updatedAt: new Date().toISOString() } };
    await write(tenantId, { integrations: serializeIntegrations(next) });
    await clearLegacySeo(tenantId, id);
  }
  revalidate();
  return { ok: true, message: `${def.name} connected.` };
}

export async function toggleIntegration(id: string, enabled: boolean): Promise<IntegrationResult> {
  const tenantId = await auth();
  if (typeof tenantId !== "string") return tenantId;
  const def = INTEGRATION_BY_ID.get(String(id));
  if (!def) return { ok: false, message: "Unknown integration." };
  const { integrations, payments } = await load(tenantId);
  if (!isConnected(def, integrations, payments)) return { ok: false, message: "Connect it first." };
  // Payments-backed ones may have no marker yet (configured in Settings → Payments).
  const entry = Object.hasOwn(integrations, def.id) ? integrations[def.id] : (integrations[def.id] = { enabled: true, values: {} });
  entry.enabled = Boolean(enabled);
  entry.updatedAt = new Date().toISOString();
  await write(tenantId, { integrations: serializeIntegrations(integrations) });
  revalidate();
  return { ok: true, message: `${def.name} ${entry.enabled ? "turned on" : "turned off — settings kept"}.` };
}

export async function disconnectIntegration(id: string): Promise<IntegrationResult> {
  const tenantId = await auth();
  if (typeof tenantId !== "string") return tenantId;
  const def = INTEGRATION_BY_ID.get(String(id));
  if (!def) return { ok: false, message: "Unknown integration." };
  const current = await load(tenantId);
  if (def.storage === "payments") {
    const cleared = Object.fromEntries(def.fields.map((f) => [f.key, ""]));
    delete current.integrations[def.id];
    await write(tenantId, { payments: JSON.stringify({ ...current.payments, ...cleared }), integrations: serializeIntegrations(current.integrations) });
  } else {
    delete current.integrations[def.id];
    await write(tenantId, { integrations: serializeIntegrations(current.integrations) });
    await clearLegacySeo(tenantId, def.id);
  }
  revalidate();
  return { ok: true, message: `${def.name} disconnected.` };
}
