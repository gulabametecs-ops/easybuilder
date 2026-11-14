"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";

export async function updateVolunteerStatus(id: string, status: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  await db.volunteer.updateMany({ where: { id, tenantId }, data: { status } });
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  await db.volunteer.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/volunteers");
}
