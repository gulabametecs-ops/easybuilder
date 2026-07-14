"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";

// ─── Leads ───────────────────────────────────────────────────────────────────
export async function updateLeadStatus(id: string, status: string) {
  const tenantId = await requireTenantId();
  await db.lead.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  const tenantId = await requireTenantId();
  await db.lead.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/leads");
}

// ─── Appointments ────────────────────────────────────────────────────────────
export async function updateAppointmentStatus(id: string, status: string) {
  const tenantId = await requireTenantId();
  await db.appointment.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/appointments");
}

export async function deleteAppointment(id: string) {
  const tenantId = await requireTenantId();
  await db.appointment.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/appointments");
}
