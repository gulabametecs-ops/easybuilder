"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { createTenantFromTemplate } from "@/lib/provision";
import { ROOT_DOMAIN } from "@/lib/domains";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import { getVertical } from "@/lib/verticals";

const RESERVED = new Set(["www", "admin", "api", "app", "mail", "ftp", "root", "demo", "dashboard", "static", "assets", "cdn", "help", "support", "blog"]);

export type SignupState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; subdomain: string; url: string; adminUrl: string; email: string };

const schema = z.object({
  businessName: z.string().min(2, "Business name is too short"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(32, "Subdomain is too long")
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Use only lowercase letters, numbers and hyphens"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = schema.safeParse({
    businessName: formData.get("businessName"),
    subdomain: (formData.get("subdomain")?.toString() ?? "").toLowerCase().trim(),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { businessName, subdomain, email, password } = parsed.data;

  if (RESERVED.has(subdomain) || subdomain.startsWith("ai-")) {
    return { status: "error", message: "That subdomain is reserved. Please choose another." };
  }
  const taken = await db.tenant.findUnique({ where: { subdomain } });
  if (taken) {
    return { status: "error", message: `"${subdomain}" is already taken. Try another.` };
  }

  try {
    await createTenantFromTemplate({
      businessName,
      subdomain,
      ownerEmail: email,
      ownerPassword: password,
      plan: "starter",
      status: "trial",
    });
  } catch {
    return { status: "error", message: "Something went wrong creating your site. Please try again." };
  }

  const protocol = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${subdomain}.${ROOT_DOMAIN}`;
  return {
    status: "success",
    subdomain,
    url,
    adminUrl: `${url}/admin/login`,
    email,
  };
}

// Live availability check for the subdomain field.
export async function checkSubdomain(sub: string): Promise<{ available: boolean; reason?: string }> {
  const s = sub.toLowerCase().trim();
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(s) || s.length < 3) {
    return { available: false, reason: "invalid" };
  }
  if (RESERVED.has(s) || s.startsWith("ai-")) return { available: false, reason: "reserved" };
  const taken = await db.tenant.findUnique({ where: { subdomain: s } });
  return { available: !taken, reason: taken ? "taken" : undefined };
}

// Demo request / contact form on the marketing site.
export type ContactState = { ok: boolean; message: string };
const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z.string().trim().max(20).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000, "Message is too long").optional().default(""),
  type: z.enum(["demo", "contact"]).catch("demo"),
  vertical: z.string().max(40).optional().default(""),
  contactVia: z.enum(["call", "whatsapp", "email"]).catch("call"),
});

export async function submitDemoRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`demo-request:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many requests. Please try again in ${rl.retryAfterSec} seconds.` };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
    message: formData.get("message") ?? "",
    type: formData.get("type") ?? "demo",
    vertical: formData.get("vertical") ?? "",
    contactVia: formData.get("contactVia") ?? "call",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  if (d.contactVia !== "email" && d.phone.replace(/\D/g, "").length < 7) {
    return { ok: false, message: "Add a phone number so we can call or WhatsApp you — or choose Email." };
  }
  await db.platformLead.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone,
      company: d.company,
      vertical: getVertical(d.vertical) ? d.vertical : "",
      message: `[Prefers: ${d.contactVia}] ${d.message}`.trim(),
      type: d.type,
    },
  });
  return { ok: true, message: "Thanks! We'll reach out shortly to set up your demo." };
}
