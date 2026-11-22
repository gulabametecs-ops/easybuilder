import { Sparkles, KeyRound, Palette, Globe } from "lucide-react";
import { VERTICALS, VERTICAL_CATEGORIES, categoryOf } from "@/lib/verticals";
import { stockImg } from "@/lib/img";
import { DESIGNS } from "@/lib/designs";
import { getDemoStatusForVertical } from "@/lib/actions/demos";
import { DemosExplorer, type ActiveInfo, type DemoCategory } from "@/components/marketing/DemosExplorer";
import { buildSectors } from "@/lib/demoSectors";
import { AiDraftBanner } from "@/components/marketing/AiDraftBanner";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Live Demos — SitePixl" };

const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
  "Real Estate & Property": stockImg("real estate property", 640, 360),
  "Community & Non-profit": stockImg("community volunteers", 640, 360),
  "Fitness & Wellness": stockImg("gym fitness", 640, 360),
  "Events & Training": stockImg("conference event", 640, 360),
};

// Grouped dynamically: known categories keep their defined order, any new ones follow.
function buildCategories(): DemoCategory[] {
  const order: string[] = [...VERTICAL_CATEGORIES];
  for (const v of VERTICALS) {
    const c = categoryOf(v.id);
    if (!order.includes(c)) order.push(c);
  }
  return order
    .map((name) => ({
      name,
      image: CATEGORY_IMAGES[name] ?? stockImg(`${name} business`, 640, 360),
      count: VERTICALS.filter((v) => categoryOf(v.id) === name).length,
    }))
    .filter((c) => c.count > 0);
}


export default async function DemosPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; vertical?: string; design?: string; live?: string }>;
}) {
  const sp = await searchParams;
  await sweepExpiredDemoSessions();

  const live = VERTICALS.filter((v) => v.status === "live");
  const statuses = await Promise.all(live.map(async (v) => ({ id: v.id, status: await getDemoStatusForVertical(v.id) })));

  const activeByVertical: Record<string, ActiveInfo> = {};
  for (const s of statuses) {
    if (s.status.step !== "active") continue;
    activeByVertical[s.id] = {
      siteUrl: s.status.siteUrl,
      adminUrl: s.status.adminUrl,
      expiresAt: s.status.expiresAt,
      minutesLeft: s.status.minutesLeft,
      // Same session cookie holder only — lets creds survive a refresh / drawer close.
      adminUsername: s.status.adminUsername,
      adminPassword: s.status.adminPassword,
    };
  }

  const categories = buildCategories();
  const focusVertical = sp.vertical && VERTICALS.some((v) => v.id === sp.vertical) ? sp.vertical : undefined;

  return (
    <main>
      <section className="mkt-hero-dark relative isolate overflow-hidden border-b border-[var(--mkt-border)] text-[var(--mkt-text)]">
        <div className="mkt-hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="mkt-hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px]" aria-hidden />
        <div className={`${mkt.container} flex flex-col gap-5 py-9 sm:py-10 lg:flex-row lg:items-end lg:justify-between`}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-1 text-xs font-medium text-[var(--mkt-text-secondary)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {live.length} live websites · {DESIGNS.length} designs each
            </span>
            <h1 className="font-display mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
              Pick an industry. <span className="mkt-gradient-text">Switch designs in one click.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--mkt-text-muted)] sm:text-base">
              Preview every look instantly, then unlock the real website + admin panel with one OTP — no card needed.
            </p>
          </div>
          <ol className="flex shrink-0 flex-wrap gap-2 text-xs text-[var(--mkt-text-secondary)]">
            {[
              { icon: Palette, t: "Choose & switch" },
              { icon: KeyRound, t: "Verify with OTP" },
              { icon: Globe, t: "Explore site & admin" },
            ].map((s, i) => (
              <li key={s.t} className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-1.5 shadow-sm">
                <s.icon className="h-3.5 w-3.5 text-[var(--mkt-accent-2)]" />
                <span className="text-[var(--mkt-text-muted)]">{i + 1}.</span> {s.t}
              </li>
            ))}
          </ol>
        </div>
        {sp.expired && !focusVertical && (
          <p className={`${mkt.container} -mt-3 pb-6 text-sm text-amber-700 dark:text-amber-300`}>
            <Sparkles className="mr-1.5 inline h-4 w-4" /> Your last sandbox ended. Pick an industry to start again.
          </p>
        )}
      </section>

      <div className={`${mkt.container} empty:hidden [&:has(>*)]:pt-6`}>
        <AiDraftBanner />
      </div>

      <DemosExplorer
        key={focusVertical ?? "all"}
        categories={categories}
        sectors={buildSectors()}
        activeByVertical={activeByVertical}
        focusVertical={focusVertical}
        expired={!!sp.expired}
        initialDesign={sp.design && DESIGNS.some((d) => d.id === sp.design) ? sp.design : undefined}
        autoLive={sp.live === "1"}
      />
    </main>
  );
}
