import { NextResponse } from "next/server";
import { runRenewalReminders } from "@/lib/reminders";

// Daily cron (configured in vercel.json). CRON_SECRET is required in production.
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

  const result = await runRenewalReminders();
  return NextResponse.json(result);
}
