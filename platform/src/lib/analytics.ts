// Pure helpers for first-party page-view counting (no DB import, so tests stay cheap).
// The write side lives in app/api/pv/route.ts; the read side in admin/(dash)/analytics.

// ponytail: substring heuristic, catches crawlers/monitors/headless tools that announce
// themselves. Bots faking a browser UA still count; add a JS-challenge if that ever matters.
const BOT_RE =
  /bot|crawl|spider|slurp|scrape|fetch|monitor|preview|lighthouse|pagespeed|headless|phantom|puppeteer|playwright|selenium|curl|wget|python|httpclient|axios|node-fetch|go-http|java\/|okhttp|facebookexternalhit|whatsapp|telegram|discord|skype|embedly|quora|pinterest|bingpreview|vercel|uptime|pingdom|statuscake/i;

export function isBot(userAgent: string | null | undefined): boolean {
  return !userAgent || userAgent.length < 20 || BOT_RE.test(userAgent);
}

/** Calendar day in IST (all customers are Indian SMBs), as the "YYYY-MM-DD" row key. */
export function dayKey(at: Date = new Date()): string {
  return new Date(at.getTime() + 330 * 60 * 1000).toISOString().slice(0, 10);
}

/** Last `n` day keys, oldest first, ending today. */
export function lastDays(n: number, now: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => dayKey(new Date(now.getTime() - (n - 1 - i) * 86_400_000)));
}

/**
 * Clean a reported path into a bounded row key, or null to drop it.
 * Strips query/hash, collapses slashes, drops the trailing slash, rejects
 * internal/asset paths so stray requests can't bloat the table.
 */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/")) return null;
  let p = raw.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  try {
    p = decodeURIComponent(p);
  } catch {
    return null;
  }
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (p.length > 191) return null;
  if (/^\/(admin|api|_next|site)(\/|$)/.test(p) || /\.[a-z0-9]{2,5}$/i.test(p)) return null;
  if (!/^[\p{L}\p{N}/_\-.~%]+$/u.test(p)) return null;
  return p.toLowerCase();
}
