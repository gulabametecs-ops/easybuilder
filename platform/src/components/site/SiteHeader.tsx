"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Menu, X } from "lucide-react";
import type { HeaderConfig } from "@/lib/config";

export function SiteHeader({ header }: { header: HeaderConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { topbar } = header;

  const announcement = header.announcement;

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement / offer bar */}
      {announcement?.show && announcement.text && (
        <div className="bg-primary text-white text-center text-xs sm:text-sm py-2 px-4">
          {announcement.link ? (
            <a href={announcement.link} className="font-medium hover:underline">{announcement.text}</a>
          ) : (
            <span className="font-medium">{announcement.text}</span>
          )}
        </div>
      )}
      {/* Top bar */}
      {topbar.show && (
        <div className="bg-dark text-white/80 text-xs sm:text-sm">
          <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon name="map" className="w-4 h-4 text-primary" />
              <span className="truncate">{topbar.address}</span>
            </div>
            <div className="flex items-center gap-4">
              {topbar.phones.length > 0 && (
                <a href={`tel:${topbar.phones[0]}`} className="flex items-center gap-1.5 hover:text-white">
                  <Icon name="phone" className="w-4 h-4 text-primary" />
                  {topbar.phones.join(", ")}
                </a>
              )}
              <a href={`mailto:${topbar.email}`} className="hidden md:flex items-center gap-1.5 hover:text-white">
                <Icon name="mail" className="w-4 h-4 text-primary" />
                {topbar.email}
              </a>
              <div className="flex items-center gap-2">
                {topbar.social.facebook && <a href={topbar.social.facebook} aria-label="Facebook"><Icon name="facebook" className="w-4 h-4" /></a>}
                {topbar.social.instagram && <a href={topbar.social.instagram} aria-label="Instagram"><Icon name="instagram" className="w-4 h-4" /></a>}
                {topbar.social.whatsapp && <a href={topbar.social.whatsapp} aria-label="WhatsApp"><Icon name="whatsapp" className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <div className="bg-white shadow-sm border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {header.logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={header.logoImage} alt={header.logoText} className="h-11 w-auto" />
            ) : (
              <LogoMark text={header.logoText} />
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {header.nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${active ? "text-primary" : "text-slate-700 hover:text-primary"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href={header.cta.href} className="btn-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              <Icon name="edit" className="w-4 h-4" />
              {header.cta.label}
            </Link>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 text-slate-700" aria-label="Menu">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col">
              {header.nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2.5 text-slate-700 font-medium hover:text-primary">
                  {item.label}
                </Link>
              ))}
              <Link href={header.cta.href} onClick={() => setOpen(false)} className="btn-primary mt-2 inline-flex justify-center px-5 py-2.5 text-sm font-semibold">
                {header.cta.label}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function LogoMark({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center">
        <span className="text-primary font-extrabold text-lg leading-none">
          {text
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      </div>
      <span className="font-extrabold text-lg tracking-tight text-secondary">{text}</span>
    </div>
  );
}
