"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { createTenantFromTemplate } from "@/lib/provision";
import { ROOT_DOMAIN } from "@/lib/domains";

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

  if (RESERVED.has(subdomain)) {
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
  if (RESERVED.has(s)) return { available: false, reason: "reserved" };
  const taken = await db.tenant.findUnique({ where: { subdomain: s } });
  return { available: !taken, reason: taken ? "taken" : undefined };
}

// Demo request / contact form on the marketing site.
export type ContactState = { ok: boolean; message: string };
const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  message: z.string().optional().default(""),
  type: z.string().optional().default("demo"),
});

export async function submitDemoRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
    message: formData.get("message") ?? "",
    type: formData.get("type") ?? "demo",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await db.platformLead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? "",
      company: parsed.data.company ?? "",
      message: parsed.data.message ?? "",
      type: parsed.data.type ?? "demo",
    },
  });
  return { ok: true, message: "Thanks! We'll reach out shortly to set up your demo." };
}
