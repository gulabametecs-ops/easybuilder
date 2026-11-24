import { runRenewalReminders } from "@/lib/reminders";
import { runRetention } from "@/lib/retention";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { sweepAiPreviews } from "@/lib/ai/previewCleanup";
import { runTrackingSync } from "@/lib/fulfilment";

/** The once-a-day maintenance: reminders, retention purge, demo + AI-preview cleanup, courier tracking sync.
 *  Safe to run twice (reminders skip anyone reminded in the last 3 days; the rest only delete what is already
 *  expired; tracking only moves shipped orders forward). */
export async function runDailyJobs() {
  const [reminders, retention, , aiPreviews, tracking] = await Promise.all([
    runRenewalReminders(),
    runRetention(),
    sweepExpiredDemoSessions(),
    sweepAiPreviews({ force: true }),
    runTrackingSync(),
  ]);
  return { ...reminders, retention, aiPreviews, tracking };
}
