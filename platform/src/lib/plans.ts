// Pricing = 3 tiers × billing durations. Each tier lists what you get; the
// duration toggle changes the price (longer = cheaper per month; lifetime = one-time).
// Amounts are the MONTHLY base in paise (INR); priceFor() computes the total.

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  monthlyBase: number; // paise / month
  maxServices: number; // 0 = unlimited
  features: string[];
  popular?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Get online fast",
    monthlyBase: 49900,
    maxServices: 20,
    features: [
      "Complete ready website",
      "Your own subdomain",
      "Full admin panel",
      "Up to 20 services",
      "Leads inbox",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For growing businesses",
    monthlyBase: 99900,
    maxServices: 0,
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited services & pages",
      "Appointment booking",
      "Gallery manager",
      "Theme, colours & fonts",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Everything, unlocked",
    monthlyBase: 199900,
    maxServices: 0,
    features: [
      "Everything in Professional",
      "Connect a custom domain",
      "Remove platform branding",
      "SEO & analytics tools",
      "Dedicated account manager",
      "24×7 priority support",
    ],
  },
];

// Merge super-admin overrides (JSON: { tierId: { monthlyBase?, maxServices? } })
// onto the default tiers. Used so prices & limits are editable without code.
export function resolveTiers(overridesJson: string): Tier[] {
  let overrides: Record<string, { monthlyBase?: number; maxServices?: number }> = {};
  try { overrides = JSON.parse(overridesJson || "{}"); } catch { overrides = {}; }
  return TIERS.map((t) => {
    const o = overrides[t.id];
    if (!o) return t;
    return {
      ...t,
      monthlyBase: typeof o.monthlyBase === "number" ? o.monthlyBase : t.monthlyBase,
      maxServices: typeof o.maxServices === "number" ? o.maxServices : t.maxServices,
    };
  });
}

export function resolveTier(id: string, overridesJson: string): Tier | undefined {
  return resolveTiers(overridesJson).find((t) => t.id === id);
}

// Service limit for a tenant's plan (0 = unlimited). Falls back to defaults.
export function serviceLimitForPlan(plan: string, overridesJson: string): number {
  const t = resolveTier(plan, overridesJson);
  if (t) return t.maxServices;
  // legacy plan names (free/pro) = unlimited
  return 0;
}

export type Duration = {
  id: string;
  label: string;
  months: number | null; // null = lifetime (one-time)
  discountPct: number; // applied to gross (months × monthly)
  badge?: string;
};

export const DURATIONS: Duration[] = [
  { id: "1m", label: "1 Month", months: 1, discountPct: 0 },
  { id: "6m", label: "6 Months", months: 6, discountPct: 10, badge: "Save 10%" },
  { id: "1y", label: "1 Year", months: 12, discountPct: 20, badge: "Save 20%" },
  { id: "2y", label: "2 Years", months: 24, discountPct: 30, badge: "Save 30%" },
  { id: "lifetime", label: "Lifetime", months: null, discountPct: 0, badge: "Best value" },
];

const LIFETIME_MONTHS = 30; // lifetime one-time = 30 × monthly

export function getTier(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}
export function getDuration(id: string): Duration | undefined {
  return DURATIONS.find((d) => d.id === id);
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
