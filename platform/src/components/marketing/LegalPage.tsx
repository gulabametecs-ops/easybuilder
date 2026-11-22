import type { ReactNode } from "react";
import { MarketingPageHero } from "./MarketingPageHero";
import { mkt } from "@/lib/marketingTheme";
import { getPlatformConfig } from "@/lib/platformConfig";

export const LAST_UPDATED = "16 November 2026";

export type Business = {
  name: string;
  email: string; // "" when not configured
  phone: string;
  address: string;
  gstin: string;
  /** e.g. "the courts at Jaipur" — falls back to a neutral phrase. */
  courts: string;
};

const STATES =
  /^(andhra pradesh|arunachal pradesh|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|andaman and nicobar islands|chandigarh|dadra and nagar haveli and daman and diu|delhi|new delhi|nct of delhi|jammu and kashmir|ladakh|lakshadweep|puducherry)$/i;

/** City from a free-text Indian address: the part just before the state (PIN codes and "India" ignored). */
export function cityFromAddress(address: string): string {
  // ponytail: heuristic; add a dedicated "jurisdiction city" setting if addresses get unusual
  const parts = address
    .split(/[,\n]/)
    .map((p) => p.replace(/[-–\s]*\b\d{6}\b/g, "").replace(/\s+/g, " ").trim())
    .filter((p) => p && !/^india$/i.test(p));
  const stateAt = parts.findLastIndex((p) => STATES.test(p));
  if (stateAt >= 0 && /delhi/i.test(parts[stateAt])) return "New Delhi";
  if (stateAt > 0) return parts[stateAt - 1];
  return "";
}

export async function getBusiness(): Promise<Business> {
  const cfg = await getPlatformConfig();
  const city = cityFromAddress(cfg.businessAddress || "");
  return {
    name: cfg.platformName?.trim() || "SitePixl",
    email: cfg.supportEmail?.trim() || "",
    phone: cfg.supportPhone?.trim() || "",
    address: cfg.businessAddress?.trim() || "",
    gstin: cfg.gstin?.trim() || "",
    courts: city ? `the courts at ${city}` : "the competent courts having jurisdiction over our registered office in India",
  };
}

/** Support email as a link, or a pointer to the contact page when none is configured. */
export function EmailLink({ b }: { b: Business }) {
  return b.email ? <a href={`mailto:${b.email}`}>{b.email}</a> : <a href="/contact">our contact page</a>;
}

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Long-form legal page: hero, sticky table of contents (desktop), readable prose column. */
export function LegalPage({ title, intro, sections }: { title: string; intro: ReactNode; sections: LegalSection[] }) {
  const toc = (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-2 rounded-lg px-2 py-1.5 text-[var(--mkt-text-muted)] hover:bg-[var(--mkt-accent-soft)] hover:text-[var(--mkt-text)] transition-colors"
          >
            <span className="tabular-nums opacity-60">{i + 1}.</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <main>
      <MarketingPageHero title={title} description={`Last updated: ${LAST_UPDATED}`} />
      <div className={`${mkt.container} py-10 sm:py-14 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12`}>
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24 max-h-[calc(100vh/var(--mkt-zoom,1)-7rem)] overflow-y-auto pr-2">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mkt-text)]">On this page</p>
            {toc}
          </nav>
        </aside>
        <div className="min-w-0 max-w-3xl">
          <details className={`lg:hidden mb-8 ${mkt.cardSoft} p-4`}>
            <summary className="cursor-pointer text-sm font-semibold text-[var(--mkt-text)]">On this page</summary>
            <div className="mt-3">{toc}</div>
          </details>
          <div className={PROSE}>{intro}</div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className={`scroll-mt-24 pt-8 mt-8 border-t border-[var(--mkt-border)] ${PROSE}`}>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--mkt-text)] mb-4">
                <span className="text-[var(--mkt-text-muted)] mr-2 tabular-nums">{i + 1}.</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export const PROSE =
  "text-[15px] leading-relaxed text-[var(--mkt-text-secondary)] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-[var(--mkt-text)] [&_strong]:text-[var(--mkt-text)] [&_a]:text-[var(--mkt-accent-text)] [&_a]:underline [&_a]:underline-offset-2 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:text-[var(--mkt-text)] [&_th]:p-3 [&_td]:p-3 [&_td]:align-top [&_tr]:border-b [&_tr]:border-[var(--mkt-border)]";

/** Business identity card used on every legal page. */
export function BusinessDetails({ b }: { b: Business }) {
  const rows: [string, ReactNode][] = [
    ["Business name", b.name],
    ["Registered address", b.address ? <span className="whitespace-pre-line">{b.address}</span> : "Shared on request and printed on every tax invoice"],
    ["Email", <EmailLink key="e" b={b} />],
    ["Phone", b.phone ? <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a> : "Available on request by email"],
  ];
  if (b.gstin) rows.push(["GSTIN", <span key="g" className="font-mono">{b.gstin}</span>]);
  return (
    <dl className={`${mkt.card} p-5 sm:p-6 grid gap-3 sm:grid-cols-[180px_1fr] text-sm mb-4`}>
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-[var(--mkt-text)]">{k}</dt>
          <dd className="text-[var(--mkt-text-secondary)] break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Grievance Officer block (IT Act / SPDI Rules 2011, DPDP Act 2023, Consumer Protection (E-Commerce) Rules 2020). */
export function GrievanceOfficer({ b }: { b: Business }) {
  return (
    <div className={`${mkt.cardSoft} p-5 sm:p-6 text-sm mb-4`}>
      <div className="font-semibold text-[var(--mkt-text)] mb-2">Grievance Officer, {b.name}</div>
      <div className="mb-1">
        Email: <EmailLink b={b} /> (subject line: &ldquo;Grievance&rdquo;)
      </div>
      {b.phone && <div className="mb-1">Phone: {b.phone}</div>}
      {b.address && <div className="mb-1 whitespace-pre-line">Address: {b.address}</div>}
      <div className="mt-3">
        We acknowledge every grievance within 24 to 48 hours and aim to resolve it within 30 days of receipt. Please
        include your name, the email or phone linked to your account (or the website you used) and a short
        description of the issue.
      </div>
    </div>
  );
}
