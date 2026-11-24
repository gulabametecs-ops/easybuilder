"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { normCode } from "@/lib/checkout";
import { requireTenantId, getDemoSessionId, ownedWhere } from "./guard";

// Admin → Discounts (store coupons). Sandbox-aware: demo visitors create rows tagged with their
// session and can only change those.

type Done = { ok: true; id?: string } | { ok: false; error: string };
const fail = (e: unknown): Done => ({ ok: false, error: e instanceof Error ? e.message : "Something went wrong" });
const date = z.union([z.literal(""), z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date")]).default("");

const CouponSchema = z.object({
  id: z.string().max(40).optional(),
  code: z.string().transform(normCode).refine((v) => /^[A-Z0-9_-]{3,40}$/.test(v), "Code: 3–40 letters, numbers, - or _"),
  type: z.enum(["percent", "flat", "freeship"]),
  value: z.number().int().min(0).max(1_000_000).default(0),
  minOrder: z.number().int().min(0).max(100_000_000).default(0),
  maxDiscount: z.number().int().min(0).max(100_000_000).default(0),
  startsAt: date,
  endsAt: date,
  usageLimit: z.number().int().min(0).max(10_000_000).default(0),
  perCustomerLimit: z.number().int().min(0).max(1000).default(0),
  firstOrderOnly: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type CouponInput = z.input<typeof CouponSchema>;

const revalidate = () => {
  revalidatePath("/admin/discounts");
  revalidatePath("/checkout");
};

export async function saveCoupon(input: CouponInput): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const p = CouponSchema.safeParse(input);
    if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Please check the discount." };
    const { id, startsAt, endsAt, ...d } = p.data;
    if (d.type === "percent" && (d.value < 1 || d.value > 100)) return { ok: false, error: "Percentage must be 1–100." };
    if (d.type === "flat" && d.value < 1) return { ok: false, error: "Enter the discount amount." };
    const data = {
      ...d,
      value: d.type === "freeship" ? 0 : d.value,
      maxDiscount: d.type === "percent" ? d.maxDiscount : 0,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
    };
    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) return { ok: false, error: "End date must be after the start date." };
    const clash = await db.storeCoupon.findFirst({ where: { tenantId, code: data.code, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
    if (clash) return { ok: false, error: `${data.code} already exists — pick another code.` };
    if (id) {
      const r = await db.storeCoupon.updateMany({ where: await ownedWhere(id, tenantId), data });
      if (!r.count) return { ok: false, error: "Sample discounts are read-only in the demo — create your own to try editing." };
      revalidate();
      return { ok: true, id };
    }
    const row = await db.storeCoupon.create({ data: { tenantId, ...data, demoSessionId: await getDemoSessionId() } });
    revalidate();
    return { ok: true, id: row.id };
  } catch (e) {
    return fail(e);
  }
}

export async function setCouponActive(id: string, active: boolean): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const r = await db.storeCoupon.updateMany({ where: await ownedWhere(String(id), tenantId), data: { active: active === true } });
    revalidate();
    return r.count ? { ok: true } : { ok: false, error: "Sample discounts are read-only in the demo." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCoupon(id: string): Promise<Done> {
  try {
    const tenantId = await requireTenantId({ demoOk: true });
    const r = await db.storeCoupon.deleteMany({ where: await ownedWhere(String(id), tenantId) });
    revalidate();
    return r.count ? { ok: true } : { ok: false, error: "Sample discounts are read-only in the demo." };
  } catch (e) {
    return fail(e);
  }
}
