import { randomBytes } from "node:crypto";
import { db } from "./db";
import { sendEmail } from "./email";
import { escapeHtml } from "./sanitizeHtml";
import { ROOT_DOMAIN } from "./domains";
import { inr, optionText, orderLabel, type OrderItem } from "./store";
import { delhiveryTrack, parseCourierCreds, shiprocketReady, shiprocketTrack, type CourierCreds } from "./couriers";

// Order fulfilment core (server): timeline, customer/owner emails, invoice numbers, tracking sync.
// Demo orders (demoSessionId set) never email anyone and never touch courier APIs.

export type TimelineEntry = { at: string; status: string; note: string };

export function parseTimeline(raw: string | null | undefined): TimelineEntry[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((e) => e && typeof e.at === "string") : [];
  } catch {
    return [];
  }
}

export function addTimeline(raw: string | null | undefined, status: string, note = "", at = new Date()): string {
  return JSON.stringify([...parseTimeline(raw), { at: at.toISOString(), status, note: note.slice(0, 500) }].slice(-60));
}

export const newTrackToken = () => randomBytes(18).toString("base64url");

export function siteUrl(t: { subdomain: string; customDomain?: string | null }): string {
  if (t.customDomain) return `https://${t.customDomain}`;
  return `${ROOT_DOMAIN.includes("localhost") ? "http" : "https"}://${t.subdomain}.${ROOT_DOMAIN}`;
}

/** Track token for an order, creating one for orders placed before tokens existed. */
export async function ensureTrackToken(o: { id: string; trackToken: string }): Promise<string> {
  if (o.trackToken) return o.trackToken;
  const token = newTrackToken();
  await db.storeOrder.update({ where: { id: o.id }, data: { trackToken: token } });
  return token;
}

// ─── Emails ─────────────────────────────────────────────────────────────────
function emailHtml(biz: string, heading: string, body: string, cta?: { url: string; label: string }) {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
<p style="font-size:13px;color:#64748b;margin:0 0 4px">${escapeHtml(biz)}</p>
<h2 style="margin:0 0 14px;font-size:20px">${escapeHtml(heading)}</h2>${body}
${cta ? `<p style="margin:22px 0"><a href="${escapeHtml(cta.url)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:600;display:inline-block">${escapeHtml(cta.label)}</a></p>` : ""}
<p style="font-size:12px;color:#94a3b8;margin-top:28px">You're receiving this because you ordered from ${escapeHtml(biz)}.</p></div>`;
}

function itemsHtml(items: OrderItem[], total: number) {
  const rows = items.map((i) => `<tr><td style="padding:6px 0">${escapeHtml(i.name)}${Object.keys(i.options ?? {}).length ? ` <span style="color:#64748b">(${escapeHtml(optionText(i.options))})</span>` : ""} × ${i.qty}</td><td style="text-align:right">${inr(i.price * i.qty)}</td></tr>`).join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #e2e8f0;margin-top:12px">${rows}<tr><td style="padding-top:8px;font-weight:700">Total</td><td style="text-align:right;font-weight:700">${inr(total)}</td></tr></table>`;
}

export type CustomerNotice = "placed" | "shipped" | "delivered" | "cancelled" | "return_requested" | "return_approved" | "return_rejected" | "return_received" | "return_refunded";

/** Email the customer about their order. No-op for demo orders or orders without an email. */
export async function notifyCustomer(orderId: string, kind: CustomerNotice): Promise<void> {
  try {
    const o = await db.storeOrder.findUnique({ where: { id: orderId }, include: { tenant: { select: { name: true, subdomain: true, customDomain: true } } } });
    if (!o || o.demoSessionId || !o.email) return;
    const biz = o.tenant.name;
    const no = orderLabel(o.orderNo);
    const link = `${siteUrl(o.tenant)}/track/${await ensureTrackToken(o)}`;
    let items: OrderItem[] = [];
    try { items = JSON.parse(o.items || "[]"); } catch { /* none */ }
    const first = escapeHtml(o.customerName.split(" ")[0] || "there");
    const p = (s: string) => `<p style="font-size:15px;line-height:1.55;margin:0 0 10px">${s}</p>`;
    const track = { url: link, label: "Track your order" };
    const copy: Record<CustomerNotice, [string, string, { url: string; label: string } | undefined]> = {
      placed: [`Order ${no} confirmed`, p(`Hi ${first}, thanks for your order! We'll let you know when it ships.`) + itemsHtml(items, o.total), track],
      shipped: [`Order ${no} has shipped`, p(`Hi ${first}, your order is on its way${o.courier ? ` with <b>${escapeHtml(o.courier)}</b>` : ""}.`) + (o.awb ? p(`Tracking number (AWB): <b>${escapeHtml(o.awb)}</b>`) : ""), o.trackingUrl ? { url: o.trackingUrl, label: "Track with courier" } : track],
      delivered: [`Order ${no} delivered`, p(`Hi ${first}, your order has been delivered. We hope you love it!`), track],
      cancelled: [`Order ${no} cancelled`, p(`Hi ${first}, your order has been cancelled.${o.cancelReason ? ` Reason: ${escapeHtml(o.cancelReason)}.` : ""}`) + (o.paymentStatus === "paid" ? p("If you already paid, the store will refund you.") : ""), track],
      return_requested: [`Return requested for ${no}`, p(`Hi ${first}, we've received your return request. The store will review it shortly.`), track],
      return_approved: [`Return approved for ${no}`, p(`Hi ${first}, your return has been approved. The store will contact you about pickup or drop-off.`), track],
      return_rejected: [`Return update for ${no}`, p(`Hi ${first}, unfortunately your return request couldn't be accepted. Please contact the store if you have questions.`), track],
      return_received: [`Return received for ${no}`, p(`Hi ${first}, we've received your returned item(s). Your refund is being processed.`), track],
      return_refunded: [`Refund for ${no}`, p(`Hi ${first}, a refund of <b>${inr(o.refundAmount)}</b> has been issued for your return.`), track],
    };
    const [subject, body, cta] = copy[kind];
    await sendEmail(o.email, `${subject} — ${biz}`, emailHtml(biz, subject, body, cta));
  } catch (e) {
    console.error("[fulfilment] notifyCustomer", kind, e);
  }
}

export async function notifyOwners(tenantId: string, subject: string, bodyHtml: string): Promise<void> {
  try {
    const owners = await db.user.findMany({ where: { tenantId, role: { in: ["owner", "admin"] } }, select: { email: true } });
    await Promise.all(owners.map((u) => sendEmail(u.email, subject, bodyHtml)));
  } catch (e) {
    console.error("[fulfilment] notifyOwners", e);
  }
}

// ─── Status changes that don't touch stock (ship / deliver) ─────────────────
/** Move an order to shipped/delivered (+ timeline, deliveredAt, customer email). Cancels go through updateOrder (restock). */
export async function advanceOrder(orderId: string, status: "shipped" | "delivered", note: string, extra: Record<string, unknown> = {}, at?: Date) {
  const o = await db.storeOrder.findUnique({ where: { id: orderId }, select: { timeline: true, status: true } });
  if (!o) return;
  await db.storeOrder.update({
    where: { id: orderId },
    data: { ...extra, status, timeline: addTimeline(o.timeline, status, note, at), ...(status === "delivered" ? { deliveredAt: at ?? new Date() } : {}) },
  });
  if (o.status !== status) await notifyCustomer(orderId, status);
}

// ─── Invoice numbers ────────────────────────────────────────────────────────
/** Give each order without one the next sequential invoice number (per store; demo sandboxes count separately). */
export async function assignInvoiceNos(tenantId: string, ids: string[], prefix: string, demoSessionId: string | null): Promise<void> {
  const todo = await db.storeOrder.findMany({ where: { tenantId, id: { in: ids }, invoiceNo: "", demoSessionId, status: { not: "cancelled" } }, orderBy: { orderNo: "asc" }, select: { id: true } });
  if (!todo.length) return;
  // ponytail: count-based sequence — two owners printing at the same instant could collide; a counter row if that ever happens.
  let n = await db.storeOrder.count({ where: { tenantId, demoSessionId, invoiceNo: { not: "" } } });
  for (const o of todo) {
    n += 1;
    await db.storeOrder.updateMany({ where: { id: o.id, invoiceNo: "" }, data: { invoiceNo: `${prefix || "INV-"}${String(n).padStart(4, "0")}` } });
  }
}

// ─── Courier credentials + tracking sync ────────────────────────────────────
export async function loadCourierCreds(tenantId: string): Promise<CourierCreds> {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId }, select: { store: true } });
  return parseCourierCreds(cfg?.store);
}

/** Pull courier status for shipped orders (real stores only). Marks delivered; logs status changes in the timeline. */
export async function syncTracking(scope: { tenantId?: string; ids?: string[] } = {}): Promise<{ checked: number; delivered: number; errors: string[] }> {
  const orders = await db.storeOrder.findMany({
    where: { status: "shipped", demoSessionId: null, awb: { not: "" }, shippingProvider: { in: ["shiprocket", "delhivery"] }, ...(scope.tenantId ? { tenantId: scope.tenantId } : {}), ...(scope.ids ? { id: { in: scope.ids } } : {}) },
    select: { id: true, tenantId: true, orderNo: true, awb: true, shippingProvider: true, timeline: true },
    orderBy: { updatedAt: "asc" },
    take: 300,
  });
  const creds = new Map<string, CourierCreds>();
  const out = { checked: 0, delivered: 0, errors: [] as string[] };
  for (const o of orders) {
    if (!creds.has(o.tenantId)) creds.set(o.tenantId, await loadCourierCreds(o.tenantId));
    const c = creds.get(o.tenantId)!;
    const sr = o.shippingProvider === "shiprocket";
    if (sr ? !shiprocketReady(c) : !c.delhivery.token) { out.errors.push(`${orderLabel(o.orderNo)}: ${sr ? "Shiprocket" : "Delhivery"} isn't connected.`); continue; }
    const t = sr ? await shiprocketTrack(c.shiprocket, o.awb) : await delhiveryTrack(c.delhivery, o.awb);
    out.checked += 1;
    if (!t.ok) { out.errors.push(`${orderLabel(o.orderNo)}: ${t.error}`); continue; }
    const where = t.events[0]?.location ? ` — ${t.events[0].location}` : "";
    if (t.state === "delivered") {
      const at = t.deliveredAt ? new Date(t.deliveredAt.replace(" ", "T")) : new Date();
      await advanceOrder(o.id, "delivered", `Delivered (courier update)${where}`, {}, isNaN(at.getTime()) ? new Date() : at);
      out.delivered += 1;
    } else {
      const note = `Courier: ${t.label}${where}`;
      const tl = parseTimeline(o.timeline);
      if (tl[tl.length - 1]?.note !== note) await db.storeOrder.update({ where: { id: o.id }, data: { timeline: addTimeline(o.timeline, "shipped", note) } });
      else await db.storeOrder.update({ where: { id: o.id }, data: { updatedAt: new Date() } }); // rotate to the back of the queue
    }
  }
  return out;
}

/** Daily job entry: sync every store's shipped orders. */
export async function runTrackingSync() {
  try {
    const r = await syncTracking();
    return { checked: r.checked, delivered: r.delivered, errors: r.errors.length };
  } catch (e) {
    console.error("[fulfilment] tracking sync", e);
    return { checked: 0, delivered: 0, errors: 1 };
  }
}
