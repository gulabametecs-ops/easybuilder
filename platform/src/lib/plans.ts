// Pricing = 3 tiers × billing durations. Each tier lists what you get; the
// duration toggle changes the price (longer = cheaper per month; lifetime = one-time).
// Amounts are the MONTHLY base in paise (INR); priceFor() computes the total.

// Plan limits — 0 means unlimited. Storage/upload sizes are in MB (1024 MB = 1 GB).
export type PlanLimits = {
  storageMb: number; // total uploaded files (images, PDFs, documents)
  uploadMb: number; // largest single file
  pages: number; // custom pages, on top of the ready-made website pages
  services: number;
  gallery: number; // gallery photos
  users: number; // admin/staff logins
  aiEdits: number; // AI builder requests per calendar month
};

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  monthlyBase: number; // paise / month
  limits: PlanLimits;
  customDomain: boolean;
  features: string[];
  popular?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "A simple site to get online",
    monthlyBase: 69900,
    limits: { storageMb: 300, uploadMb: 3, pages: 3, services: 4, gallery: 10, users: 1, aiEdits: 10 },
    customDomain: false,
    features: [
      "Complete ready website + admin panel",
      "Free subdomain with SSL",
      "Unlimited leads, enquiries & bookings",
      "Theme, colours, fonts & SEO tools",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For growing businesses",
    monthlyBase: 149900,
    limits: { storageMb: 3 * 1024, uploadMb: 10, pages: 7, services: 20, gallery: 100, users: 3, aiEdits: 100 },
    customDomain: true,
    popular: true,
    features: [
      "Everything in Starter",
      "Connect your own custom domain",
      "More pages, services & storage",
      "Team logins for your staff",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Everything, unlocked",
    monthlyBase: 299900,
    limits: { storageMb: 10 * 1024, uploadMb: 25, pages: 0, services: 0, gallery: 0, users: 10, aiEdits: 400 },
    customDomain: true,
    features: [
      "Everything in Professional",
      "Unlimited pages, services & photos",
      "10 GB storage, 10 team logins",
      "Dedicated account manager",
      "24×7 priority support",
    ],
  },
];

export const LIMIT_KEYS = ["storageMb", "uploadMb", "pages", "services", "gallery", "users", "aiEdits"] as const satisfies readonly (keyof PlanLimits)[];

type TierOverride = { monthlyBase?: number; maxServices?: number; limits?: Partial<PlanLimits>; customDomain?: boolean };

function parseOverrides(json: string): Record<string, unknown> {
  try {
    const o = JSON.parse(json || "{}");
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

// Merge super-admin overrides onto the default tiers, so prices & limits are
// editable without code. JSON: { tierId: { monthlyBase?, customDomain?, limits?: {...} }, durations?: { "1m": pct, ... } }.
// Legacy shape { monthlyBase?, maxServices? } still works (maxServices → limits.services).
export function resolveTiers(overridesJson: string): Tier[] {
  const overrides = parseOverrides(overridesJson) as Record<string, TierOverride>;
  return TIERS.map((t) => {
    const o = overrides[t.id];
    if (!o || typeof o !== "object") return t;
    const limits = { ...t.limits };
    if (typeof o.maxServices === "number" && o.maxServices >= 0) limits.services = Math.floor(o.maxServices);
    for (const k of LIMIT_KEYS) {
      const v = o.limits?.[k];
      if (typeof v === "number" && v >= 0) limits[k] = Math.floor(v);
    }
    return {
      ...t,
      monthlyBase: typeof o.monthlyBase === "number" ? o.monthlyBase : t.monthlyBase,
      customDomain: typeof o.customDomain === "boolean" ? o.customDomain : t.customDomain,
      limits,
    };
  });
}

export function resolveTier(id: string, overridesJson: string): Tier | undefined {
  return resolveTiers(overridesJson).find((t) => t.id === id);
}

// Limits for a tenant's plan. null = unlimited (legacy names like "free"/"pro",
// used by demo tenants and hand-provisioned accounts).
export function limitsForPlan(plan: string, overridesJson: string): PlanLimits | null {
  return resolveTier(plan, overridesJson)?.limits ?? null;
}

// Service limit for a tenant's plan (0 = unlimited).
export function serviceLimitForPlan(plan: string, overridesJson: string): number {
  return limitsForPlan(plan, overridesJson)?.services ?? 0;
}

// True when adding `adding` more would go past `limit` (0 = unlimited).
export function wouldExceed(limit: number, used: number, adding = 1): boolean {
  return limit > 0 && used + adding > limit;
}

export const LIMIT_LABELS: Record<keyof PlanLimits, string> = {
  storageMb: "Storage",
  uploadMb: "Max file size",
  pages: "Custom pages",
  services: "Services",
  gallery: "Gallery photos",
  users: "Admin / staff logins",
  aiEdits: "AI edits / month",
};

export function formatMb(mb: number): string {
  return mb >= 1024 ? `${+(mb / 1024).toFixed(1)} GB` : `${+mb.toFixed(1)} MB`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(0, Math.round(bytes / 1024))} KB`;
  return formatMb(bytes / 1024 / 1024);
}

// Human value for one limit: "Unlimited", "1 GB", "20".
export function formatLimit(key: keyof PlanLimits, value: number): string {
  if (value === 0) return "Unlimited";
  return key === "storageMb" || key === "uploadMb" ? formatMb(value) : value.toLocaleString("en-IN");
}

// Friendly over-limit error shown to the tenant.
export function limitMessage(key: keyof PlanLimits, limit: number, planName: string): string {
  return `Your ${planName} plan includes ${formatLimit(key, limit)} ${LIMIT_LABELS[key].toLowerCase()}. Upgrade your plan from Billing to add more.`;
}

export type Duration = {
  id: string;
  label: string;
  months: number | null; // null = lifetime (one-time)
  discountPct: number; // applied to gross (months × monthly)
  badge?: string;
};

// Plans on sale. Longer = bigger discount; 3 years is the longest (no lifetime plan any more).
export const DURATIONS: Duration[] = [
  { id: "1m", label: "1 Month", months: 1, discountPct: 0 },
  { id: "6m", label: "6 Months", months: 6, discountPct: 5, badge: "Save 5%" },
  { id: "1y", label: "1 Year", months: 12, discountPct: 10, badge: "Save 10%" },
  { id: "2y", label: "2 Years", months: 24, discountPct: 15, badge: "Save 15%" },
  { id: "3y", label: "3 Years", months: 36, discountPct: 20, badge: "Best value" },
];

// No longer sold, but old orders/invoices still reference it.
const LEGACY_DURATIONS: Duration[] = [{ id: "lifetime", label: "Lifetime", months: null, discountPct: 0 }];

const LIFETIME_MONTHS = 30; // lifetime one-time = 30 × monthly

export function getTier(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}
// Durations a customer can buy now (checkout uses this, so "lifetime" is refused).
export function getDuration(id: string): Duration | undefined {
  return DURATIONS.find((d) => d.id === id);
}
// Any duration ever sold — for displaying past orders and invoices.
export function getAnyDuration(id: string): Duration | undefined {
  return getDuration(id) ?? LEGACY_DURATIONS.find((d) => d.id === id);
}

// Durations with super-admin discount overrides (planOverrides.durations = { "6m": 5, ... }).
// Use these everywhere a price is shown or charged so both always match.
export function resolveDurations(overridesJson: string): Duration[] {
  const raw = parseOverrides(overridesJson).durations;
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pctFor = (d: Duration) => (typeof o[d.id] === "number" ? Math.min(90, Math.max(0, Math.round(o[d.id] as number))) : d.discountPct);
  const list = DURATIONS.map((d) => ({ ...d, discountPct: pctFor(d) }));
  const best = Math.max(...list.map((d) => d.discountPct));
  return list.map((d) => ({
    ...d,
    badge: d.discountPct <= 0 ? undefined : d.discountPct === best && d.id === list[list.length - 1].id ? "Best value" : `Save ${d.discountPct}%`,
  }));
}

export function resolveDuration(id: string, overridesJson: string): Duration | undefined {
  return resolveDurations(overridesJson).find((d) => d.id === id);
}

// Total price (paise) for a tier + duration.
export function priceFor(tier: Tier, duration: Duration): number {
  if (duration.months === null) return tier.monthlyBase * LIFETIME_MONTHS;
  const gross = tier.monthlyBase * duration.months;
  return Math.round(gross * (1 - duration.discountPct / 100));
}

export function formatINR(paise: number): string {
  return "₹" + Math.round(paise / 100).toLocaleString("en-IN");
}

// Per-month effective price, for the "₹X/mo" helper text.
export function perMonth(tier: Tier, duration: Duration): number {
  const months = duration.months ?? LIFETIME_MONTHS;
  return Math.round(priceFor(tier, duration) / months);
}

// Subscription end date from a duration + start time (ms). Pure (no Date.now()).
export function subscriptionEndFromDuration(duration: Duration, startMs: number): Date | null {
  if (duration.months === null) return null; // lifetime
  const d = new Date(startMs);
  d.setMonth(d.getMonth() + duration.months);
  return d;
}
