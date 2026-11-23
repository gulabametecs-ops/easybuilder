"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { BLOCKED, FOLLOW_UP_STATUSES, NOTE_MARK, sameContact } from "@/lib/leadStatus";

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

const refresh = () => {
  revalidatePath("/super/demo-leads");
  revalidatePath("/super/enquiries");
};

export async function deleteLead(leadId: string) {
  await requireSuper();
  await db.platformLead.deleteMany({ where: { id: z.string().min(1).parse(leadId) } });
  refresh();
}

/** Block / unblock every lead with the same phone or email. Blocked contacts can't request demos or send enquiries. */
export async function setLeadBlocked(leadId: string, blocked: boolean) {
  await requireSuper();
  const lead = await db.platformLead.findUnique({ where: { id: z.string().min(1).parse(leadId) }, select: { phone: true, email: true } });
  if (!lead) return;
  const all = await db.platformLead.findMany({ select: { id: true, phone: true, email: true, status: true } });
  const ids = all.filter((l) => sameContact(lead, l) && (blocked ? l.status !== BLOCKED : l.status === BLOCKED)).map((l) => l.id);
  if (ids.length) await db.platformLead.updateMany({ where: { id: { in: ids } }, data: { status: blocked ? BLOCKED : "new" } });
  refresh();
}
