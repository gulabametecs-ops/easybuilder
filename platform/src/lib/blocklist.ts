import { db } from "./db";
import { BLOCKED, sameContact } from "./leadStatus";

/** ponytail: scans blocked leads in JS (a handful of rows); add a BlockedContact table if this list grows large. */
export async function isBlockedContact(phone: string, email: string) {
  const blocked = await db.platformLead.findMany({ where: { status: BLOCKED }, select: { phone: true, email: true } });
  return blocked.some((b) => sameContact({ phone, email }, b));
}
