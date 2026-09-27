"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, getDemoSessionId } from "./guard";

async function assertDemoCanMutate(recordDemoSessionId: string | null | undefined) {
  const demoId = await getDemoSessionId();
  if (!demoId) return true; // not a demo — allow
  // In demo: only mutate rows created in this sandbox (never seed / other visitors).
  return recordDemoSessionId === demoId;
}

// ─── Leads ───────────────────────────────────────────────────────────────────
export async function updateLeadStatus(id: string, status: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const lead = await db.lead.findFirst({ where: { id, tenantId } });
  if (!lead || !(await assertDemoCanMutate(lead.demoSessionId))) return;
  await db.lead.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const lead = await db.lead.findFirst({ where: { id, tenantId } });
  if (!lead || !(await assertDemoCanMutate(lead.demoSessionId))) return;
  await db.lead.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

// ─── Appointments ────────────────────────────────────────────────────────────
export async function updateAppointmentStatus(id: string, status: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const row = await db.appointment.findFirst({ where: { id, tenantId } });
  if (!row || !(await assertDemoCanMutate(row.demoSessionId))) return;
  await db.appointment.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

export async function deleteAppointment(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const row = await db.appointment.findFirst({ where: { id, tenantId } });
  if (!row || !(await assertDemoCanMutate(row.demoSessionId))) return;
  await db.appointment.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}
