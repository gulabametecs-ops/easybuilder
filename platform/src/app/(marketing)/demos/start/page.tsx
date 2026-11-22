import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, KeyRound, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import { buildSectors } from "@/lib/demoSectors";
import { getActiveDemoSession, sweepExpiredDemoSessions } from "@/lib/demoSession";
import { DemoConceptPreview } from "@/components/marketing/DemoConceptPreview";
import { DemoStartPanel } from "@/components/marketing/DemoStartPanel";
import { VerticalIcon } from "@/components/marketing/VerticalIcon";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Start your live demo — SitePixl" };

const STEPS = [
  { icon: UserRound, t: "Your details", d: "Name, phone, email and business" },
  { icon: KeyRound, t: "Verify with OTP", d: "One-time code, no password" },
  { icon: LayoutDashboard, t: "Explore site & admin", d: "Private 10-minute sandbox" },
];

export default async function DemoStartPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string; design?: string }>;
}) {
  const sp = await searchParams;
  await sweepExpiredDemoSessions(); // wipe abandoned sandboxes (data + uploads)
  const sector = buildSectors().find((s) => s.id === sp.vertical && s.status === "live");
  if (!sector) redirect("/demos");
  const design = sector.designs.find((d) => d.id === sp.design) ?? sector.designs[0];

  // Already verified: go straight to the running demo (or to /demos to switch sectors).
  const session = await getActiveDemoSession();
  if (session?.vertical === sector.id) redirect(`/demos?vertical=${sector.id}&design=${design.id}&live=1`);
  if (session) redirect(`/demos?vertical=${sector.id}`);

  return (
    <main className="mkt-hero-dark relative isolate">
      <div className="mkt-hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className={`${mkt.container} py-8 sm:py-10`}>
        <Link href={`/demos?vertical=${sector.id}&design=${design.id}`} className={`inline-flex items-center gap-1.5 text-sm font-medium ${mkt.muted} hover:text-[var(--mkt-text)]`}>
          <ArrowLeft className="h-4 w-4" /> Back to demos
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          {/* What they're about to open */}
          <section className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)]" style={{ color: sector.accent }}>
                <VerticalIcon name={sector.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className={`text-xs ${mkt.muted}`}>{sector.category} · {design.name} design</p>
                <h1 className="font-display text-2xl text-[var(--mkt-text)] sm:text-[2rem]">Start your free {sector.name} demo</h1>
              </div>
            </div>
            <p className={`mt-3 max-w-xl text-[15px] leading-relaxed ${mkt.muted}`}>
              You&apos;ll get a private copy of this website with its full admin panel — add services, change the design and
              submit a test enquiry to see it land in your inbox.
            </p>

            <div className="mt-6 rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] p-3 sm:p-4">
              <DemoConceptPreview sector={sector} design={design} bare />
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {["Full website with real content", "Admin panel: pages, services, gallery, SEO", "Leads & bookings inbox", "Switch between 5 designs"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[var(--mkt-text-secondary)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Details form */}
          <section className="lg:sticky lg:top-24 lg:self-start">
            <div className={`${mkt.card} p-6 shadow-xl sm:p-7`}>
              <ol className="mb-6 grid grid-cols-3 gap-2">
                {STEPS.map((s, i) => (
                  <li key={s.t} className="text-center">
                    <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${i === 0 ? "mkt-brand-grad" : "bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-muted)]"}`}>
                      <s.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-[var(--mkt-text)]">{s.t}</p>
                    <p className={`mt-0.5 hidden text-[11px] leading-snug sm:block ${mkt.muted}`}>{s.d}</p>
                  </li>
                ))}
              </ol>
              <h2 className="text-lg font-semibold text-[var(--mkt-text)]">Tell us a little about you</h2>
              <p className={`mb-5 mt-1 text-sm ${mkt.muted}`}>Takes under a minute. No card or payment needed.</p>
              <DemoStartPanel
                vertical={{ id: sector.id, name: sector.name }}
                designs={sector.designs.map((d) => ({ id: d.id, name: d.name }))}
                design={design.id}
              />
              <p className={`mt-5 flex items-center gap-1.5 text-xs ${mkt.muted}`}>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Your sandbox is private and deleted automatically when it ends.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
