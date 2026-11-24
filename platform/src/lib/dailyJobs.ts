import { runRenewalReminders } from "@/lib/reminders";
import { runRetention } from "@/lib/retention";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { sweepAiPreviews } from "@/lib/ai/previewCleanup";

/** The once-a-day maintenance: reminders, retention purge, demo + AI-preview cleanup. Safe to run twice
 *  (reminders skip anyone reminded in the last 3 days; the rest only delete what is already expired). */
export async function runDailyJobs() {
  const [reminders, retention, , aiPreviews] = await Promise.all([
    runRenewalReminders(),
    runRetention(),
    sweepExpiredDemoSessions(),
    sweepAiPreviews({ force: true }),
  ]);
  return { ...reminders, retention, aiPreviews };
}
