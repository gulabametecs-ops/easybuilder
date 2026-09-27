import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import { refinePublicBlueprint } from "@/lib/ai/publicModify";
import { normalizeBlueprint } from "@/lib/ai/normalizeBlueprint";

export const maxDuration = 60;

export async function POST(request: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`ai-public-modify:${ip}`, 12, 60 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Try again in ${rl.retryAfterSec}s.` },
      { status: 429 },
    );
  }

  let body: { prompt?: string; blueprint?: unknown };
  try {
    body = (await request.json()) as { prompt?: string; blueprint?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const blueprint = normalizeBlueprint(body.blueprint);
  if (!blueprint) {
    return NextResponse.json({ success: false, error: "Invalid blueprint" }, { status: 400 });
  }

  const prompt = body.prompt?.trim() ?? "";
  if (prompt.length < 3) {
    return NextResponse.json({ success: false, error: "Describe the change you want." }, { status: 400 });
  }

  const result = await refinePublicBlueprint(blueprint, prompt);
  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true, blueprint: result.blueprint });
}
