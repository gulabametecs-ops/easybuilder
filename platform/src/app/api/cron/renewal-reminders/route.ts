import { NextResponse } from "next/server";
import { runRenewalReminders } from "@/lib/reminders";

// Daily cron (configured in vercel.json). Protected by CRON_SECRET when set.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    const qp = new URL(request.url).searchParams.get("secret");
    if (auth !== `Bearer ${secret}` && qp !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const result = await runRenewalReminders();
  return NextResponse.json(result);
}
