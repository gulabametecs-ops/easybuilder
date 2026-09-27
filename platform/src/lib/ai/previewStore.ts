import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from "node:fs";
import path from "node:path";
import type { WebsiteBlueprint } from "./blueprintSchema";
import { slugify } from "./hydrate";

type Entry = { blueprint: WebsiteBlueprint; createdAt: number };

const TTL_MS = 2 * 60 * 60 * 1000;
const store = new Map<string, Entry>();
const DIR = path.join(process.cwd(), ".data", "ai-previews");

function isSafeKey(key: string): boolean {
  return /^ai-[a-z0-9-]{1,80}$/.test(key);
}

function fileFor(key: string): string {
  return path.join(DIR, `${key}.json`);
}

function pruneMemory() {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now - v.createdAt > TTL_MS) store.delete(k);
  }
}

function pruneDisk() {
  try {
    const now = Date.now();
    for (const name of readdirSync(DIR)) {
      if (!name.endsWith(".json")) continue;
      const full = path.join(DIR, name);
      try {
        const row = JSON.parse(readFileSync(full, "utf8")) as Entry;
        if (!row?.createdAt || now - row.createdAt > TTL_MS) unlinkSync(full);
      } catch {
        unlinkSync(full);
      }
    }
  } catch {
    /* dir may not exist yet */
  }
}

export function makePreviewKey(name: string): string {
  const slug = slugify(name).slice(0, 18) || "site";
  return `ai-${slug}-${randomBytes(3).toString("hex")}`;
}

export function putPreview(key: string, blueprint: WebsiteBlueprint): void {
  if (!isSafeKey(key)) throw new Error("Invalid preview key");
  pruneMemory();
  const entry: Entry = { blueprint, createdAt: Date.now() };
  store.set(key, entry);
  mkdirSync(DIR, { recursive: true });
  writeFileSync(fileFor(key), JSON.stringify(entry), "utf8");
  pruneDisk();
}

export function getPreview(key: string): WebsiteBlueprint | null {
  if (!isSafeKey(key)) return null;
  pruneMemory();
  const mem = store.get(key);
  if (mem) {
    if (Date.now() - mem.createdAt > TTL_MS) {
      store.delete(key);
    } else {
      return mem.blueprint;
    }
  }
  try {
    const row = JSON.parse(readFileSync(fileFor(key), "utf8")) as Entry;
    if (!row?.blueprint || Date.now() - row.createdAt > TTL_MS) {
      try {
        unlinkSync(fileFor(key));
      } catch {
        /* ignore */
      }
      return null;
    }
    store.set(key, row);
    return row.blueprint;
  } catch {
    return null;
  }
}

export function previewPublicUrls(
  key: string,
  requestHost: string,
  protocol: string,
): { siteUrl: string; adminUrl: string; fallbackSiteUrl: string; fallbackAdminUrl: string } {
  const host = requestHost.split("/")[0];
  const hostname = host.split(":")[0];
  const port = host.includes(":") ? `:${host.split(":")[1]}` : "";
  const root =
    hostname === "127.0.0.1" || hostname.endsWith(".localhost") || hostname === "localhost"
      ? "localhost"
      : hostname.replace(/^www\./, "");
  const siteUrl = `${protocol}//${key}.${root}${port}`;
  const origin = `${protocol}//${hostname === "127.0.0.1" ? "localhost" : hostname}${port}`;
  return {
    siteUrl,
    adminUrl: `${siteUrl}/admin`,
    fallbackSiteUrl: `${origin}/ai-live/${key}`,
    fallbackAdminUrl: `${origin}/ai-live/${key}/admin`,
  };
}
