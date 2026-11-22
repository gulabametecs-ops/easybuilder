"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseAdminPrefs } from "@/lib/adminPrefs";
import { requireAuth } from "./guard";

/** Hide or re-show the dashboard "Getting started" card (stored in SiteConfig.adminPrefs). */
export async function setSetupChecklistHidden(hidden: boolean) {
  const { tenant } = await requireAuth(); // demo visitors are refused; the card hides its button for them
  const cfg = await db.siteConfig.findUnique({ where: { tenantId: tenant.id }, select: { adminPrefs: true } });
  const prefs = JSON.stringify({ ...parseAdminPrefs(cfg?.adminPrefs), setupChecklistHidden: hidden });
  await db.siteConfig.upsert({
    where: { tenantId: tenant.id },
    update: { adminPrefs: prefs },
    create: { tenantId: tenant.id, adminPrefs: prefs },
  });
  revalidatePath("/admin");
}
