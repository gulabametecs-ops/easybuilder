import Link from "next/link";
import { Icon } from "./Icon";
import type { FooterConfig } from "@/lib/config";

export function SiteFooter({ footer, bizName }: { footer: FooterConfig; bizName: string }) {
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year));

  return (
    <footer className="bg-dark text-white/70 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="text-xl font-extrabold text-white mb-3">{bizName}</div>
          <p className="text-sm leading-relaxed">{footer.about}</p>
          <div className="flex items-center gap-3 mt-5">
            {footer.social.facebook && <SocialDot href={footer.social.facebook} icon="facebook" />}
            {footer.social.instagram && <SocialDot href={footer.social.instagram} icon="instagram" />}
            {footer.social.whatsapp && <SocialDot href={footer.social.whatsapp} icon="whatsapp" />}
            {footer.social.location && <SocialDot href={footer.social.location} icon="map" />}
          </div>
        </div>

        {/* Link columns */}
        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="flex items-center gap-2 hover:text-primary">
                    <Icon name="arrow" className="w-3.5 h-3.5 text-primary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            {footer.contact.phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Icon name="phone" className="w-4 h-4 text-primary" />
                <a href={`tel:${p}`} className="hover:text-primary">{p}</a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Icon name="mail" className="w-4 h-4 text-primary" />
              <a href={`mailto:${footer.contact.email}`} className="hover:text-primary break-all">{footer.contact.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="map" className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>{footer.contact.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>{copyright}</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialDot({ href, icon }: { href: string; icon: string }) {
  return (
    <a href={href} className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
      <Icon name={icon} className="w-4 h-4 text-white" />
    </a>
  );
}
