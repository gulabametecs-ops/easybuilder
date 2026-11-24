"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sendCartReminder } from "@/lib/abandonedCarts";
import { requireTenantId, getDemoSessionId } from "./guard";

type Done = { ok: true; message: string } | { ok: false; error: string };

/** Admin → Abandoned checkouts → "Email reminder". Demo: simulated (no email). */
export async function sendAbandonedReminder(id: string): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const demoId = await getDemoSessionId();
    const cart = await db.abandonedCart.findFirst({ where: { id: String(id), tenantId, demoSessionId: demoId }, include: { tenant: { select: { name: true, subdomain: true, customDomain: true } } } });
    if (!cart) return { ok: false, error: "Checkout not found." };
    if (!cart.email) return { ok: false, error: "This shopper didn't leave an email — use WhatsApp instead." };
    if (cart.recovered) return { ok: false, error: "This checkout already turned into an order." };
    if (demoId) {
      await db.abandonedCart.update({ where: { id: cart.id }, data: { reminderSentAt: new Date() } });
      revalidatePath("/admin/abandoned");
      return { ok: true, message: "Demo: reminder marked as sent (no email goes out in the demo)." };
    }
    const ok = await sendCartReminder(cart, cart.tenant);
    revalidatePath("/admin/abandoned");
    return ok ? { ok: true, message: `Reminder sent to ${cart.email}.` } : { ok: false, error: "Email isn't set up yet — use WhatsApp instead." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

export async function deleteAbandoned(id: string): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const r = await db.abandonedCart.deleteMany({ where: { id: String(id), tenantId, demoSessionId: await getDemoSessionId() } });
    revalidatePath("/admin/abandoned");
    return r.count ? { ok: true, message: "Removed." } : { ok: false, error: "Not found." };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}
