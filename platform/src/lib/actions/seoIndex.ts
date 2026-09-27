"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";
import { indexNowKey } from "@/lib/indexnow";
import { baseUrlFromHost } from "@/lib/seo";

export type IndexState = { ok: boolean; message: string };

// Instantly submit the site's pages to search engines via IndexNow (Bing,
// Yandex, Seznam, Naver…). Requires a live public domain — not localhost.
export async function submitToIndexNow(_prev: IndexState, _formData: FormData): Promise<IndexState> {
  const tenantId = await requireTenantId();
  const host = (await headers()).get("host") ?? "";
  const hostname = host.split(":")[0];
  const baseUrl = baseUrlFromHost(host);

  if (hostname.includes("localhost") || hostname.startsWith("127.")) {
    return { ok: false, message: "Instant indexing works only on your live domain — deploy first, then submit from there." };
  }

  const key = indexNowKey(tenantId);
  const pages = await db.page.findMany({ where: { tenantId, published: true, noindex: false }, orderBy: { order: "asc" }, select: { slug: true } });
  const urlList = pages.map((p) => `${baseUrl}${p.slug === "home" ? "/" : `/${p.slug}`}`);
  if (!urlList.length) return { ok: false, message: "No published pages to submit." };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: hostname, key, keyLocation: `${baseUrl}/api/indexnow-key`, urlList }),
    });
    if (res.ok || res.status === 202) return { ok: true, message: `🚀 Submitted ${urlList.length} page(s) to search engines. Bing & partners index within hours; Google via your sitemap.` };
    return { ok: false, message: `Search engines responded ${res.status}. Make sure your domain is live and the key file is reachable.` };
  } catch {
    return { ok: false, message: "Couldn't reach the indexing service right now. Please try again shortly." };
  }
}
