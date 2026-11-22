import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentTenant, getSiteCauseBySlug, getSiteCauses, getTenantConfig } from "@/lib/tenant";
import { Icon } from "@/components/site/Icon";
import { compactINR, progressPct } from "@/lib/cause";
import { PropertyGallery } from "@/components/site/sections/PropertyBlocks";
import { CauseCards, CauseDonateLayout, CauseProgress, CauseShare } from "@/components/site/sections/CauseBlocks";
import { timeLeftLabel } from "@/lib/cause";

type Props = { params: Promise<{ slug: string }> };

const RADIUS_LG = "rounded-[calc(var(--site-radius)*1.6)]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const { slug } = await params;
  const c = await getSiteCauseBySlug(tenant.id, slug);
  if (!c) return {};
  const title = `${c.title} | ${tenant.name}`;
  const description = c.summary || c.story.slice(0, 160) || c.title;
  return {
    title,
    description,
    alternates: { canonical: `/causes/${c.slug}` },
    openGraph: { title, description, url: `/causes/${c.slug}`, images: c.coverImage ? [{ url: c.coverImage }] : undefined },
  };
}

export default async function CauseDetailPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { slug } = await params;
  const c = await getSiteCauseBySlug(tenant.id, slug);
  if (!c) notFound();
  const [config, all, listPage] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    getSiteCauses(tenant.id),
    // the page that shows the causes ("/causes", "/donate"…), home as fallback
    db.page.findFirst({
      where: { tenantId: tenant.id, published: true, slug: { not: "home" }, sections: { some: { type: "causeList" } } },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);
  const listHref = listPage ? `/${listPage.slug}` : "/";

  const images = [...new Set([c.coverImage, ...c.gallery].filter(Boolean))];
  const pct = progressPct(c);
  const paragraphs = c.story.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const updates = [...c.updates].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const more = all.filter((x) => x.id !== c.id && x.status === "active").slice(0, 3);
  const fmtDate = (d: string) => {
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const before = (
    <>
      <PropertyGallery images={images} title={c.title} />

      <header>
        <div className="flex flex-wrap gap-2 mb-3">
          {c.category && <span className="rounded-full bg-primary text-white text-xs font-semibold px-3 py-1">{c.category}</span>}
          {c.urgent && c.status === "active" && (
            <span className="rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 inline-flex items-center gap-1"><Icon name="zap" className="w-3 h-3" />Urgent</span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight break-words">{c.title}</h1>
        {(c.beneficiaries || c.location) && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 site-muted text-sm">
            {c.beneficiaries && <span className="inline-flex items-center gap-1.5"><Icon name="users" className="w-4 h-4 shrink-0 text-primary" />{c.beneficiaries}</span>}
            {c.location && <span className="inline-flex items-center gap-1.5"><Icon name="map-pin" className="w-4 h-4 shrink-0 text-primary" />{c.location}</span>}
          </div>
        )}
      </header>

      <section className={`${RADIUS_LG} bg-light ring-1 ring-[var(--site-line)] p-5 sm:p-7`} aria-label="Fundraising progress">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-4">
          <div className="min-w-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums">{compactINR(c.raised)}</p>
            <p className="text-sm site-muted">{c.goalAmount > 0 ? `raised of ${compactINR(c.goalAmount)} goal` : "raised so far"}</p>
          </div>
          {c.goalAmount > 0 && <p className="text-2xl font-extrabold tabular-nums">{pct}%</p>}
        </div>
        <CauseProgress pct={c.goalAmount ? pct : 100} className="h-3.5" />
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
          <Stat icon="users" label="Donors" value={c.donors.toLocaleString("en-IN")} />
          <Stat icon="clock" label="Time left" value={timeLeftLabel(c)} />
          {c.goalAmount > 0 && <Stat icon="trending" label="Still needed" value={compactINR(Math.max(0, c.goalAmount - c.raised))} />}
        </dl>
        {c.status !== "paused" && (
          <a href="#donate" className="lg:hidden btn-primary mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold">
            <Icon name="heart" className="w-4 h-4" /> {c.status === "completed" ? "Keep supporting" : "Donate now"}
          </a>
        )}
      </section>

      {paragraphs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">The story</h2>
          <div className="space-y-4 leading-relaxed site-muted">
            {paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line break-words">{p}</p>)}
          </div>
        </section>
      )}
    </>
  );

  const after = (
    <>
      {updates.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-5">Updates</h2>
          <ol className="relative border-l-2 border-[var(--site-line)] ml-2 space-y-7">
            {updates.map((u, i) => (
              <li key={`${u.date}-${i}`} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-[var(--site-surface)]" />
                {u.date && <p className="text-xs uppercase tracking-wider font-semibold text-primary">{fmtDate(u.date)}</p>}
                <h3 className="font-bold mt-0.5 break-words">{u.title}</h3>
                {u.text && <p className="text-sm site-muted mt-1 whitespace-pre-line break-words">{u.text}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Spread the word</h2>
        <CauseShare title={c.title} />
      </section>
    </>
  );

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm site-muted mb-5">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Icon name="arrow" className="w-3.5 h-3.5" />
          <Link href={listHref} className="hover:text-primary">{listPage?.title || "Causes"}</Link>
          <Icon name="arrow" className="w-3.5 h-3.5" />
          <span className="text-primary truncate max-w-[14rem]">{c.title}</span>
        </nav>

        <CauseDonateLayout
          cause={{ id: c.id, title: c.title, status: c.status, impactTiers: c.impactTiers }}
          payments={config.payments}
          orgName={tenant.name}
          before={before}
          after={after}
        />
      </div>

      {more.length > 0 ? (
        <section className="bg-light py-16 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">More causes to <span className="text-primary">support</span></h2>
            <CauseCards list={more} />
          </div>
        </section>
      ) : <div className="pb-16" />}
    </article>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-2.5 min-w-0">
      <span className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon name={icon} className="w-4 h-4" /></span>
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wider site-muted font-semibold">{label}</dt>
        <dd className="font-bold text-sm tabular-nums">{value}</dd>
      </div>
    </div>
  );
}
