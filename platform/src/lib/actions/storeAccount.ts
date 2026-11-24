"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { rateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/sanitizeHtml";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { getSiteProductsByIds } from "@/lib/storeServer";
import { clearCustomerSession, getStoreCustomer, setCustomerSession, type CustomerAddress } from "@/lib/storeCustomer";
import type { PublicProduct } from "@/lib/store";

// Public shopper actions on store sites: email-OTP sign-in, profile, addresses, wishlist, reviews.

type Done = { ok: true } | { ok: false; error: string };

async function ctx() {
  const tenant = await getCurrentTenant();
  if (!tenant) throw new Error("Store not found.");
  const demoTenant = isDemoSubdomain(tenant.subdomain);
  const demo = demoTenant ? await getActiveDemoSessionForTenant(tenant) : null;
  if (demoTenant && !demo) throw new Error("This demo has ended.");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return { tenant, demo, ip };
}

const Email = z.string().trim().toLowerCase().email("Enter a valid email").max(191);

export async function requestCustomerOtp(email: string): Promise<{ ok: true; demoCode?: string } | { ok: false; error: string }> {
  const { tenant, demo, ip } = await ctx();
  const parsed = Email.safeParse(email);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const e = parsed.data;
  const rl = rateLimit(`cust-otp:${tenant.id}:${ip}:${e}`, 4, 15 * 60_000);
  const rlIp = rateLimit(`cust-otp-ip:${tenant.id}:${ip}`, 12, 60 * 60_000);
  if (!rl.ok || !rlIp.ok) return { ok: false, error: "Too many codes requested. Please wait a few minutes and try again." };

  const code = String(randomInt(100000, 1000000));
  const otp = { otpHash: await bcrypt.hash(code, 10), otpExpiresAt: new Date(Date.now() + 10 * 60_000) };
  const existing = await db.storeCustomer.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email: e } } });
  if (existing?.blocked) return { ok: false, error: "This account has been disabled. Please contact the store." };
  if (!existing) {
    await db.storeCustomer.create({ data: { tenantId: tenant.id, email: e, demoSessionId: demo?.id ?? null, ...otp } });
  } else if (demo && existing.demoSessionId !== demo.id) {
    // Demo tenants are shared: a new sandbox starts this email's account fresh.
    await db.storeCustomer.update({ where: { id: existing.id }, data: { ...otp, demoSessionId: demo.id, name: "", phone: "", addresses: "[]", wishlist: "[]", lastLoginAt: null } });
  } else {
    await db.storeCustomer.update({ where: { id: existing.id }, data: otp });
  }
  // Demo sandboxes show the code on screen (no real inbox involved).
  if (demo) return { ok: true, demoCode: code };
  await sendEmail(
    e,
    `${code} is your ${tenant.name} sign-in code`,
    `<p>Your sign-in code for <strong>${escapeHtml(tenant.name)}</strong> is</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you didn't ask for it, ignore this email.</p>`,
  );
  return { ok: true };
}

export async function verifyCustomerOtp(email: string, code: string): Promise<Done> {
  const { tenant, demo, ip } = await ctx();
  const e = Email.safeParse(email);
  if (!e.success || !/^\d{6}$/.test(code.trim())) return { ok: false, error: "Enter the 6-digit code from your email." };
  const rl = rateLimit(`cust-verify:${tenant.id}:${e.data}`, 6, 15 * 60_000);
  const rlIp = rateLimit(`cust-verify-ip:${tenant.id}:${ip}`, 20, 15 * 60_000);
  if (!rl.ok || !rlIp.ok) return { ok: false, error: "Too many attempts. Please request a new code in a few minutes." };
  const c = await db.storeCustomer.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email: e.data } } });
  if (!c || !c.otpHash || !c.otpExpiresAt || c.otpExpiresAt < new Date() || (demo && c.demoSessionId !== demo.id)) {
    return { ok: false, error: "That code has expired. Please request a new one." };
  }
  if (c.blocked) return { ok: false, error: "This account has been disabled. Please contact the store." };
  if (!(await bcrypt.compare(code.trim(), c.otpHash))) return { ok: false, error: "That code isn't right. Please check and try again." };
  await db.storeCustomer.update({ where: { id: c.id }, data: { otpHash: "", otpExpiresAt: null, lastLoginAt: new Date() } });
  await setCustomerSession(c.id, tenant.id);
  revalidatePath("/account");
  return { ok: true };
}

export async function signOutCustomer(): Promise<Done> {
  await clearCustomerSession();
  revalidatePath("/account");
  return { ok: true };
}

async function requireCustomer() {
  const c = await getStoreCustomer();
  if (!c || c.blocked) throw new Error("Please sign in again.");
  return c;
}

const Profile = z.object({
  name: z.string().trim().max(120).default(""),
  phone: z.union([z.literal(""), z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, "Enter a valid phone number")]).default(""),
  marketingOptIn: z.boolean().default(false),
});

export async function updateCustomerProfile(input: z.input<typeof Profile>): Promise<Done> {
  const c = await requireCustomer();
  const p = Profile.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  await db.storeCustomer.update({ where: { id: c.id }, data: p.data });
  revalidatePath("/account");
  return { ok: true };
}

const Address = z.object({
  id: z.string().trim().max(40).default(""),
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(5, "Enter the address").max(300),
  line2: z.string().trim().max(200).default(""),
  city: z.string().trim().max(120).default(""),
  state: z.string().trim().max(80).default(""),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean().default(false),
});
export type AddressInput = z.input<typeof Address>;

export async function saveCustomerAddresses(list: AddressInput[]): Promise<{ ok: true; addresses: CustomerAddress[] } | { ok: false; error: string }> {
  const c = await requireCustomer();
  const p = z.array(Address).max(10, "Up to 10 addresses").safeParse(list);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const firstDefault = p.data.findIndex((a) => a.isDefault);
  const addresses = p.data.map((a, i) => ({ ...a, id: a.id || `a${Date.now().toString(36)}${i}`, isDefault: i === (firstDefault < 0 ? 0 : firstDefault) }));
  await db.storeCustomer.update({ where: { id: c.id }, data: { addresses: JSON.stringify(addresses) } });
  revalidatePath("/account");
  return { ok: true, addresses };
}

const Ids = z.array(z.string().min(1).max(40)).max(200);

/** Toggle a product in the signed-in shopper's wishlist (guests keep theirs in localStorage). */
export async function toggleWishlist(productId: string, on: boolean): Promise<{ ok: boolean; signedIn: boolean }> {
  const c = await getStoreCustomer();
  if (!c || c.blocked) return { ok: true, signedIn: false };
  const id = z.string().min(1).max(40).parse(productId);
  const next = on ? [...new Set([...c.wishlist, id])] : c.wishlist.filter((x) => x !== id);
  await db.storeCustomer.update({ where: { id: c.id }, data: { wishlist: JSON.stringify(next.slice(-200)) } });
  return { ok: true, signedIn: true };
}

/** Merge a guest (localStorage) wishlist into the account and return the combined list. */
export async function mergeWishlist(ids: string[]): Promise<string[] | null> {
  const c = await getStoreCustomer();
  if (!c || c.blocked) return null;
  const merged = [...new Set([...c.wishlist, ...Ids.parse(ids)])].slice(-200);
  if (merged.length !== c.wishlist.length) await db.storeCustomer.update({ where: { id: c.id }, data: { wishlist: JSON.stringify(merged) } });
  return merged;
}

/** Published products by id (wishlist / recently viewed strips). */
export async function productsByIds(ids: string[]): Promise<PublicProduct[]> {
  const tenant = await getCurrentTenant();
  if (!tenant) return [];
  return getSiteProductsByIds(tenant.id, Ids.parse(ids).slice(0, 60));
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
const Review = z.object({
  productId: z.string().min(1).max(40),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  title: z.string().trim().max(120).default(""),
  body: z.string().trim().min(10, "Please write at least a few words").max(3000),
  /** Email or phone used at checkout — private, only to mark the review "Verified buyer". */
  contact: z.string().trim().max(200).default(""),
  website: z.string().max(0).default(""), // honeypot
});
export type ReviewInput = z.input<typeof Review>;

export async function submitReview(input: ReviewInput): Promise<Done> {
  const { tenant, demo, ip } = await ctx();
  const rl = rateLimit(`review:${tenant.id}:${ip}`, 5, 60 * 60_000);
  if (!rl.ok) return { ok: false, error: `Too many reviews. Please try again in ${Math.ceil(rl.retryAfterSec / 60)} min.` };
  const p = Review.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const d = p.data;
  const product = await db.product.findFirst({
    where: { id: d.productId, tenantId: tenant.id, published: true, ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : {}) },
    select: { id: true },
  });
  if (!product) return { ok: false, error: "Product not found." };

  const customer = await getStoreCustomer();
  const contacts = [customer?.email, customer?.phone, d.contact].filter((x): x is string => !!x);
  const emails = contacts.filter((x) => x.includes("@")).map((x) => x.toLowerCase());
  const phones = contacts.filter((x) => !x.includes("@")).map((x) => x.replace(/\D/g, "").slice(-10)).filter((x) => x.length === 10);
  // ponytail: scans up to 500 delivered orders of this product; index by phone digits if stores get huge.
  const delivered = emails.length || phones.length || customer
    ? await db.storeOrder.findMany({
        where: { tenantId: tenant.id, status: "delivered", items: { contains: d.productId }, demoSessionId: demo?.id ?? null },
        select: { email: true, phone: true, customerId: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      })
    : [];
  const verified = delivered.some((o) =>
    (customer && o.customerId === customer.id) || emails.includes(o.email.toLowerCase()) || phones.includes(o.phone.replace(/\D/g, "").slice(-10)));
  await db.productReview.create({
    data: { tenantId: tenant.id, productId: d.productId, name: d.name, rating: d.rating, title: d.title, body: d.body, verified, status: "pending", demoSessionId: demo?.id ?? null },
  });
  revalidatePath("/admin/reviews");
  return { ok: true };
}
