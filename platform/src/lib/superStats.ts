// Small pure helpers behind the super admin dashboards (overview + analytics).
import { last10 } from "./leadStatus";

/** % change from prev to cur; null when there's no base to compare against. */
export function pctDelta(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return Math.round(((cur - prev) / prev) * 100);
}

export type Bucket = { label: string; start: Date; end: Date };

/** Consecutive day / week / month buckets ending at `now` (the last one contains now). */
export function buckets(unit: "day" | "week" | "month", count: number, now = new Date()): Bucket[] {
  const out: Bucket[] = [];
  for (let i = count - 1; i >= 0; i--) {
    let start: Date, end: Date, label: string;
    if (unit === "month") {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      label = start.toLocaleString("en", { month: "short" });
    } else {
      const days = unit === "week" ? 7 : 1;
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 - i * days);
      start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days);
      label = start.toLocaleString("en", { day: "numeric", month: "short" });
    }
    out.push({ label, start, end });
  }
  return out;
}

/** Sum `value(row)` of rows whose date falls in each bucket. */
export function series<T>(bs: Bucket[], rows: T[], date: (r: T) => Date, value: (r: T) => number = () => 1): number[] {
  return bs.map((b) => rows.reduce((s, r) => (date(r) >= b.start && date(r) < b.end ? s + value(r) : s), 0));
}

/** Matcher: does a lead share a phone (last 10 digits) or email with any of these orders? */
export function contactMatcher(orders: { email: string; phone: string }[]) {
  const emails = new Set(orders.map((o) => o.email.trim().toLowerCase()).filter(Boolean));
  const phones = new Set(orders.map((o) => last10(o.phone)).filter((p) => p.length >= 7));
  return (l: { email: string; phone: string }) =>
    emails.has(l.email.trim().toLowerCase()) || phones.has(last10(l.phone));
}
