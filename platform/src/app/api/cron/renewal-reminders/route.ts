import { NextResponse } from "next/server";
import { runDailyJobs } from "@/lib/dailyJobs";

// Daily cron (vercel.json on Vercel; self-hosted servers also run it in-process, see src/instrumentation.ts).
// CRON_SECRET is required in production.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }

  if (secret) {
    const auth = request.headers.get("authorization");
    // Header only: a ?secret= query param ends up in access logs.
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Same jobs the self-hosted server runs on its own timer (src/instrumentation.ts).
  return NextResponse.json(await runDailyJobs());
}
