import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";
import { VerticalIcon } from "./VerticalIcon";

/* ─── Industries: compact category cards ───────────────────────────────────── */

export type IndustryCard = {
  name: string;
  image: string;
  sectors: { id: string; name: string; icon: string }[];
};

const short = (n: string) => n.replace(/\s*\(.*\)/, "").split(" / ")[0];

// Desktop/tablet shows 8 cards (two full rows of 4), phones 3; the rest become compact chips.
const DESKTOP_CARDS = 8;
const PHONE_CARDS = 3;

export function IndustryGrid({ categories }: { categories: IndustryCard[] }) {
  const total = categories.reduce((n, c) => n + c.sectors.length, 0);
  const more = categories.slice(PHONE_CARDS);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, DESKTOP_CARDS).map((c, i) => (
          <div
            key={c.name}
            className={`group flex-col overflow-hidden ${mkt.card} transition duration-300 hover:-translate-y-0.5 hover:border-[var(--mkt-accent-2)]/40 hover:shadow-lg ${
              i < PHONE_CARDS ? "flex" : "hidden sm:flex"
            }`}
          >
            <Link href={`/demos?vertical=${c.sectors[0]?.id ?? ""}`} className="relative block aspect-[16/9] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-[var(--mkt-brand)] shadow-sm backdrop-blur">
                <VerticalIcon name={c.sectors[0]?.icon ?? ""} className="h-4 w-4" />
              </span>
              <span className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 text-white">
                <span className="text-[15px] font-semibold leading-tight">{c.name}</span>
                <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">{c.sectors.length} sites</span>
              </span>
            </Link>
            <ul className="flex flex-1 flex-wrap content-start gap-1.5 p-4 pb-3">
              {c.sectors.slice(0, 4).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/demos?vertical=${s.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mkt-border)] px-2.5 py-1 text-xs font-medium text-[var(--mkt-text-secondary)] transition hover:border-[var(--mkt-brand)]/50 hover:bg-[var(--mkt-accent-soft)] hover:text-[var(--mkt-brand)]"
                  >
                    <VerticalIcon name={s.icon} className="h-3 w-3 opacity-70" />
                    {short(s.name)}
                  </Link>
                </li>
              ))}
              {c.sectors.length > 4 && (
                <li>
                  <Link href={`/demos?vertical=${c.sectors[4].id}`} className={`inline-block px-1 py-1 text-xs font-medium ${mkt.muted} hover:text-[var(--mkt-brand)]`}>
                    +{c.sectors.length - 4} more
                  </Link>
                </li>
              )}
            </ul>
            <Link
              href={`/demos?vertical=${c.sectors[0]?.id ?? ""}`}
              className="mx-4 mb-4 mt-auto flex items-center justify-between border-t border-[var(--mkt-border)] pt-3 text-[13px] font-semibold text-[var(--mkt-text)] transition hover:text-[var(--mkt-brand)]"
            >
              Explore {c.sectors.length} {c.sectors.length === 1 ? "demo" : "demos"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>

      {/* Remaining industries as chips: on phones everything after the first 3 cards,
          on larger screens only what didn't fit in the 8 cards. */}
      {more.length > 0 && (
        <div className={`mt-6 ${more.length > DESKTOP_CARDS - PHONE_CARDS ? "" : "sm:hidden"}`}>
          <p className={`mb-3 text-center text-xs font-semibold uppercase tracking-wider ${mkt.muted}`}>More industries</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {more.map((c, i) => (
              <li key={c.name} className={i + PHONE_CARDS < DESKTOP_CARDS ? "sm:hidden" : ""}>
                <Link
                  href={`/demos?vertical=${c.sectors[0]?.id ?? ""}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3.5 py-2 text-sm font-medium text-[var(--mkt-text)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mkt-accent-2)]/50 hover:text-[var(--mkt-accent-text)]"
                >
                  <VerticalIcon name={c.sectors[0]?.icon ?? ""} className="h-4 w-4 opacity-70" />
                  {c.name}
                  <span className="rounded-full bg-[var(--mkt-surface-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--mkt-text-muted)]">{c.sectors.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/demos" className={`${mkt.btnPrimary} ${mkt.btnPrimaryMd}`}>
          Explore all {total} live demos <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/ai-builder" className={`${mkt.btnSecondary} ${mkt.btnPrimaryMd}`}>
          <Wand2 className="h-4 w-4" /> Not listed? Build with AI
        </Link>
      </div>
    </>
  );
}
