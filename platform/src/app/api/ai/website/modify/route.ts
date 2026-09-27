import { NextResponse } from "next/server";
import { getAuthedSession } from "@/lib/auth";
import { modifyWebsiteFromPrompt } from "@/lib/actions/aiBuilder";

export const maxDuration = 60;

type Body = { prompt?: string; pageId?: string };

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

  const prompt = body.prompt?.trim() ?? "";
  if (prompt.length < 3) {
    return NextResponse.json({ success: false, error: "Prompt too short" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "Prompt too long" }, { status: 400 });
  }

  const result = await modifyWebsiteFromPrompt(prompt, body.pageId);
  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    operations: result.operations,
    pageIds: result.pageIds,
  });
}
