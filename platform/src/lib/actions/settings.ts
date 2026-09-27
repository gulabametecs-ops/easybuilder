"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getAuthedSession } from "@/lib/auth";
import { type AdminPrefs } from "@/lib/adminPrefs";

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

export async function updateProfile(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await getAuthedSession();
  if (!authed) return { ok: false, message: "Unauthorized" };
  const name = (formData.get("name")?.toString() ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Name is too short." };
  await db.user.update({ where: { id: authed.session.userId }, data: { name } });
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { ok: true, message: "Profile updated." };
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

export async function saveAdminPrefs(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await getAuthedSession();
  if (!authed) return { ok: false, message: "Unauthorized" };
  const prefs: AdminPrefs = {
    notifyLeads: formData.get("notifyLeads") === "on",
    notifyAppointments: formData.get("notifyAppointments") === "on",
    notifyWeeklySummary: formData.get("notifyWeeklySummary") === "on",
  };
  await db.siteConfig.upsert({
    where: { tenantId: authed.tenant.id },
    update: { adminPrefs: JSON.stringify(prefs) },
    create: { tenantId: authed.tenant.id, adminPrefs: JSON.stringify(prefs) },
  });
  revalidatePath("/admin/settings");
  return { ok: true, message: "Notification preferences saved." };
}

export async function requestCancellation(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const authed = await getAuthedSession();
  if (!authed) return { ok: false, message: "Unauthorized" };
  if (authed.session.role !== "owner") return { ok: false, message: "Only the owner can request cancellation." };
  const reason = (formData.get("reason")?.toString() ?? "").trim();
  if (reason.length < 5) return { ok: false, message: "Please share a short reason (at least 5 characters)." };
  await db.tenant.update({
    where: { id: authed.tenant.id },
    data: { cancelReason: reason, cancelledAt: new Date() },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/billing");
  return { ok: true, message: "Cancellation request submitted. Support will follow up shortly." };
}
