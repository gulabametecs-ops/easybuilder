"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Menu, X } from "lucide-react";
import type { HeaderConfig } from "@/lib/config";
import { safeHref } from "@/lib/sanitizeHtml";

const WRAP = "mx-auto max-w-7xl px-4 sm:px-6";

export function SiteHeader({ header }: { header: HeaderConfig }) {
  const design = header.design || "classic";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const safe: HeaderConfig = {
    ...header,
    cta: { ...header.cta, href: safeHref(header.cta.href) || "/" },
    nav: header.nav.map((item) => ({ ...item, href: safeHref(item.href) || "#" })),
    announcement: header.announcement
      ? { ...header.announcement, link: safeHref(header.announcement.link || "") }
      : header.announcement,
    topbar: {
      ...header.topbar,
      social: {
        facebook: safeHref(header.topbar.social.facebook || ""),
        instagram: safeHref(header.topbar.social.instagram || ""),
        whatsapp: safeHref(header.topbar.social.whatsapp || ""),
      },
    },
  };
  return (
    <header data-scrolled={scrolled ? "true" : "false"} className="group/hdr sticky top-0 z-40 print:hidden">
      <AnnouncementBar header={safe} />
      {safe.topbar.show && design !== "minimal" && design !== "bold" && <TopBar header={safe} />}
      {design === "modern" && <ModernNav header={safe} />}
      {design === "centered" && <CenteredNav header={safe} />}
      {design === "minimal" && <MinimalNav header={safe} />}
      {design === "bold" && <BoldNav header={safe} />}
      {(design === "classic" || !["modern", "centered", "minimal", "bold"].includes(design)) && (
        <ClassicNav header={safe} />
      )}
    </header>
  );
}

function AnnouncementBar({ header }: { header: HeaderConfig }) {
  const announcement = header.announcement;
  if (!announcement?.show || !announcement.text) return null;
  const href = announcement.link || "";
  return (
    <div className="bg-primary text-white text-center text-xs sm:text-sm py-2 px-4 [background-image:linear-gradient(90deg,transparent,rgb(255_255_255/0.12),transparent)]">
      {href ? (
        <a href={href} className="group inline-flex items-center gap-1.5 font-medium">
          {announcement.text}
          <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      ) : (
        <span className="font-medium">{announcement.text}</span>
      )}
    </div>
  );
}

function TopBar({ header }: { header: HeaderConfig }) {
  const { topbar } = header;
  return (
    <div className="hidden sm:block bg-dark text-white/70 text-xs">
      <div className={`${WRAP} py-2 flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="map" className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{topbar.address}</span>
        </div>
        <div className="flex items-center gap-5">
          {topbar.phones.length > 0 && (
            <a href={`tel:${topbar.phones[0]}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Icon name="phone" className="w-3.5 h-3.5 text-primary" />
              {topbar.phones.join(", ")}
            </a>
          )}
          <a href={`mailto:${topbar.email}`} className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
            <Icon name="mail" className="w-3.5 h-3.5 text-primary" />
            {topbar.email}
          </a>
          <div className="flex items-center gap-1">
            {topbar.social.facebook && <a href={topbar.social.facebook} aria-label="Facebook" className="p-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"><Icon name="facebook" className="w-3.5 h-3.5" /></a>}
            {topbar.social.instagram && <a href={topbar.social.instagram} aria-label="Instagram" className="p-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"><Icon name="instagram" className="w-3.5 h-3.5" /></a>}
            {topbar.social.whatsapp && <a href={topbar.social.whatsapp} aria-label="WhatsApp" className="p-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"><Icon name="whatsapp" className="w-3.5 h-3.5" /></a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function useNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return { open, setOpen, isActive };
}

function Logo({ header, light = false }: { header: HeaderConfig; light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
      {header.logoImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={header.logoImage} alt={header.logoText} className={`w-auto max-w-[180px] object-contain ${light ? "h-9 brightness-0 invert" : "h-10 sm:h-11"}`} />
      ) : (
        <LogoMark text={header.logoText} light={light} />
      )}
    </Link>
  );
}

function MenuButton({ open, setOpen, dark = false }: { open: boolean; setOpen: (v: boolean) => void; dark?: boolean }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className={`lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full transition-colors ${dark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-900/5"}`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}

function MobileMenu({
  header, open, setOpen, isActive, dark = false, bg,
}: {
  header: HeaderConfig;
  open: boolean;
  setOpen: (v: boolean) => void;
  isActive: (href: string) => boolean;
  dark?: boolean;
  bg?: string;
}) {
  return (
    <div
      className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="overflow-hidden">
        <nav className={`border-t ${bg ?? (dark ? "border-white/10 bg-secondary" : "border-slate-900/5 bg-white")}`}>
          <div className={`${WRAP} py-4 flex flex-col gap-1 max-h-[calc(100dvh-5rem)] overflow-y-auto`}>
            {header.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? undefined : -1}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-[var(--site-radius)] px-4 py-3 text-base font-medium transition-colors ${
                    dark
                      ? active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                      : active ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-900/[0.04]"
                  }`}
                >
                  {item.label}
                  <Icon name="arrow" className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
            <Link
              href={header.cta.href}
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
              className={`mt-3 inline-flex justify-center items-center gap-2 px-5 py-3.5 text-sm font-semibold ${bg ? "rounded-[var(--site-radius)] bg-white text-slate-900" : "btn-primary"}`}
            >
              {header.cta.label} <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

/** Link style shared by light navs: soft pill hover, tinted active state. */
function lightLink(active: boolean) {
  return `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.04]"}`;
}

/** Classic — white glass bar, logo left, links, CTA (default) */
function ClassicNav({ header }: { header: HeaderConfig }) {
  const { open, setOpen, isActive } = useNav();
  return (
    <div className="site-glass border-b border-slate-900/[0.06] transition-shadow duration-300 group-data-[scrolled=true]/hdr:shadow-[0_8px_30px_-12px_rgb(15_23_42/0.18)]">
      <div className={`${WRAP} h-16 sm:h-[4.5rem] flex items-center justify-between gap-4`}>
        <Logo header={header} />
        <nav className="hidden lg:flex items-center gap-1">
          {header.nav.map((item) => (
            <Link key={item.href} href={item.href} className={lightLink(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={header.cta.href} className="btn-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
            {header.cta.label}
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
          <MenuButton open={open} setOpen={setOpen} />
        </div>
      </div>
      <MobileMenu header={header} open={open} setOpen={setOpen} isActive={isActive} />
    </div>
  );
}

/** Modern — dark glass nav bar with light links */
function ModernNav({ header }: { header: HeaderConfig }) {
  const { open, setOpen, isActive } = useNav();
  return (
    <div className="text-white border-b border-white/10 bg-[color-mix(in_srgb,var(--c-secondary)_88%,transparent)] backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 group-data-[scrolled=true]/hdr:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)]">
      <div className={`${WRAP} h-16 sm:h-[4.5rem] flex items-center justify-between gap-4`}>
        <Logo header={header} light />
        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 p-1">
          {header.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${isActive(item.href) ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={header.cta.href} className="btn-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
            {header.cta.label}
          </Link>
          <MenuButton open={open} setOpen={setOpen} dark />
        </div>
      </div>
      <MobileMenu header={header} open={open} setOpen={setOpen} isActive={isActive} dark />
    </div>
  );
}

/** Centered — logo middle, nav split / under */
function CenteredNav({ header }: { header: HeaderConfig }) {
  const { open, setOpen, isActive } = useNav();
  const mid = Math.ceil(header.nav.length / 2);
  const left = header.nav.slice(0, mid);
  const right = header.nav.slice(mid);
  return (
    <div className="site-glass border-b border-slate-900/[0.06] transition-shadow duration-300 group-data-[scrolled=true]/hdr:shadow-[0_8px_30px_-12px_rgb(15_23_42/0.18)]">
      <div className={`${WRAP} py-3`}>
        <div className="hidden lg:flex items-center justify-center gap-6">
          <nav className="flex items-center gap-1 flex-1 justify-end">
            {left.map((item) => (
              <Link key={item.href} href={item.href} className={lightLink(isActive(item.href))}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4"><Logo header={header} /></div>
          <nav className="flex items-center gap-1 flex-1">
            {right.map((item) => (
              <Link key={item.href} href={item.href} className={lightLink(isActive(item.href))}>
                {item.label}
              </Link>
            ))}
            <Link href={header.cta.href} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold ml-auto">
              {header.cta.label}
            </Link>
          </nav>
        </div>
        <div className="flex lg:hidden items-center justify-between h-10 sm:h-12">
          <Logo header={header} />
          <MenuButton open={open} setOpen={setOpen} />
        </div>
      </div>
      <MobileMenu header={header} open={open} setOpen={setOpen} isActive={isActive} />
    </div>
  );
}

/** Minimal — slim glass bar, logo + compact links + CTA */
function MinimalNav({ header }: { header: HeaderConfig }) {
  const { open, setOpen, isActive } = useNav();
  return (
    <div className="site-glass border-b border-slate-900/[0.06] transition-shadow duration-300 group-data-[scrolled=true]/hdr:shadow-[0_6px_24px_-12px_rgb(15_23_42/0.18)]">
      <div className={`${WRAP} h-14 sm:h-16 flex items-center justify-between gap-4`}>
        <Logo header={header} />
        <nav className="hidden lg:flex items-center gap-6">
          {header.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 text-sm font-medium transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-current after:transition-all ${isActive(item.href) ? "text-slate-900 after:w-full" : "text-slate-500 hover:text-slate-900 after:w-0 hover:after:w-full"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={header.cta.href} className="group hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/30 hover:bg-primary hover:text-white transition-colors">
            {header.cta.label}
            <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <MenuButton open={open} setOpen={setOpen} />
        </div>
      </div>
      <MobileMenu header={header} open={open} setOpen={setOpen} isActive={isActive} />
    </div>
  );
}

/** Bold — solid brand bar */
function BoldNav({ header }: { header: HeaderConfig }) {
  const { open, setOpen, isActive } = useNav();
  return (
    <div className="bg-primary text-white [background-image:linear-gradient(180deg,rgb(255_255_255/0.08),transparent)] transition-shadow duration-300 shadow-sm group-data-[scrolled=true]/hdr:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.35)]">
      <div className={`${WRAP} h-16 sm:h-[4.5rem] flex items-center justify-between gap-4`}>
        <Logo header={header} light />
        <nav className="hidden lg:flex items-center gap-1">
          {header.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive(item.href) ? "bg-white/20 text-white" : "text-white/85 hover:text-white hover:bg-white/10"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={header.cta.href} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-[var(--site-radius)] bg-white text-slate-900 shadow-[0_6px_16px_-6px_rgb(0_0_0/0.35)] hover:-translate-y-px transition-transform">
            {header.cta.label}
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
          <MenuButton open={open} setOpen={setOpen} dark />
        </div>
      </div>
      <MobileMenu header={header} open={open} setOpen={setOpen} isActive={isActive} dark bg="border-white/20 bg-primary" />
    </div>
  );
}

function LogoMark({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`w-10 h-10 shrink-0 rounded-[calc(var(--site-radius)*0.9)] flex items-center justify-center ${light ? "bg-white/15 ring-1 ring-inset ring-white/20" : "bg-gradient-to-br from-primary to-[var(--c-primary-dark)] shadow-[0_6px_14px_-6px_var(--c-primary)]"}`}>
        <span className="font-extrabold text-base leading-none tracking-tight text-white">
          {text
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      </div>
      <span className={`font-bold text-lg tracking-tight truncate ${light ? "text-white" : "text-[var(--c-heading)]"}`}>{text}</span>
    </div>
  );
}
