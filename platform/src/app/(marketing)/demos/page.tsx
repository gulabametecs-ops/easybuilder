import { Check, Sparkles } from "lucide-react";
import { VERTICALS, VERTICAL_CATEGORIES, categoryOf } from "@/lib/verticals";
import { stockImg } from "@/lib/img";
import { getTemplate } from "@/lib/templates";
import { DESIGNS } from "@/lib/designs";
import { getDemoStatusForVertical } from "@/lib/actions/demos";
import { DemosExplorer, type ActiveInfo, type DemoCategory, type DemoSector } from "@/components/marketing/DemosExplorer";
import { AiDraftBanner } from "@/components/marketing/AiDraftBanner";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Live Demos — Standard SaaS" };

const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
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

function buildSectors(): DemoSector[] {
  return VERTICALS.map((v) => {
    const colors = getTemplate(v.id).theme.colors;
    return {
      id: v.id,
      name: v.name,
      tagline: v.tagline,
      icon: v.icon,
      status: v.status,
      category: categoryOf(v.id),
      accent: v.accent,
      image: stockImg(v.name, 640, 400),
      description: v.description,
      designs: DESIGNS.map((d) => ({
        id: d.id,
        name: d.name,
        tagline: d.tagline,
        font: d.font,
        header: d.header,
        hero: d.hero ?? null,
        colors: d.palette(colors),
      })),
    };
  });
}

export default async function DemosPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; vertical?: string }>;
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
      <section className={`relative overflow-hidden ${mkt.sectionDivider} bg-[var(--mkt-bg)]`}>
        <div className="mkt-hero-wash absolute inset-0 pointer-events-none" aria-hidden />
        <div className="mkt-hero-orb mkt-hero-orb-a" aria-hidden />
        <div className="mkt-hero-orb mkt-hero-orb-b" aria-hidden />
        <div className={`relative ${mkt.container} pt-16 pb-12 sm:pt-24 sm:pb-16 text-center`}>
          <span className={`${mkt.badge} mb-6`}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
            </span>
            {live.length} live demos · {DESIGNS.length} designs each
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-bold tracking-tight text-[var(--mkt-text)] text-balance">
            See your website{" "}
            <span className="bg-gradient-to-r from-lime-500 to-emerald-500 bg-clip-text text-transparent">before you buy it</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-2xl text-base sm:text-lg ${mkt.muted} text-pretty`}>
            Pick your sector, choose a design, verify with OTP and get a private 10-minute sandbox — live website and
            admin panel included.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {["Real, working websites", "Switch between 5 designs", "Auto-reset sandbox"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[var(--mkt-text-secondary)]">
                <Check className="w-4 h-4 text-lime-500" /> {t}
              </span>
            ))}
          </div>
          {sp.expired && !focusVertical && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
              <Sparkles className="w-4 h-4" /> Your demo session ended. Choose a sector below to start again.
            </p>
          )}
        </div>
      </section>

      <div className={`${mkt.container} pt-6`}>
        <AiDraftBanner />
      </div>

      <DemosExplorer
        key={focusVertical ?? "all"}
        categories={categories}
        sectors={buildSectors()}
        activeByVertical={activeByVertical}
        focusVertical={focusVertical}
        expired={!!sp.expired}
      />
    </main>
  );
}
