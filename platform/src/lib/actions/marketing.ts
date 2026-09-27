"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, getDemoSessionId, requireAuth } from "./guard";
import { demoVisibleWhere, isDemoSubdomain } from "@/lib/demoSession";
import { sendEmail } from "@/lib/email";
import { parseJson, type HeaderConfig } from "@/lib/config";
import { defaultHeader } from "@/lib/template";
import { escapeHtml, safeHref } from "@/lib/sanitizeHtml";
import { rateLimit } from "@/lib/rateLimit";

export type MktState = { ok: boolean; message: string };

const STATUSES = new Set(["draft", "active", "paused", "completed"]);
const PLATFORMS = new Set(["google", "meta", "instagram", "whatsapp", "local"]);
const OBJECTIVES = new Set(["leads", "traffic", "awareness", "sales", "calls"]);
const GENDERS = new Set(["all", "male", "female"]);

const MAX_NAME = 120;
const MAX_TEXT = 2000;
const MAX_URL = 2000;
const MAX_JSON = 4000;
const MAX_BLAST_SUBJECT = 200;
const MAX_BLAST_BODY = 5000;
const MAX_BLAST_RECIPIENTS = 200;
const MAX_PROMO_TEXT = 200;

function s(fd: FormData, k: string, max = MAX_TEXT) {
  return (fd.get(k)?.toString() ?? "").trim().slice(0, max);
}
function n(fd: FormData, k: string, max = 1_000_000_000) {
  const v = parseInt(fd.get(k)?.toString() ?? "", 10);
  if (isNaN(v)) return 0;
  return Math.min(max, Math.max(0, v));
}
function pick(v: string, allowed: Set<string>, fallback: string) {
  return allowed.has(v) ? v : fallback;
}

function campaignPayload(formData: FormData) {
  const ageMin = Math.min(100, Math.max(13, n(formData, "ageMin") || 18));
  const ageMax = Math.min(100, Math.max(ageMin, n(formData, "ageMax") || 65));
  return {
    name: s(formData, "name", MAX_NAME),
    platform: pick(s(formData, "platform", 40), PLATFORMS, "google"),
    objective: pick(s(formData, "objective", 40), OBJECTIVES, "leads"),
    service: s(formData, "service", 120),
    adImage: normalizeAdImage(s(formData, "adImage", MAX_URL)),
    headline: s(formData, "headline", 200),
    adText: s(formData, "adText", 1000),
    targetUrl: safeHref(s(formData, "targetUrl", MAX_URL)),
    budget: n(formData, "budget", 100_000_000),
    startDate: s(formData, "startDate", 32),
    endDate: s(formData, "endDate", 32),
    gender: pick(s(formData, "gender", 16), GENDERS, "all"),
    ageMin,
    ageMax,
    interests: s(formData, "interests", MAX_JSON) || "[]",
    locations: s(formData, "locations", MAX_JSON) || "[]",
    radiusKm: Math.min(500, n(formData, "radiusKm")),
  };
}

function normalizeAdImage(raw: string): string {
  const v = raw.trim().slice(0, MAX_URL);
  if (!v) return "";
  if (v.startsWith("/")) return v;
  return safeHref(v);
}

// ─── Ad campaigns ─────────────────────────────────────────────────────────────
export async function createCampaign(formData: FormData) {
  const tenantId = await requireTenantId();
  const name = s(formData, "name", MAX_NAME);
  if (!name) return;
  const data = campaignPayload(formData);
  await db.campaign.create({
    data: {
      tenantId,
      ...data,
      name,
      status: "draft",
    },
  });
  revalidatePath("/admin/marketing");
}

export async function updateCampaign(formData: FormData) {
  const tenantId = await requireTenantId();
  const id = s(formData, "id", 64);
  if (!id) return;
  const data = campaignPayload(formData);
  if (!data.name) return;
  await db.campaign.updateMany({
    where: { id, tenantId },
    data,
  });
  revalidatePath("/admin/marketing");
}

export async function updateCampaignMetrics(formData: FormData) {
  const tenantId = await requireTenantId();
  const id = s(formData, "id", 64);
  if (!id) return;
  await db.campaign.updateMany({
    where: { id, tenantId },
    data: {
      spend: n(formData, "spend", 100_000_000),
      clicks: n(formData, "clicks", 100_000_000),
      leads: n(formData, "leads", 100_000_000),
    },
  });
  revalidatePath("/admin/marketing");
}

export async function setCampaignStatus(id: string, status: string) {
  const tenantId = await requireTenantId();
  if (!id || !STATUSES.has(status)) return;
  await db.campaign.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/marketing");
}

export async function deleteCampaign(id: string) {
  const tenantId = await requireTenantId();
  if (!id) return;
  await db.campaign.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/marketing");
}

// Promo / announcement bar shown at the top of the public site.
export async function savePromo(_prev: MktState, formData: FormData): Promise<MktState> {
  const authed = await requireAuth();
  if (!["owner", "admin"].includes(authed.session.role)) {
    return { ok: false, message: "Only owners and admins can change the promo banner." };
  }
  const tenantId = authed.tenant.id;
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  const header = parseJson<HeaderConfig>(cfg?.header, defaultHeader(tenant?.name ?? "Business"));
  header.announcement = {
    show: formData.get("show") === "on",
    text: s(formData, "text", MAX_PROMO_TEXT),
    link: safeHref(s(formData, "link", MAX_URL)),
  };
  await db.siteConfig.update({ where: { tenantId }, data: { header: JSON.stringify(header) } });
  revalidatePath("/admin/marketing");
  revalidatePath("/");
  return { ok: true, message: header.announcement.show ? "Promo banner is now live on your website." : "Promo banner hidden." };
}

// Email campaign to captured leads.
export async function sendEmailBlast(_prev: MktState, formData: FormData): Promise<MktState> {
  const authed = await requireAuth({ demoOk: true });
  if (!["owner", "admin"].includes(authed.session.role)) {
    return { ok: false, message: "Only owners and admins can send email campaigns." };
  }
  const tenantId = authed.tenant.id;
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return { ok: false, message: "Tenant not found." };

  // Demo tenants must never trigger real outbound email (seeded / shared leads).
  if (isDemoSubdomain(tenant.subdomain)) {
    return { ok: false, message: "Email campaigns are disabled on demo sites." };
  }

  const rl = rateLimit(`email-blast:${tenantId}`, 3, 60 * 60_000);
  if (!rl.ok) {
    return { ok: false, message: `Too many email campaigns. Try again in ${rl.retryAfterSec}s.` };
  }

  const subject = s(formData, "subject", MAX_BLAST_SUBJECT);
  const body = s(formData, "body", MAX_BLAST_BODY);
  if (!subject || !body) return { ok: false, message: "Please enter a subject and message." };

  const demoId = await getDemoSessionId();
  // Blast must not include other demo sandboxes' leads; for normal tenants demoId is null.
  const leadWhere = demoId
    ? { tenantId, demoSessionId: demoId, email: { not: "" } }
    : { ...demoVisibleWhere(tenantId, null), email: { not: "" } };

  const leads = await db.lead.findMany({
    where: leadWhere,
    select: { email: true },
    take: MAX_BLAST_RECIPIENTS + 1,
  });
  const recipients = Array.from(new Set(leads.map((l) => l.email.trim().toLowerCase()).filter(Boolean)));
  if (!recipients.length) return { ok: false, message: "No leads with an email address yet." };
  if (recipients.length > MAX_BLAST_RECIPIENTS) {
    return { ok: false, message: `Too many recipients (max ${MAX_BLAST_RECIPIENTS}). Narrow your leads first.` };
  }

  const safeBody = escapeHtml(body).replace(/\n/g, "<br>");
  const safeName = escapeHtml(tenant.name);
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0f172a">${safeBody}<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0"><p style="color:#64748b;font-size:12px">Sent by ${safeName}.</p></div>`;

  let sent = 0, mock = false;
  for (const to of recipients) {
    const r = await sendEmail(to, subject, html);
    if (r.sent) sent++;
    if (r.mock) mock = true;
  }
  if (mock) {
    return {
      ok: true,
      message: `${recipients.length} recipient(s) queued (mock mode — add a Resend email key in Super Admin → Settings to send for real).`,
    };
  }
  return { ok: true, message: `Campaign sent to ${sent}/${recipients.length} lead(s).` };
}
