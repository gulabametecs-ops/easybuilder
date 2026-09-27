import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import { planWebsiteFromPublicPrompt } from "@/lib/ai/publicPlan";

export const maxDuration = 90;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`ai-public:${ip}`, 8, 60 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Try again in ${rl.retryAfterSec}s.` },
      { status: 429 },
    );
  }

  let body: {
    prompt?: string;
    companyName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoImage?: string;
    heroImage?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = body.prompt?.trim() ?? "";
  if (prompt.length < 8) {
    return NextResponse.json({ success: false, error: "Prompt too short" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "Prompt too long (max 4000 chars)" }, { status: 400 });
  }

  const companyName = body.companyName?.trim() ?? "";
  if (companyName.length < 2) {
    return NextResponse.json({ success: false, error: "Company / project name is required." }, { status: 400 });
  }

  const plan = await planWebsiteFromPublicPrompt(prompt, {
    companyName,
    primaryColor: body.primaryColor,
    secondaryColor: body.secondaryColor,
    logoImage: body.logoImage,
    heroImage: body.heroImage,
  });
  if (!plan.ok) {
    return NextResponse.json({ success: false, error: plan.error }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    blueprint: plan.blueprint,
    questions: plan.questions,
  });
}
