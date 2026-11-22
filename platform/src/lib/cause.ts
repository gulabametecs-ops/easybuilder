// NGO fundraising causes shared by admin, public site and templates. Client-safe (no DB imports).

export type CauseStatus = "active" | "completed" | "paused";
export type ImpactTier = { amount: number; label: string };
export type CauseUpdate = { date: string; title: string; text: string };

export const CAUSE_STATUSES: { id: CauseStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Goal reached" },
  { id: "paused", label: "Paused" },
];

export type PublicCause = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  story: string;
  coverImage: string;
  gallery: string[];
  goalAmount: number;
  /** offline + online paid donations, INR */
  raised: number;
  donors: number;
  deadline: string;
  urgent: boolean;
  beneficiaries: string;
  location: string;
  impactTiers: ImpactTier[];
  updates: CauseUpdate[];
  status: CauseStatus;
  featured: boolean;
};

function jsonArr<T>(raw: string | null | undefined): T[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

/** DB row (+ online totals) → public shape. `online` = paid site donations for this cause. */
export function mapCause(
  r: {
    id: string; slug: string; title: string; category: string; summary: string; story: string; coverImage: string;
    gallery: string; goalAmount: number; offlineRaised: number; offlineDonors: number; deadline: string; urgent: boolean;
    beneficiaries: string; location: string; impactTiers: string; updates: string; status: string; featured: boolean;
  },
  online: { amount: number; donors: number } = { amount: 0, donors: 0 },
): PublicCause {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    summary: r.summary,
    story: r.story,
    coverImage: r.coverImage,
    gallery: jsonArr<string>(r.gallery).filter((x) => typeof x === "string" && x),
    goalAmount: Math.max(0, r.goalAmount),
    raised: Math.max(0, r.offlineRaised) + Math.max(0, online.amount),
    donors: Math.max(0, r.offlineDonors) + Math.max(0, online.donors),
    deadline: r.deadline,
    urgent: r.urgent,
    beneficiaries: r.beneficiaries,
    location: r.location,
    impactTiers: jsonArr<ImpactTier>(r.impactTiers).filter((t) => t && Number(t.amount) > 0 && typeof t.label === "string"),
    updates: jsonArr<CauseUpdate>(r.updates).filter((u) => u && typeof u.title === "string"),
    status: (CAUSE_STATUSES.some((s) => s.id === r.status) ? r.status : "active") as CauseStatus,
    featured: r.featured,
  };
}

/** 0–100 (capped) progress towards the goal; 0 when open-ended. */
export function progressPct(c: Pick<PublicCause, "raised" | "goalAmount">): number {
  if (!c.goalAmount) return 0;
  return Math.min(100, Math.round((c.raised / c.goalAmount) * 100));
}

/** Days left until the deadline (0 when passed), null when ongoing / no date. */
export function daysLeft(deadline: string, now = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return null;
  const end = new Date(`${deadline}T23:59:59`);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

/** Card / detail label: "Completed", "Ongoing", "Ended", "Last day", "12 days left". */
export function timeLeftLabel(c: Pick<PublicCause, "deadline" | "status">): string {
  if (c.status === "completed") return "Completed";
  const d = daysLeft(c.deadline);
  if (d === null) return "Ongoing";
  if (d === 0) return "Ended";
  return d === 1 ? "Last day" : `${d} days left`;
}

/** Compact ₹: 250000 → "₹2.5 L", 12000000 → "₹1.2 Cr", 45000 → "₹45,000". */
export function compactINR(inr: number): string {
  if (inr >= 1_00_00_000) return `₹${(inr / 1_00_00_000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  if (inr >= 1_00_000) return `₹${(inr / 1_00_000).toFixed(2).replace(/\.?0+$/, "")} L`;
  return `₹${Math.round(inr).toLocaleString("en-IN")}`;
}
