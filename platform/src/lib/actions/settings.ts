"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getAuthedSession } from "@/lib/auth";

export type SettingsState = { ok: boolean; message: string };

export async function updateBusiness(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await getAuthedSession();
  if (!authed) return { ok: false, message: "Unauthorized" };
  const name = (formData.get("name")?.toString() ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Business name is too short." };
  await db.tenant.update({ where: { id: authed.tenant.id }, data: { name } });
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { ok: true, message: "Business name updated." };
}

export async function changePassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await getAuthedSession();
  if (!authed) return { ok: false, message: "Unauthorized" };

  const current = formData.get("current")?.toString() ?? "";
  const next = formData.get("next")?.toString() ?? "";
  if (next.length < 6) return { ok: false, message: "New password must be at least 6 characters." };

  const user = await db.user.findUnique({ where: { id: authed.session.userId } });
  if (!user || !(await bcrypt.compare(current, user.password))) {
    return { ok: false, message: "Current password is incorrect." };
  }
  await db.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 10) } });
  return { ok: true, message: "Password changed successfully." };
}
