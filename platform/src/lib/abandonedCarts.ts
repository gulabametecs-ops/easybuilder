import { db } from "./db";
import { sendEmail } from "./email";
import { escapeHtml } from "./sanitizeHtml";
import { siteUrl } from "./fulfilment";
import { inr, jsonList, optionText, type OrderItem } from "./store";

// Abandoned checkouts (server): restore links + reminder emails. Demo carts never email anyone.

export const restorePath = (token: string) => `/cart?restore=${encodeURIComponent(token)}`;

type CartRow = { id: string; token: string; name: string; email: string; items: string; subtotal: number; demoSessionId: string | null };
type TenantRow = { name: string; subdomain: string; customDomain: string | null };

export async function sendCartReminder(cart: CartRow, tenant: TenantRow): Promise<boolean> {
  if (cart.demoSessionId || !cart.email) return false;
  const link = `${siteUrl(tenant)}${restorePath(cart.token)}`;
  const items = jsonList<OrderItem>(cart.items);
  const rows = items.map((i) => `<tr><td style="padding:6px 0">${escapeHtml(i.name)}${Object.keys(i.options ?? {}).length ? ` <span style="color:#64748b">(${escapeHtml(optionText(i.options))})</span>` : ""} × ${i.qty}</td><td style="text-align:right">${inr(i.price * i.qty)}</td></tr>`).join("");
  const first = escapeHtml(cart.name.split(" ")[0] || "there");
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
<p style="font-size:13px;color:#64748b;margin:0 0 4px">${escapeHtml(tenant.name)}</p>
<h2 style="margin:0 0 14px;font-size:20px">You left something in your cart</h2>
<p style="font-size:15px;line-height:1.55">Hi ${first}, your items are still waiting — complete your order before they sell out.</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #e2e8f0;margin-top:12px">${rows}<tr><td style="padding-top:8px;font-weight:700">Subtotal</td><td style="text-align:right;font-weight:700">${inr(cart.subtotal)}</td></tr></table>
<p style="margin:22px 0"><a href="${escapeHtml(link)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:600;display:inline-block">Complete my order</a></p>
<p style="font-size:12px;color:#94a3b8;margin-top:28px">You're receiving this because you started a checkout at ${escapeHtml(tenant.name)}.</p></div>`;
  const r = await sendEmail(cart.email, `Your cart at ${tenant.name} is waiting`, html);
  await db.abandonedCart.update({ where: { id: cart.id }, data: { reminderSentAt: new Date() } });
  return r.sent || r.mock;
}

/** Daily job: one automatic reminder for carts idle 4–48 h with an email, never reminded, not recovered. */
export async function runAbandonedReminders() {
  try {
    const now = Date.now();
    const carts = await db.abandonedCart.findMany({
      where: { recovered: false, reminderSentAt: null, demoSessionId: null, email: { not: "" }, updatedAt: { lt: new Date(now - 4 * 3600_000), gt: new Date(now - 48 * 3600_000) } },
      include: { tenant: { select: { name: true, subdomain: true, customDomain: true } } },
      take: 300,
    });
    let sent = 0;
    for (const c of carts) if (await sendCartReminder(c, c.tenant).catch(() => false)) sent += 1;
    return { sent };
  } catch (e) {
    console.error("[abandoned] reminders", e);
    return { sent: 0, error: true };
  }
}
