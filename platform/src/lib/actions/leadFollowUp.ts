"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { FOLLOW_UP_STATUSES, NOTE_MARK } from "@/lib/leadStatus";

async function requireSuper() {
  if (!(await getSuperSession())) throw new Error("Unauthorized");
}

export async function setLeadStatus(leadId: string, status: string) {
  await requireSuper();
  const s = z.enum(FOLLOW_UP_STATUSES).parse(status);
  await db.platformLead.update({ where: { id: z.string().min(1).parse(leadId) }, data: { status: s } });
  revalidatePath("/super/demo-leads");
}

export async function addLeadNote(leadId: string, formData: FormData) {
  await requireSuper();
  const note = z.string().trim().min(1).max(1000).parse(formData.get("note"));
  const lead = await db.platformLead.findUnique({ where: { id: leadId }, select: { message: true, status: true } });
  if (!lead) return;
  const when = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  await db.platformLead.update({
    where: { id: leadId },
    data: {
      message: `${lead.message}${NOTE_MARK}${when}\n${note}`,
      // First note on a fresh lead means someone reached out.
      status: lead.status === "new" || lead.status === "verified" ? "contacted" : lead.status,
    },
  });
  revalidatePath("/super/demo-leads");
}
