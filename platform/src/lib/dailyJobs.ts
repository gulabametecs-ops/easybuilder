import { runRenewalReminders } from "@/lib/reminders";
import { runRetention } from "@/lib/retention";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { sweepAiPreviews } from "@/lib/ai/previewCleanup";
import { runTrackingSync } from "@/lib/fulfilment";
import { runPaymentHoldSweep } from "@/lib/storePayments";
import { runAbandonedReminders } from "@/lib/abandonedCarts";

/** The once-a-day maintenance: reminders, retention purge, demo + AI-preview cleanup, courier tracking sync,
 *  expired online-payment holds (stock released), abandoned-checkout reminder emails (once per cart).
 *  Safe to run twice (reminders skip anyone reminded in the last 3 days; the rest only delete what is already
 *  expired; tracking only moves shipped orders forward). */
export async function runDailyJobs() {
  const [reminders, retention, , aiPreviews, tracking, paymentHolds, abandonedCarts] = await Promise.all([
    runRenewalReminders(),
    runRetention(),
    sweepExpiredDemoSessions(),
    sweepAiPreviews({ force: true }),
    runTrackingSync(),
    runPaymentHoldSweep(),
    runAbandonedReminders(),
  ]);
  return { ...reminders, retention, aiPreviews, tracking, paymentHolds, abandonedCarts };
}
