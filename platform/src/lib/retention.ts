import { db } from "./db";
import { dayKey } from "./analytics";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Data-retention purge promised in the Privacy Policy (/privacy → "How long we keep data").
 * Runs from the daily cron. Customer accounts are NOT auto-deleted (the policy says on request).
 */
export async function runRetention(now = new Date()) {
  // Sales enquiries (demo / signup / contact forms): 12 months.
  const leads = await db.platformLead.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 365 * DAY) } } });
  // AI-builder prompts: 90 days. Rows stay because usage limits count them; only the text goes.
  const prompts = await db.aiGeneration.updateMany({
    where: { createdAt: { lt: new Date(now.getTime() - 90 * DAY) }, NOT: { prompt: "" } },
    data: { prompt: "" },
  });
  // Visitor analytics (aggregate page counts): 13 months, so a year-on-year month still shows.
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 13);
  const views = await db.pageView.deleteMany({ where: { day: { lt: dayKey(cutoff) } } });
  return { leadsDeleted: leads.count, promptsCleared: prompts.count, pageViewsDeleted: views.count };
}
