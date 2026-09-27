import crypto from "node:crypto";
import { authSecretString } from "./secret";

// Deterministic per-tenant IndexNow key (no storage needed) — the key file route
// derives the same value. IndexNow instantly notifies Bing, Yandex & others of
// new/updated pages; Google discovers via the sitemap.
export function indexNowKey(tenantId: string): string {
  const secret = authSecretString();
  return crypto.createHash("sha256").update(`indexnow:${tenantId}:${secret}`).digest("hex").slice(0, 32);
}
