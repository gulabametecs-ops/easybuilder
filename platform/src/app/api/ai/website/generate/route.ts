import { NextResponse } from "next/server";
import { getAuthedSession } from "@/lib/auth";
import { planWebsiteFromPrompt, applyWebsiteBlueprint } from "@/lib/actions/aiBuilder";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";

export const maxDuration = 60;

type Body = {
  prompt?: string;
  blueprint?: WebsiteBlueprint;
  apply?: boolean;
  mode?: "create_pages" | "replace_home";
};

export async function POST(request: Request) {
  const authed = await getAuthedSession();
  if (!authed) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.blueprint && body.apply) {
    const result = await applyWebsiteBlueprint(body.blueprint, body.mode ?? "create_pages");
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    return NextResponse.json({
      success: true,
      blueprint: result.blueprint,
      pageIds: result.pageIds,
    });
  }

  const prompt = body.prompt?.trim() ?? "";
  if (prompt.length < 8) {
    return NextResponse.json({ success: false, error: "Prompt too short" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "Prompt too long (max 4000 chars)" }, { status: 400 });
  }

  const plan = await planWebsiteFromPrompt(prompt);
  if (!plan.ok) {
    return NextResponse.json({ success: false, error: plan.error }, { status: 502 });
  }

  if (body.apply) {
    const applied = await applyWebsiteBlueprint(plan.blueprint, body.mode ?? "create_pages");
    if (!applied.ok) return NextResponse.json({ success: false, error: applied.error }, { status: 400 });
    return NextResponse.json({
      success: true,
      blueprint: applied.blueprint,
      pageIds: applied.pageIds,
      questions: plan.questions,
    });
  }

  return NextResponse.json({
    success: true,
    blueprint: plan.blueprint,
    questions: plan.questions,
  });
}
