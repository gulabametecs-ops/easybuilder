"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { releaseMediaIn } from "@/lib/usage";
import { requireTenantId, getDemoSessionId, ownedWhere } from "./guard";

function str(form: FormData, key: string) {
  return (form.get(key)?.toString() ?? "").trim();
}

export async function savePerson(formData: FormData) {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoSessionId = await getDemoSessionId();
  const id = str(formData, "id");
  const data = {
    name: str(formData, "name") || "Team member",
    role: str(formData, "role"),
    bio: str(formData, "bio"),
    image: str(formData, "image"),
    groupName: str(formData, "groupName") === "leadership" ? "leadership" : "core",
    experience: str(formData, "experience"),
    linkedin: str(formData, "linkedin"),
    instagram: str(formData, "instagram"),
    published: formData.get("published") === "on",
  };
  if (id) {
    await db.person.updateMany({ where: await ownedWhere(id, tenantId), data });
  } else {
    const max = await db.person.aggregate({ where: { tenantId }, _max: { order: true } });
    await db.person.create({
      data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId },
    });
  }
  revalidatePath("/admin/people");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function deletePerson(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const person = await db.person.findFirst({ where: await ownedWhere(id, tenantId) });
  await db.person.deleteMany({ where: await ownedWhere(id, tenantId) });
  await releaseMediaIn(tenantId, person);
  revalidatePath("/admin/people");
  revalidatePath("/team");
  revalidatePath("/");
}
