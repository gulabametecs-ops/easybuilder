"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { getPlatformConfig } from "@/lib/platformConfig";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { escapeHtml } from "@/lib/sanitizeHtml";

export type FormState = { ok: boolean; message: string };

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().optional().default(""),
  location: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

async function notifyTenantOwners(tenantId: string, subject: string, html: string) {
  const owners = await db.user.findMany({
    where: { tenantId, role: { in: ["owner", "admin"] } },
    select: { email: true },
  });
  await Promise.all(owners.map((o) => sendEmail(o.email, subject, html)));
  const cfg = await getPlatformConfig();
  if (cfg.supportEmail) {
    // Optional: also notify platform support for high-touch accounts — skipped by default.
  }
}

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`lead:${tenant.id}:${ip}`, 12, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many submissions. Please wait ${rl.retryAfterSec}s.` };

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service") ?? "",
    location: formData.get("location") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.lead.create({
    data: {
      tenantId: tenant.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      service: parsed.data.service ?? "",
      location: parsed.data.location ?? "",
      message: parsed.data.message ?? "",
      demoSessionId:
        isDemoSubdomain(tenant.subdomain)
          ? (await getActiveDemoSessionForTenant(tenant))?.id ?? null
          : null,
    },
  });

  // Skip owner emails for ephemeral demo sandboxes.
  if (!isDemoSubdomain(tenant.subdomain)) {
  const e = (v: string) => escapeHtml(v || "");
  const html = `
    <p>New lead on <strong>${e(tenant.name)}</strong></p>
    <ul>
      <li><strong>Name:</strong> ${e(parsed.data.name)}</li>
      <li><strong>Phone:</strong> ${e(parsed.data.phone)}</li>
      <li><strong>Email:</strong> ${e(parsed.data.email || "—")}</li>
      <li><strong>Service:</strong> ${e(parsed.data.service || "—")}</li>
      <li><strong>Location:</strong> ${e(parsed.data.location || "—")}</li>
      <li><strong>Message:</strong> ${e(parsed.data.message || "—")}</li>
    </ul>
    <p>Open your admin panel → Leads to follow up.</p>`;
  await notifyTenantOwners(tenant.id, `New lead: ${parsed.data.name.slice(0, 80)}`, html).catch(() => {});
  }

  return { ok: true, message: "Thank you! We've received your request and will call you back shortly." };
}

const apptSchema = leadSchema.extend({
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
});

export async function submitAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`appt:${tenant.id}:${ip}`, 12, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many submissions. Please wait ${rl.retryAfterSec}s.` };

  const parsed = apptSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service") ?? "",
    location: formData.get("location") ?? "",
    message: formData.get("message") ?? "",
    date: formData.get("date") ?? "",
    time: formData.get("time") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.appointment.create({
    data: {
      tenantId: tenant.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      service: parsed.data.service ?? "",
      date: parsed.data.date ?? "",
      time: parsed.data.time ?? "",
      message: parsed.data.message ?? "",
      demoSessionId:
        isDemoSubdomain(tenant.subdomain)
          ? (await getActiveDemoSessionForTenant(tenant))?.id ?? null
          : null,
    },
  });

  if (!isDemoSubdomain(tenant.subdomain)) {
  const e = (v: string) => escapeHtml(v || "");
  const html = `
    <p>New appointment request on <strong>${e(tenant.name)}</strong></p>
    <ul>
      <li><strong>Name:</strong> ${e(parsed.data.name)}</li>
      <li><strong>Phone:</strong> ${e(parsed.data.phone)}</li>
      <li><strong>Email:</strong> ${e(parsed.data.email || "—")}</li>
      <li><strong>Service:</strong> ${e(parsed.data.service || "—")}</li>
      <li><strong>Date:</strong> ${e(parsed.data.date || "—")}</li>
      <li><strong>Time:</strong> ${e(parsed.data.time || "—")}</li>
      <li><strong>Message:</strong> ${e(parsed.data.message || "—")}</li>
    </ul>`;
  await notifyTenantOwners(tenant.id, `New appointment: ${parsed.data.name.slice(0, 80)}`, html).catch(() => {});
  }

  return { ok: true, message: "Your appointment request is booked! We'll confirm shortly." };
}
