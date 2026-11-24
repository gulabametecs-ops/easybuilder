// Runs once when the Next.js server starts.
// Self-hosted (`next start` on our Ubuntu server) has no Vercel cron, so the daily jobs run in-process:
// 1 minute after boot, then every 24 h. On Vercel, vercel.json's cron calls /api/cron/renewal-reminders instead.
// ponytail: in-process timer, fine for one server; with several app instances use one external cron instead.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production" || process.env.VERCEL) return;
  const { runDailyJobs } = await import("./lib/dailyJobs");
  const run = () =>
    runDailyJobs()
      .then((r) => console.log("[daily-jobs] done", JSON.stringify(r)))
      .catch((e) => console.error("[daily-jobs] failed", e));
  setTimeout(run, 60_000).unref();
  setInterval(run, 24 * 60 * 60 * 1000).unref();
}
