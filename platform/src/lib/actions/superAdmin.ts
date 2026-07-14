"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { createImpersonationToken } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/domains";
import { createTenantFromTemplate } from "@/lib/provision";
import { getVertical } from "@/lib/verticals";
import { assignInvoiceNo } from "@/lib/invoice";

const RESERVED = new Set(["www", "admin", "api", "app", "mail", "ftp", "root", "demo", "super", "dashboard", "static", "assets", "cdn"]);

async function requireSuper() {
  const s = await getSuperSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

function addMonths(from: Date, months: number): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d;
}

export type CreateClientState = { error: string };

const createSchema = z.object({
  businessName: z.string().min(2, "Business name is too short"),
  subdomain: z.string().min(3).max(32).regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Invalid subdomain"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  vertical: z.string().min(1),
  plan: z.string().min(1),
  months: z.string().optional().default("12"),
});

// Manually create (provision) a client from the super admin.
export async function createClient(_prev: CreateClientState, formData: FormData): Promise<CreateClientState> {
  await requireSuper();
  const parsed = createSchema.safeParse({
    businessName: formData.get("businessName"),
    subdomain: (formData.get("subdomain")?.toString() ?? "").toLowerCase().trim(),
    email: formData.get("email"),
    password: formData.get("password"),
    vertical: formData.get("vertical"),
    plan: formData.get("plan"),
    months: formData.get("months") ?? "12",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const d = parsed.data;
  if (!getVertical(d.vertical)) return { error: "Unknown sector." };
  if (RESERVED.has(d.subdomain)) return { error: "That subdomain is reserved." };
  if (await db.tenant.findUnique({ where: { subdomain: d.subdomain } })) {
    return { error: `"${d.subdomain}" is already taken.` };
  }

  const months = d.months === "lifetime" ? null : parseInt(d.months || "12", 10);
  const subscriptionEndsAt = months === null ? null : addMonths(new Date(), months);

  let tenantId = "";
  try {
    const tenant = await createTenantFromTemplate({
      businessName: d.businessName,
      subdomain: d.subdomain,
      ownerEmail: d.email,
      ownerPassword: d.password,
      vertical: d.vertical,
      plan: d.plan,
      status: "active",
      subscriptionEndsAt,
    });
    tenantId = tenant.id;
  } catch {
    return { error: "Could not create the client. Please try again." };
  }
  redirect(`/super/clients/${tenantId}`);
}

// Extend a client's subscription by N months, or set it to lifetime.
export async function extendSubscription(tenantId: string, plan: "1" | "3" | "6" | "12" | "24" | "lifetime") {
  await requireSuper();
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return;

  if (plan === "lifetime") {
    await db.tenant.update({ where: { id: tenantId }, data: { subscriptionEndsAt: null, status: "active" } });
  } else {
    const months = parseInt(plan, 10);
    const now = new Date();
    const base = tenant.subscriptionEndsAt && new Date(tenant.subscriptionEndsAt) > now ? new Date(tenant.subscriptionEndsAt) : now;
    await db.tenant.update({ where: { id: tenantId }, data: { subscriptionEndsAt: addMonths(base, months), status: "active" } });
  }
  revalidatePath(`/super/clients/${tenantId}`);
  revalidatePath("/super/clients");
}

// Activate / suspend a client (suspended sites can be blocked by the proxy later).
export async function setTenantStatus(tenantId: string, status: "active" | "suspended") {
  await requireSuper();
  await db.tenant.update({ where: { id: tenantId }, data: { status } });
  revalidatePath(`/super/clients/${tenantId}`);
  revalidatePath("/super/clients");
}

export async function setTenantPlan(tenantId: string, plan: string) {
  await requireSuper();
  await db.tenant.update({ where: { id: tenantId }, data: { plan } });
  revalidatePath(`/super/clients/${tenantId}`);
}

// Record an offline/manual payment (cash/UPI/bank) and extend the license.
export async function recordManualPayment(formData: FormData) {
  await requireSuper();
  const tenantId = formData.get("tenantId")?.toString() ?? "";
  const amountRupees = parseFloat(formData.get("amount")?.toString() ?? "0") || 0;
  const method = formData.get("method")?.toString() ?? "cash";
  const months = formData.get("months")?.toString() ?? "12";

  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return;
  const owner = await db.user.findFirst({ where: { tenantId } });

  const order = await db.order.create({
    data: {
      customerName: tenant.name,
      email: owner?.email ?? "",
      company: tenant.name,
      vertical: tenant.vertical,
      subdomain: tenant.subdomain,
      plan: `${tenant.plan}-${months === "lifetime" ? "lifetime" : months + "m"}`,
      amount: Math.round(amountRupees * 100),
      gateway: `manual-${method}`,
      status: "provisioned",
      tenantId,
    },
  });
  await assignInvoiceNo(order.id);

  if (months === "lifetime") {
    await db.tenant.update({ where: { id: tenantId }, data: { subscriptionEndsAt: null, status: "active" } });
  } else {
    const now = new Date();
    const base = tenant.subscriptionEndsAt && new Date(tenant.subscriptionEndsAt) > now ? new Date(tenant.subscriptionEndsAt) : now;
    await db.tenant.update({ where: { id: tenantId }, data: { subscriptionEndsAt: addMonths(base, parseInt(months, 10)), status: "active" } });
  }
  revalidatePath(`/super/clients/${tenantId}`);
}

// Log in as a client (impersonate) — opens their admin panel directly.
export async function impersonateClient(tenantId: string) {
  await requireSuper();
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return;
  const user = (await db.user.findFirst({ where: { tenantId, role: "owner" } })) ?? (await db.user.findFirst({ where: { tenantId } }));
  if (!user) return;
  const token = await createImpersonationToken({
    userId: user.id,
    tenantId,
    email: user.email,
    role: user.role,
    name: user.name ?? tenant.name,
  });
  const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  redirect(`${proto}://${tenant.subdomain}.${ROOT_DOMAIN}/admin/impersonate?t=${token}`);
}

// Record a refund against an order (excludes it from revenue).
export async function recordRefund(formData: FormData) {
  await requireSuper();
  const orderId = formData.get("orderId")?.toString() ?? "";
  const reason = formData.get("reason")?.toString() ?? "";
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  await db.order.update({ where: { id: orderId }, data: { status: "refunded", refundReason: reason, refundedAt: new Date() } });
  if (order.tenantId) revalidatePath(`/super/clients/${order.tenantId}`);
  revalidatePath("/super/orders");
}

// Cancel a client's subscription (marks cancelled; site keeps working until it expires).
export async function cancelSubscription(tenantId: string, reason?: string) {
  await requireSuper();
  await db.tenant.update({ where: { id: tenantId }, data: { status: "cancelled", cancelledAt: new Date(), ...(reason ? { cancelReason: reason } : {}) } });
  revalidatePath(`/super/clients/${tenantId}`);
  revalidatePath("/super/clients");
}

// Permanently delete a client and all its data.
export async function deleteTenant(tenantId: string) {
  await requireSuper();
  await db.tenant.delete({ where: { id: tenantId } });
  revalidatePath("/super/clients");
  redirect("/super/clients");
}
