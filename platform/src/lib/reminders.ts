import { db } from "./db";
import { getPlatformConfig } from "./platformConfig";
import { sendEmail } from "./email";

// Finds active clients whose license expires within `reminderDays` (and who
// weren't reminded in the last 3 days) and emails them a renewal reminder.
// Called by the cron route (daily) and by the "Send now" button.
export async function runRenewalReminders(): Promise<{ enabled: boolean; processed: number; sent: number; mock: boolean }> {
  const cfg = await getPlatformConfig();
  if (!cfg.remindersEnabled) return { enabled: false, processed: 0, sent: 0, mock: true };

  const now = new Date();
  const until = new Date();
  until.setDate(until.getDate() + (cfg.reminderDays || 7));
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const clients = await db.tenant.findMany({
    where: {
      status: "active",
      subscriptionEndsAt: { gte: now, lte: until },
      OR: [{ lastRenewalReminderAt: null }, { lastRenewalReminderAt: { lt: threeDaysAgo } }],
    },
    include: { users: { take: 1 } },
  });

  let sent = 0;
  let mock = false;
  for (const t of clients) {
    const email = t.users[0]?.email;
    if (!email) continue;
    const endsStr = t.subscriptionEndsAt ? new Date(t.subscriptionEndsAt).toLocaleDateString("en-IN") : "";
    const html = `<p>Hi ${t.name},</p><p>Your <b>${cfg.platformName || "website"}</b> subscription is expiring on <b>${endsStr}</b>. Renew now to keep your website online without interruption.</p><p>${cfg.supportEmail ? `Questions? Reply to this email or contact ${cfg.supportEmail}.` : ""}</p>`;
    const r = await sendEmail(email, "Your website subscription is expiring soon", html);
    if (r.mock) mock = true;
    if (r.sent || r.mock) sent++;
    await db.tenant.update({ where: { id: t.id }, data: { lastRenewalReminderAt: now } });
  }
  return { enabled: true, processed: clients.length, sent, mock };
}
