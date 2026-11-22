"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, ownedWhere } from "./guard";

export async function updateVolunteerStatus(id: string, status: string) {
  if (!["new", "contacted", "accepted", "declined"].includes(status)) return;
  const tenantId = await requireTenantId({ demoOk: true });
  await db.volunteer.updateMany({ where: await ownedWhere(id, tenantId), data: { status } });
  revalidatePath("/admin/volunteers");
}

export async function deleteVolunteer(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  await db.volunteer.deleteMany({ where: await ownedWhere(id, tenantId) });
  revalidatePath("/admin/volunteers");
}
