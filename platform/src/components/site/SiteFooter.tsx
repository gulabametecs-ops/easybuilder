import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { FooterConfig } from "@/lib/config";
import { safeHref } from "@/lib/sanitizeHtml";

const WRAP = "mx-auto max-w-7xl px-4 sm:px-6";

export function SiteFooter({ footer, bizName }: { footer: FooterConfig; bizName: string }) {
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year));
  const design = footer.design || "classic";

  if (design === "centered") return <CenteredFooter footer={footer} bizName={bizName} copyright={copyright} />;
  if (design === "minimal") return <MinimalFooter footer={footer} bizName={bizName} copyright={copyright} />;
  if (design === "modern") return <ModernFooter footer={footer} bizName={bizName} copyright={copyright} />;
  if (design === "gradient") return <GradientFooter footer={footer} bizName={bizName} copyright={copyright} />;
  return <ClassicFooter footer={footer} bizName={bizName} copyright={copyright} />;
}

// ─── Shared bits ──────────────────────────────────────────────────────────────
function Socials({ social, className = "" }: { social: FooterConfig["social"]; className?: string }) {
  const fb = safeHref(social.facebook || "");
  const ig = safeHref(social.instagram || "");
  const wa = safeHref(social.whatsapp || "");
  const loc = safeHref(social.location || "");
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {fb && <SocialDot href={fb} icon="facebook" label="Facebook" />}
      {ig && <SocialDot href={ig} icon="instagram" label="Instagram" />}
      {wa && <SocialDot href={wa} icon="whatsapp" label="WhatsApp" />}
      {loc && <SocialDot href={loc} icon="map" label="Location" />}
    </div>
  );
}
function SocialDot({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 hover:bg-primary hover:ring-primary hover:-translate-y-0.5 flex items-center justify-center transition-all"
      rel="noopener noreferrer"
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      <Icon name={icon} className="w-4 h-4 text-white" />
    </a>
  );
}
function Brand({ bizName, about, social }: { bizName: string; about: string; social: FooterConfig["social"] }) {
  return (
    <div className="sm:col-span-2 lg:col-span-1 lg:pr-6">
      <div className="text-xl font-bold tracking-tight text-white mb-4">{bizName}</div>
      <p className="text-sm leading-relaxed text-white/60 max-w-sm">{about}</p>
      <Socials social={social} className="mt-6" />
    </div>
  );
}
function ColTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-white text-xs font-semibold uppercase tracking-[0.14em] mb-5">{children}</h4>;
}
function LinkCols({ columns }: { columns: FooterConfig["columns"] }) {
  return (
    <>
      {columns.map((col) => (
        <div key={col.title}>
          <ColTitle>{col.title}</ColTitle>
          <ul className="space-y-3 text-sm">
            {col.links.map((l) => {
              const href = safeHref(l.href) || "#";
              return (
                <li key={l.label}>
                  <Link href={href} className="group inline-flex items-center gap-1.5 text-white/65 hover:text-white transition-colors">
                    {l.label}
                    <Icon name="arrow" className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
function ContactCol({ contact }: { contact: FooterConfig["contact"] }) {
  return (
    <div>
      <ColTitle>Contact Us</ColTitle>
      <ul className="space-y-3.5 text-sm text-white/65">
        {contact.phones.map((p) => (
          <li key={p} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 flex items-center justify-center shrink-0"><Icon name="phone" className="w-3.5 h-3.5 text-primary" /></span>
            <a href={`tel:${p}`} className="hover:text-white transition-colors tabular-nums">{p}</a>
          </li>
        ))}
        {contact.email && (
          <li className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 flex items-center justify-center shrink-0"><Icon name="mail" className="w-3.5 h-3.5 text-primary" /></span>
            <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">{contact.email}</a>
          </li>
        )}
        {contact.address && (
          <li className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 flex items-center justify-center shrink-0"><Icon name="map" className="w-3.5 h-3.5 text-primary" /></span>
            <span className="pt-1.5 leading-relaxed">{contact.address}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
function BottomBar({ copyright, line = "border-white/10" }: { copyright: string; line?: string }) {
  return (
    <div className={`border-t ${line}`}>
      <div className={`${WRAP} py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50`}>
        <span className="text-center sm:text-left">{copyright}</span>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
const shell = "relative overflow-hidden bg-dark text-white/70 mt-auto print:hidden";
const GRID = "grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]";

/** Faint top hairline + soft brand glow shared by footers. */
function Glow() {
  return (
    <>
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div aria-hidden className="site-blob w-[30rem] h-[16rem] left-1/2 -translate-x-1/2 -top-48 opacity-20" />
    </>
  );
}

// ─── 1. Classic — 4-column ────────────────────────────────────────────────────
function ClassicFooter({ footer, bizName, copyright }: { footer: FooterConfig; bizName: string; copyright: string }) {
  return (
    <footer className={shell}>
      <Glow />
      <div className={`relative ${WRAP} py-16 sm:py-20 ${GRID}`}>
        <Brand bizName={bizName} about={footer.about} social={footer.social} />
        <LinkCols columns={footer.columns} />
        <ContactCol contact={footer.contact} />
      </div>
      <BottomBar copyright={copyright} />
    </footer>
  );
}

// ─── 2. Modern — gradient CTA banner on top ───────────────────────────────────
function ModernFooter({ footer, bizName, copyright }: { footer: FooterConfig; bizName: string; copyright: string }) {
  const phone = footer.contact.phones[0];
  return (
    <footer className={shell}>
      <Glow />
      <div className={`relative ${WRAP} pt-14 sm:pt-16`}>
        <div className="relative overflow-hidden rounded-[calc(var(--site-radius)*1.6)] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white ring-1 ring-white/10 [background:linear-gradient(120deg,var(--c-primary),color-mix(in_srgb,var(--c-primary)_35%,var(--c-dark)))] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
          <div aria-hidden className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Have a question?</h3>
            <p className="text-white/80 mt-2">We&apos;re here to help — reach out anytime.</p>
          </div>
          {phone && (
            <a href={`tel:${phone}`} className="relative inline-flex items-center gap-2 rounded-[var(--site-radius)] bg-white text-slate-900 font-semibold px-6 py-3.5 shadow-[0_10px_24px_-10px_rgb(0_0_0/0.45)] hover:-translate-y-0.5 transition-transform">
              <Icon name="phone" className="w-4 h-4" /> {phone}
            </a>
          )}
        </div>
      </div>
      <div className={`relative ${WRAP} py-14 sm:py-16 ${GRID}`}>
        <Brand bizName={bizName} about={footer.about} social={footer.social} />
        <LinkCols columns={footer.columns} />
        <ContactCol contact={footer.contact} />
      </div>
      <BottomBar copyright={copyright} />
    </footer>
  );
}

// ─── 3. Centered — airy, centered brand + inline nav ──────────────────────────
function CenteredFooter({ footer, bizName, copyright }: { footer: FooterConfig; bizName: string; copyright: string }) {
  const links = footer.columns.flatMap((c) => c.links).slice(0, 6);
  return (
    <footer className={shell}>
      <Glow />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{bizName}</div>
        <p className="text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed text-white/60">{footer.about}</p>
        <nav className="mt-9 flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
          {links.map((l) => (
            <Link key={l.label} href={safeHref(l.href) || "#"} className="rounded-full px-4 py-1.5 text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors">{l.label}</Link>
          ))}
        </nav>
        <Socials social={footer.social} className="mt-8 justify-center" />
        {(footer.contact.phones[0] || footer.contact.email) && (
          <p className="mt-8 text-sm flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-white/60">
            {footer.contact.phones[0] && <a href={`tel:${footer.contact.phones[0]}`} className="inline-flex items-center gap-2 hover:text-white transition-colors"><Icon name="phone" className="w-4 h-4 text-primary" /> {footer.contact.phones[0]}</a>}
            {footer.contact.email && <a href={`mailto:${footer.contact.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors break-all"><Icon name="mail" className="w-4 h-4 text-primary" /> {footer.contact.email}</a>}
          </p>
        )}
      </div>
      <BottomBar copyright={copyright} />
    </footer>
  );
}

// ─── 4. Minimal — compact single band ─────────────────────────────────────────
function MinimalFooter({ footer, bizName, copyright }: { footer: FooterConfig; bizName: string; copyright: string }) {
  return (
    <footer className={shell}>
      <div className={`${WRAP} py-10 flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="text-center md:text-left">
          <div className="text-lg font-bold tracking-tight text-white">{bizName}</div>
          <p className="text-xs mt-1.5 text-white/50">{copyright}</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {footer.columns.flatMap((c) => c.links).slice(0, 5).map((l) => (
            <Link key={l.label} href={safeHref(l.href) || "#"} className="text-white/65 hover:text-white transition-colors">{l.label}</Link>
          ))}
          <Link href="/terms" className="text-white/65 hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="text-white/65 hover:text-white transition-colors">Privacy</Link>
        </nav>
        <Socials social={footer.social} />
      </div>
    </footer>
  );
}

// ─── 5. Gradient — full gradient background, glass columns ─────────────────────
function GradientFooter({ footer, bizName, copyright }: { footer: FooterConfig; bizName: string; copyright: string }) {
  return (
    <footer className="relative overflow-hidden mt-auto text-white/80 print:hidden [background:linear-gradient(135deg,var(--c-dark)_20%,color-mix(in_srgb,var(--c-primary)_45%,var(--c-dark)))]">
      <div aria-hidden className="absolute -bottom-40 -right-32 w-[30rem] h-[30rem] rounded-full bg-primary/30 blur-[110px] pointer-events-none" />
      <div className={`relative ${WRAP} py-16 sm:py-20 ${GRID}`}>
        <Brand bizName={bizName} about={footer.about} social={footer.social} />
        <LinkCols columns={footer.columns} />
        <ContactCol contact={footer.contact} />
      </div>
      <div className="relative">
        <BottomBar copyright={copyright} line="border-white/15" />
      </div>
    </footer>
  );
}
