"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { rateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/sanitizeHtml";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";
import { getStoreSettings } from "@/lib/storeServer";
import { MAX_QTY, inr, mapProduct, orderLabel, orderSummaryText, paymentMethods, priceOrder, waLink } from "@/lib/store";

// Public checkout for store sites. Prices, shipping and stock are recomputed from the DB.

const OrderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,18}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(200)]).default(""),
  address: z.string().trim().min(5, "Please enter your delivery address").max(500),
  city: z.string().trim().max(120).default(""),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  note: z.string().trim().max(500).default(""),
  paymentMethod: z.enum(["cod", "upi", "whatsapp"]),
  lines: z
    .array(z.object({ productId: z.string().min(1).max(40), qty: z.number().int().min(1).max(MAX_QTY), options: z.record(z.string().max(60), z.string().max(80)).default({}) }))
    .min(1, "Your cart is empty.")
    .max(50),
});

export type PlaceOrderInput = z.input<typeof OrderSchema>;
export type PlaceOrderResult =
  | { ok: true; orderNo: number; total: number; paymentMethod: string; upiId: string; upiQrImage: string; whatsappUrl: string }
  | { ok: false; error: string };

export async function placeStoreOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, error: "Store not found." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`order:${tenant.id}:${ip}`, 8, 15 * 60_000);
  if (!rl.ok) return { ok: false, error: `Too many orders. Please wait ${rl.retryAfterSec}s and try again.` };

  const parsed = OrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  const demo = isDemoSubdomain(tenant.subdomain) ? await getActiveDemoSessionForTenant(tenant) : null;
  if (isDemoSubdomain(tenant.subdomain) && !demo) return { ok: false, error: "This demo has ended." };
  const settings = await getStoreSettings(tenant.id, demo?.id ?? null);
  if (!paymentMethods(settings).includes(d.paymentMethod)) return { ok: false, error: "That payment option isn't available. Please choose another." };

  const ids = [...new Set(d.lines.map((l) => l.productId))];
  const rows = await db.product.findMany({
    where: { tenantId: tenant.id, published: true, id: { in: ids }, ...(demo ? { OR: [{ demoSessionId: null }, { demoSessionId: demo.id }] } : { demoSessionId: null }) },
  });
  const priced = priceOrder(d.lines, rows.map(mapProduct), settings);
  if (!priced.ok) return priced;

  // Order numbers count up per store from 1001; retry once if two orders race for the same number.
  let order: { id: string; orderNo: number } | null = null;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    const last = await db.storeOrder.aggregate({ where: { tenantId: tenant.id }, _max: { orderNo: true } });
    try {
      order = await db.storeOrder.create({
        data: {
          tenantId: tenant.id,
          orderNo: Math.max(1000, last._max.orderNo ?? 1000) + 1,
          customerName: d.name, phone: d.phone, email: d.email, address: d.address, city: d.city, pincode: d.pincode, note: d.note,
          items: JSON.stringify(priced.items), subtotal: priced.subtotal, shipping: priced.shipping, discount: 0, total: priced.total,
          paymentMethod: d.paymentMethod, demoSessionId: demo?.id ?? null,
        },
        select: { id: true, orderNo: true },
      });
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
  if (!order) return { ok: false, error: "Could not place the order. Please try again." };

  // Stock goes down on real stores only — demo tenants are shared by every visitor.
  if (!demo) {
    for (const i of priced.items) {
      await db.product.updateMany({ where: { id: i.productId, tenantId: tenant.id }, data: { stock: { decrement: i.qty } } });
    }
  }

  const summary = orderSummaryText({ bizName: tenant.name, orderNo: order.orderNo, ...priced, paymentMethod: d.paymentMethod, customerName: d.name, phone: d.phone, address: d.address, city: d.city, pincode: d.pincode });
  if (!demo) {
    const owners = await db.user.findMany({ where: { tenantId: tenant.id, role: { in: ["owner", "admin"] } }, select: { email: true } });
    const html = `<p>New order <strong>${orderLabel(order.orderNo)}</strong> on <strong>${escapeHtml(tenant.name)}</strong> — ${inr(priced.total)}</p><pre style="font-family:inherit">${escapeHtml(summary)}</pre><p>Open Admin → Orders to confirm it.</p>`;
    await Promise.all(owners.map((o) => sendEmail(o.email, `New order ${orderLabel(order!.orderNo)} — ${inr(priced.total)}`, html))).catch(() => {});
  }

  revalidatePath("/admin/orders");
  return {
    ok: true,
    orderNo: order.orderNo,
    total: priced.total,
    paymentMethod: d.paymentMethod,
    upiId: d.paymentMethod === "upi" ? settings.upiId : "",
    upiQrImage: d.paymentMethod === "upi" ? settings.upiQrImage : "",
    whatsappUrl: settings.whatsappNumber ? waLink(settings.whatsappNumber, `Hi! I just placed this order:\n\n${summary}`) : "",
  };
}
