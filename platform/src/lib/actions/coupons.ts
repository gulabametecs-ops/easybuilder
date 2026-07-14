"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";

async function requireSuper() {
  const s = await getSuperSession();
  if (!s) throw new Error("Unauthorized");
}

export type CouponResult = { valid: boolean; code: string; percentOff: number; message: string };

// Public: validate a coupon (used on the checkout page to preview the discount).
export async function validateCoupon(code: string): Promise<CouponResult> {
  const c = code.trim().toUpperCase();
  if (!c) return { valid: false, code: "", percentOff: 0, message: "" };
  const coupon = await db.coupon.findUnique({ where: { code: c } });
  if (!coupon || !coupon.active) return { valid: false, code: c, percentOff: 0, message: "Invalid coupon code." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, code: c, percentOff: 0, message: "This coupon has expired." };
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return { valid: false, code: c, percentOff: 0, message: "This coupon has reached its usage limit." };
  return { valid: true, code: c, percentOff: coupon.percentOff, message: `${coupon.percentOff}% off applied!` };
}

// Marks a coupon as used (called after a successful order).
export async function redeemCoupon(code: string): Promise<void> {
  const c = code.trim().toUpperCase();
  if (!c) return;
  await db.coupon.updateMany({ where: { code: c, active: true }, data: { usedCount: { increment: 1 } } });
}

// ─── Super-admin CRUD ─────────────────────────────────────────────────────────
export async function createCoupon(formData: FormData) {
  await requireSuper();
  const code = (formData.get("code")?.toString() ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (!code) return;
  const percentOff = Math.min(100, Math.max(0, parseInt(formData.get("percentOff")?.toString() ?? "0", 10) || 0));
  const maxUses = Math.max(0, parseInt(formData.get("maxUses")?.toString() ?? "0", 10) || 0);
  const expiresRaw = formData.get("expiresAt")?.toString() ?? "";
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;
  const exists = await db.coupon.findUnique({ where: { code } });
  if (exists) return;
  await db.coupon.create({ data: { code, percentOff, maxUses, expiresAt } });
  revalidatePath("/super/coupons");
}

export async function toggleCoupon(id: string) {
  await requireSuper();
  const c = await db.coupon.findUnique({ where: { id } });
  if (!c) return;
  await db.coupon.update({ where: { id }, data: { active: !c.active } });
  revalidatePath("/super/coupons");
}

export async function deleteCoupon(id: string) {
  await requireSuper();
  await db.coupon.delete({ where: { id } });
  revalidatePath("/super/coupons");
}
