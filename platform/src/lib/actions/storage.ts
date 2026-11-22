"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "./guard";
import { deleteMediaFile } from "@/lib/usage";

// Delete an uploaded file to free storage. Refused while the site still uses it.
export async function deleteMedia(id: string): Promise<{ error: string } | undefined> {
  const { tenant } = await requireRole(["owner", "admin"]);
  const err = await deleteMediaFile(tenant.id, id);
  if (err) return { error: err };
  revalidatePath("/admin/storage");
  revalidatePath("/admin");
}
