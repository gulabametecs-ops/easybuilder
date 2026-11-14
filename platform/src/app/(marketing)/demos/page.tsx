import { Sparkles, KeyRound, Palette, Globe } from "lucide-react";
import { VERTICALS, VERTICAL_CATEGORIES, categoryOf } from "@/lib/verticals";
import { stockImg } from "@/lib/img";
import { getTemplate } from "@/lib/templates";
import { DESIGNS } from "@/lib/designs";
import { getDemoStatusForVertical } from "@/lib/actions/demos";
import { DemosExplorer, type ActiveInfo, type DemoCategory, type DemoSector } from "@/components/marketing/DemosExplorer";
import { AiDraftBanner } from "@/components/marketing/AiDraftBanner";
import { sweepExpiredDemoSessions, demoSiteUrl } from "@/lib/demoSession";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Live Demos — Standard SaaS" };

const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
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
      image:
        v.id === "ngo-charity"
          ? stockImg("charity children volunteers", 640, 400)
          : v.id === "social-foundation"
            ? stockImg("grassroots foundation rural village plantation", 640, 400)
            : stockImg(v.name, 640, 400),
      description: v.description,
      look: v.look,
      demoUrl: v.status === "live" ? demoSiteUrl(v.id) : null,
      designs: DESIGNS.map((d) => ({
        id: d.id,
        name: d.name,
        blurb: d.blurb,
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
      <section className="relative overflow-hidden border-b border-[var(--mkt-border)]">
        <div className="absolute inset-0 pointer-events-none mkt-hero-wash" aria-hidden />
        <div className={`relative ${mkt.container} grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center`}>
          <div>
            <span className={mkt.eyebrow}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--mkt-accent-2)] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mkt-accent-2)]" />
              </span>
              {live.length} live websites · {DESIGNS.length} skins each
            </span>
            <h1 className="font-display mt-6 max-w-xl text-4xl text-balance sm:text-6xl text-[var(--mkt-text)]">
              Walk the site. Then <span className="italic text-[var(--mkt-accent-text)]">buy the same one.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--mkt-text-secondary)] sm:text-lg">
              Every demo is a real tenant — pages, admin, leads. Unlock a private 10-minute sandbox with OTP. No card.
            </p>
            {sp.expired && !focusVertical && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--mkt-accent-2)]/30 bg-[var(--mkt-accent-soft)] px-4 py-1.5 text-sm font-medium text-[var(--mkt-accent-text)]">
                <Sparkles className="w-4 h-4" /> Your last sandbox ended. Pick a sector below to start again.
              </p>
            )}
          </div>
          <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Palette, n: "01", t: "Pick a look", d: "Sector + design skin, including two different non-profit concepts." },
              { icon: KeyRound, n: "02", t: "Verify OTP", d: "One phone number, one sector, a private 10-minute sandbox." },
              { icon: Globe, n: "03", t: "Open site & admin", d: "Click around, edit a page, submit a form. It resets after." },
            ].map((s) => (
              <li key={s.n} className={`flex gap-3 p-4 ${mkt.card}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)]">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-[var(--mkt-accent-text)]">{s.n}</p>
                  <p className="font-semibold text-[var(--mkt-text)]">{s.t}</p>
                  <p className={`mt-0.5 text-sm ${mkt.muted}`}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
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
