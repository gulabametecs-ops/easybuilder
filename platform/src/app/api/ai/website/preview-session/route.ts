import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import { normalizeBlueprint } from "@/lib/ai/normalizeBlueprint";
import { makePreviewKey, previewPublicUrls, putPreview } from "@/lib/ai/previewStore";
import { ensureAiPreviewTenant } from "@/lib/ai/previewTenant";

export const maxDuration = 90;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(`ai-preview-session:${ip}`, 20, 60 * 60_000);
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  let body: { blueprint?: unknown; key?: string };
  try {
    body = (await request.json()) as { blueprint?: unknown; key?: string };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const blueprint = normalizeBlueprint(body.blueprint);
  if (!blueprint) {
    return NextResponse.json({ success: false, error: "Invalid blueprint" }, { status: 400 });
  }

  // Reuse a key only if this browser created it — otherwise anyone could overwrite someone else's preview.
  const jar = await cookies();
  const owned = jar.get("ai_preview_key")?.value;
  const key = body.key && body.key === owned ? body.key : makePreviewKey(blueprint.website.name);
  putPreview(key, blueprint);

  let impersonateToken: string;
  try {
    const live = await ensureAiPreviewTenant(key, blueprint);
    impersonateToken = live.impersonateToken;
  } catch (e) {
    console.error("[preview-session]", e);
    return NextResponse.json({ success: false, error: "Could not create live preview site." }, { status: 500 });
  }
  jar.set("ai_preview_key", key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 2 * 60 * 60,
  });

  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const urls = previewPublicUrls(key, host, proto.endsWith(":") ? proto : `${proto}:`);

  return NextResponse.json({
    success: true,
    key,
    siteUrl: urls.siteUrl,
    adminUrl: `${urls.siteUrl}/admin/impersonate?t=${encodeURIComponent(impersonateToken)}`,
    fallbackSiteUrl: urls.siteUrl,
    fallbackAdminUrl: `${urls.siteUrl}/admin/impersonate?t=${encodeURIComponent(impersonateToken)}`,
    adminEmail: `preview@${key}.ai.test`,
    adminPassword: "preview1234",
  });
}
