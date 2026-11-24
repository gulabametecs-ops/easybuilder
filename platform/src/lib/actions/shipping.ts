"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { requireTenantId, getDemoWriteContext, persistDemoOverlay, ownedWhere, getDemoSessionId, type DemoWriteCtx } from "./guard";
import { getStoreSettings } from "@/lib/storeServer";
import { lookupPincode } from "@/lib/shipping";
import { DEFAULT_SHIPPING, inr, orderLabel, type OrderItem } from "@/lib/store";
import {
  delhiveryLabel, delhiveryReady, delhiveryShip, delhiveryTest, parseCourierCreds, shiprocketDocs, shiprocketReady, shiprocketShip, shiprocketTest,
  type CourierCreds, type ShipmentInput,
} from "@/lib/couriers";
import { addTimeline, advanceOrder, assignInvoiceNos, notifyCustomer, syncTracking } from "@/lib/fulfilment";
import { restoreStock } from "@/lib/storeCatalog";
import { refundOrder } from "@/lib/storePayments";

// Admin: shipping settings, courier booking, tracking refresh, invoices, returns.
// Demo sandboxes: settings go to the overlay; courier calls are simulated; no emails.

type Done = { ok: true; message?: string } | { ok: false; error: string };
const fail = (e: unknown): Done => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong" });

/** Raw SiteConfig.store JSON (demo overlay first) as an object, plus the demo context. */
async function readStoreJson(tenantId: string): Promise<{ demo: DemoWriteCtx | null; json: Record<string, unknown> }> {
  const demo = await getDemoWriteContext();
  const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } });
  const raw = demo?.overlay.siteConfig?.store ?? cfg?.store ?? "{}";
  try {
    const v = JSON.parse(raw || "{}");
    return { demo, json: v && typeof v === "object" ? v : {} };
  } catch {
    return { demo, json: {} };
  }
}

async function writeStoreJson(tenantId: string, demo: DemoWriteCtx | null, json: Record<string, unknown>) {
  const value = JSON.stringify(json);
  if (demo) {
    demo.overlay.siteConfig = { ...demo.overlay.siteConfig, store: value };
    await persistDemoOverlay(demo.sessionId, demo.overlay);
  } else {
    await db.siteConfig.update({ where: { tenantId }, data: { store: value } });
  }
}

// ─── Settings ───────────────────────────────────────────────────────────────
const int = (max: number) => z.number().int().min(0).max(max);
const pins = z.array(z.string().trim().regex(/^\d{1,6}$/, "Pincodes / prefixes are 1–6 digits")).max(2000);
const str = (max: number) => z.string().trim().max(max).default("");

const ShippingSchema = z.object({
  serviceArea: z.enum(["india", "zones", "local"]),
  localPincodes: pins,
  weightSlabs: z.array(z.object({ upToGrams: int(1_000_000).refine((n) => n > 0, "Slab weight must be more than 0 g"), fee: int(100_000) })).max(20),
  codFee: int(10_000),
  dispatchDays: int(30),
  etaMin: int(60),
  etaMax: int(60),
  zones: z.array(z.object({
    id: z.string().max(40),
    name: z.string().trim().min(1, "Every zone needs a name").max(60),
    states: z.array(z.string().trim().max(60)).max(40),
    pincodes: pins,
    fee: int(100_000),
    freeAbove: int(100_000_000),
    codAllowed: z.boolean(),
    codFee: int(10_000),
    etaMin: int(60),
    etaMax: int(60),
  })).max(50),
  defaultWeightGrams: int(100_000),
  returnWindowDays: int(90),
  pickup: z.object({
    name: str(120), phone: z.string().trim().max(20).refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Pickup phone needs 10 digits").default(""),
    email: z.union([z.literal(""), z.string().trim().email("Pickup email looks wrong").max(200)]).default(""),
    address: str(300), city: str(80), state: str(60), pincode: z.string().trim().regex(/^(\d{6})?$/, "Pickup pincode must be 6 digits").default(""),
  }),
  gstin: z.string().trim().toUpperCase().regex(/^([0-9]{2}[A-Z0-9]{13})?$/, "GSTIN is 15 characters (e.g. 27ABCDE1234F1Z5)").default(""),
  legalName: str(160),
  invoicePrefix: z.string().trim().max(12).regex(/^[A-Za-z0-9/_-]*$/, "Invoice prefix: letters, numbers, - / _ only").default("INV-"),
});
export type ShippingInput = z.input<typeof ShippingSchema>;

const CourierSchema = z.object({
  shiprocket: z.object({ email: z.union([z.literal(""), z.string().trim().email("Shiprocket email looks wrong").max(200)]), password: z.string().max(200), pickupLocation: z.string().trim().max(80) }),
  delhivery: z.object({ token: z.string().trim().max(200), pickupName: z.string().trim().max(120), staging: z.boolean() }),
});
export type CourierInput = z.input<typeof CourierSchema>;

const firstIssue = (e: z.ZodError) => { const i = e.issues[0]; return `${i.path.join(".") || "Input"}: ${i.message}`; };

/** Blank password/token = keep the saved one. */
function mergeCreds(saved: CourierCreds, input: z.output<typeof CourierSchema>): CourierCreds {
  return {
    shiprocket: { email: input.shiprocket.email, password: input.shiprocket.password || saved.shiprocket.password, pickupLocation: input.shiprocket.pickupLocation || "Primary" },
    delhivery: { token: input.delhivery.token || saved.delhivery.token, pickupName: input.delhivery.pickupName, staging: input.delhivery.staging },
  };
}

export async function saveShippingSettings(shipping: ShippingInput, courier: CourierInput): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const s = ShippingSchema.safeParse(shipping);
    if (!s.success) return { ok: false, error: firstIssue(s.error) };
    const c = CourierSchema.safeParse(courier);
    if (!c.success) return { ok: false, error: firstIssue(c.error) };
    const bad = s.data.zones.find((z) => !z.states.length && !z.pincodes.length);
    if (bad) return { ok: false, error: `Zone "${bad.name}" needs at least one state or pincode.` };
    if (s.data.serviceArea === "local" && !s.data.localPincodes.length) return { ok: false, error: "Add at least one pincode you deliver to, or choose another delivery area." };
    const { demo, json } = await readStoreJson(tenantId);
    const sh = { ...s.data, etaMax: Math.max(s.data.etaMin, s.data.etaMax), zones: s.data.zones.map((z) => ({ ...z, etaMax: Math.max(z.etaMin, z.etaMax) })) };
    await writeStoreJson(tenantId, demo, { ...json, shipping: sh, courier: mergeCreds(parseCourierCreds(JSON.stringify(json)), c.data) });
    revalidatePath("/admin/shipping");
    revalidatePath("/cart");
    return { ok: true, message: demo ? "Saved for this demo session." : "Shipping settings saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function testCourier(provider: "shiprocket" | "delhivery", draft: CourierInput): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const c = CourierSchema.safeParse(draft);
    if (!c.success) return { ok: false, error: firstIssue(c.error) };
    const { demo, json } = await readStoreJson(tenantId);
    const creds = mergeCreds(parseCourierCreds(JSON.stringify(json)), c.data);
    if (demo) return { ok: true, message: "Demo: connection test simulated — no request was sent to the courier." };
    if (provider === "shiprocket") {
      if (!shiprocketReady(creds)) return { ok: false, error: "Enter the Shiprocket API user email and password first." };
      const r = await shiprocketTest(creds.shiprocket);
      return r.ok ? { ok: true, message: r.note } : r;
    }
    if (!creds.delhivery.token) return { ok: false, error: "Enter your Delhivery API token first." };
    const r = await delhiveryTest(creds.delhivery);
    return r.ok ? { ok: true, message: r.note } : r;
  } catch (e) {
    return fail(e);
  }
}

// ─── Ship an order ──────────────────────────────────────────────────────────
const ShipSchema = z.object({
  provider: z.enum(["manual", "shiprocket", "delhivery"]),
  weightGrams: z.number().int().min(1, "Enter the package weight").max(100_000),
  lengthCm: z.number().int().min(1).max(300).default(20),
  breadthCm: z.number().int().min(1).max(300).default(15),
  heightCm: z.number().int().min(1).max(300).default(10),
  courier: z.string().trim().max(80).default(""),
  awb: z.string().trim().max(60).default(""),
  trackingUrl: z.string().trim().max(500).refine((v) => v === "" || /^https?:\/\//i.test(v), "Tracking link must start with https://").default(""),
});
export type ShipInput = z.input<typeof ShipSchema>;

export async function shipOrder(id: string, input: ShipInput): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const p = ShipSchema.safeParse(input);
    if (!p.success) return { ok: false, error: firstIssue(p.error) };
    const d = p.data;
    const o = await db.storeOrder.findFirst({ where: await ownedWhere(id, tenantId) });
    if (!o) return { ok: false, error: "Sample orders are read-only in the demo — place a test order on your store to try shipping." };
    if (o.status === "cancelled" || o.status === "delivered") return { ok: false, error: `This order is ${o.status}.` };
    const demoId = await getDemoSessionId();
    const settings = await getStoreSettings(tenantId, demoId);
    const prefix = settings.shipping.invoicePrefix;

    if (d.provider === "manual") {
      if (!d.courier && !d.awb) return { ok: false, error: "Enter the courier name and/or tracking number." };
      await advanceOrder(o.id, "shipped", ["Shipped", d.courier && `via ${d.courier}`, d.awb && `· AWB ${d.awb}`].filter(Boolean).join(" "), {
        shippingProvider: "manual", courier: d.courier, awb: d.awb, trackingUrl: d.trackingUrl, weightGrams: d.weightGrams, shipmentRef: "",
      });
      await assignInvoiceNos(tenantId, [o.id], prefix, o.demoSessionId);
      revalidatePath("/admin/orders");
      return { ok: true, message: "Marked as shipped." };
    }

    const label = d.provider === "shiprocket" ? "Shiprocket" : "Delhivery";
    if (o.demoSessionId) {
      // Demo: never call a real courier — simulate a booking so the flow can be tried.
      const awb = `DEMO${Date.now().toString().slice(-9)}`;
      await advanceOrder(o.id, "shipped", `Booked with ${label} (demo simulation) · AWB ${awb}`, {
        shippingProvider: "manual", courier: `${label} (demo)`, awb, trackingUrl: "", weightGrams: d.weightGrams, shipmentRef: "",
      });
      await assignInvoiceNos(tenantId, [o.id], prefix, o.demoSessionId);
      revalidatePath("/admin/orders");
      return { ok: true, message: `Demo: simulated ${label} booking (AWB ${awb}). Real stores book the courier here.` };
    }

    const { json } = await readStoreJson(tenantId);
    const creds = parseCourierCreds(JSON.stringify(json));
    if (d.provider === "shiprocket" ? !shiprocketReady(creds) : !delhiveryReady(creds)) return { ok: false, error: `Connect ${label} first in Shipping & delivery.` };
    const pickup = settings.shipping.pickup;
    if (!pickup.pincode || !pickup.address) return { ok: false, error: "Add your pickup address in Shipping & delivery first." };

    let { state, city } = o;
    if (!state || !city) {
      const info = await lookupPincode(o.pincode);
      state ||= info?.state ?? "";
      city ||= info?.city ?? "";
    }
    if (!state) return { ok: false, error: "Couldn't work out the customer's state from the pincode — check the pincode and try again." };

    let items: OrderItem[] = [];
    try { items = JSON.parse(o.items || "[]"); } catch { /* empty */ }
    const prods = new Map((await db.product.findMany({ where: { tenantId, id: { in: items.map((i) => i.productId) } }, select: { id: true, hsn: true, gstRate: true, sku: true } })).map((r) => [r.id, r]));
    const shipment: ShipmentInput = {
      orderNo: o.orderNo, orderDate: o.createdAt, customerName: o.customerName, phone: o.phone, email: o.email,
      address: o.address, addressLine2: o.addressLine2, city, state, pincode: o.pincode,
      items: items.map((i) => ({ name: i.name, sku: prods.get(i.productId)?.sku ?? "", qty: i.qty, price: i.price, hsn: prods.get(i.productId)?.hsn ?? "", gstRate: prods.get(i.productId)?.gstRate ?? 0 })),
      subtotal: o.subtotal, shipping: o.shipping + o.codFee, discount: o.discount, total: o.total,
      cod: o.paymentMethod === "cod" && o.paymentStatus !== "paid",
      weightGrams: d.weightGrams, lengthCm: d.lengthCm, breadthCm: d.breadthCm, heightCm: d.heightCm,
      pickup, sellerName: settings.shipping.legalName || (await getCurrentTenant())?.name || "Seller",
    };
    const reuse = o.shippingProvider === "shiprocket" ? o.shipmentRef : "";
    const r = d.provider === "shiprocket" ? await shiprocketShip(creds.shiprocket, shipment, reuse) : await delhiveryShip(creds.delhivery, shipment);
    if (!r.ok) {
      if (r.shipmentRef) await db.storeOrder.update({ where: { id: o.id }, data: { shippingProvider: d.provider, shipmentRef: r.shipmentRef, state, city } });
      return { ok: false, error: r.error };
    }
    await advanceOrder(o.id, "shipped", `Booked with ${label} · ${r.courier} · AWB ${r.awb}. ${r.note}`, {
      shippingProvider: d.provider, courier: r.courier, awb: r.awb, trackingUrl: r.trackingUrl, shipmentRef: r.shipmentRef, weightGrams: d.weightGrams, state, city,
    });
    await assignInvoiceNos(tenantId, [o.id], prefix, null);
    revalidatePath("/admin/orders");
    return { ok: true, message: `${label}: ${r.courier} · AWB ${r.awb}. ${r.note}` };
  } catch (e) {
    return fail(e);
  }
}

/** Shipping label / manifest PDF link from the partner. */
export async function courierDocument(id: string, kind: "label" | "manifest"): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const o = await db.storeOrder.findFirst({ where: await ownedWhere(id, tenantId), select: { shippingProvider: true, shipmentRef: true, awb: true, demoSessionId: true } });
    if (!o) return { ok: false, error: "Order not found." };
    if (o.demoSessionId) return { ok: false, error: "Demo: courier labels aren't generated in the demo — print the packing slip instead." };
    const creds = parseCourierCreds(JSON.stringify((await readStoreJson(tenantId)).json));
    if (o.shippingProvider === "shiprocket" && o.shipmentRef) return await shiprocketDocs(creds.shiprocket, o.shipmentRef, kind);
    if (o.shippingProvider === "delhivery" && o.awb) {
      if (kind === "manifest") return { ok: false, error: "Delhivery doesn't need a manifest — hand the packages over at pickup." };
      return await delhiveryLabel(creds.delhivery, o.awb);
    }
    return { ok: false, error: "This order wasn't booked with a courier partner." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

export async function refreshTracking(ids?: string[]): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    if (await getDemoSessionId()) return { ok: true, message: "Demo: tracking sync is simulated — mark orders delivered by hand." };
    const list = ids ? z.array(z.string().max(40)).max(500).parse(ids) : undefined;
    const r = await syncTracking({ tenantId, ids: list });
    revalidatePath("/admin/orders");
    if (!r.checked && !r.errors.length) return { ok: true, message: "No courier shipments to update (manual shipments are updated by you)." };
    const msg = `Checked ${r.checked} shipment(s)${r.delivered ? `, ${r.delivered} delivered` : ""}.`;
    return r.errors.length ? { ok: false, error: `${msg} ${r.errors.slice(0, 3).join(" ")}` } : { ok: true, message: msg };
  } catch (e) {
    return fail(e);
  }
}

/** Number invoices (first print) — then the client opens the print page. */
export async function prepareInvoices(ids: string[]): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const list = z.array(z.string().max(40)).min(1).max(200).parse(ids);
    const demoId = await getDemoSessionId();
    const settings = await getStoreSettings(tenantId, demoId);
    await assignInvoiceNos(tenantId, list, settings.shipping.invoicePrefix || DEFAULT_SHIPPING.invoicePrefix, demoId);
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ─── Returns ────────────────────────────────────────────────────────────────
const RETURN_FLOW: Record<string, string[]> = { requested: ["approved", "rejected"], approved: ["received", "rejected"], received: ["refunded"] };

export async function processReturn(id: string, next: "approved" | "rejected" | "received" | "refunded", refundAmount = 0, note = ""): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const o = await db.storeOrder.findFirst({ where: await ownedWhere(id, tenantId) });
    if (!o) return { ok: false, error: "Sample orders are read-only in the demo." };
    if (!RETURN_FLOW[o.returnStatus]?.includes(next)) return { ok: false, error: `Can't move a return from "${o.returnStatus}" to "${next}".` };
    const refund = z.number().int().min(0).max(o.total).parse(Math.round(refundAmount || 0));
    if (next === "refunded" && refund <= 0) return { ok: false, error: "Enter the refund amount." };
    const label = { approved: "Return approved", rejected: "Return rejected", received: "Returned item(s) received", refunded: `Refunded ${inr(refund)}` }[next];
    let timeline = o.timeline;
    if (next === "refunded") {
      // Online (Razorpay) payments are refunded through the gateway; other methods just record it.
      const r = await refundOrder(o.id, refund, "Return");
      if (!r.ok) return { ok: false, error: r.error };
      timeline = (await db.storeOrder.findUnique({ where: { id: o.id }, select: { timeline: true } }))?.timeline ?? timeline;
    }
    await db.storeOrder.update({
      where: { id: o.id },
      data: {
        returnStatus: next,
        timeline: addTimeline(timeline, `return_${next}`, [label, z.string().max(300).parse(note.trim())].filter(Boolean).join(" — ")),
      },
    });
    // Received → back in stock (real stores; demo orders never took stock).
    if (next === "received" && !o.demoSessionId) {
      let items: OrderItem[] = [];
      try { items = JSON.parse(o.items || "[]"); } catch { /* empty */ }
      const owned = new Set((await db.product.findMany({ where: { tenantId, id: { in: items.map((i) => i.productId) } }, select: { id: true } })).map((r) => r.id));
      await db.$transaction((tx) => restoreStock(tx, items.filter((i) => owned.has(i.productId)), 1));
    }
    await notifyCustomer(o.id, `return_${next}`);
    revalidatePath("/admin/returns");
    revalidatePath("/admin/orders");
    return { ok: true, message: `${orderLabel(o.orderNo)}: ${label}.` };
  } catch (e) {
    return fail(e);
  }
}
