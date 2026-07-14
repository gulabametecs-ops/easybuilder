"use client";

import { useState } from "react";
import { saveTheme, saveHeader, saveFooter, saveCustomCss } from "@/lib/actions/appearance";
import { Card, Field, TextArea, SaveBar } from "./ui";
import { ImageInput } from "./ImageInput";
import type { ThemeConfig, HeaderConfig, FooterConfig, NavItem } from "@/lib/config";

const FONTS = ["Poppins", "Inter", "Roboto", "Montserrat", "Lato", "Open Sans", "Nunito", "Work Sans"];
const RADII = [
  { label: "Sharp", value: "0.25rem" },
  { label: "Soft", value: "0.6rem" },
  { label: "Rounded", value: "0.9rem" },
  { label: "Extra round", value: "1.3rem" },
];

type Props = { theme: ThemeConfig; header: HeaderConfig; footer: FooterConfig; customCss: string };

const TABS = ["Theme", "Header", "Footer", "Custom CSS"] as const;

export function AppearanceEditor({ theme, header, footer, customCss }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Theme");

  return (
    <>
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Theme" && <ThemeForm theme={theme} />}
      {tab === "Header" && <HeaderForm header={header} />}
      {tab === "Footer" && <FooterForm footer={footer} />}
      {tab === "Custom CSS" && <CustomCssForm customCss={customCss} />}
    </>
  );
}

function CustomCssForm({ customCss }: { customCss: string }) {
  return (
    <Card className="p-6">
      <form action={saveCustomCss} className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Custom CSS (advanced)</h3>
          <p className="text-sm text-slate-500">Add your own CSS to fine-tune your website. It is injected on every page. Target a section&apos;s <span className="font-mono text-xs bg-slate-100 px-1 rounded">Custom CSS class.</span> or its <span className="font-mono text-xs bg-slate-100 px-1 rounded">#anchor-id</span> set in the section&apos;s Design tab.</p>
        </div>
        <textarea name="customCss" defaultValue={customCss} rows={14} spellCheck={false}
          placeholder={".my-class { background: #f5f5f5; }\n#contact { padding-top: 40px; }"}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-lime-500" />
        <SaveBar label="Save custom CSS" />
      </form>
    </Card>
  );
}

function ColorField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" name={name} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 rounded-lg border border-slate-300 cursor-pointer" />
        <span className="text-xs text-slate-500 font-mono">{value}</span>
      </div>
    </label>
  );
}

// Instant, no-save preview of the chosen palette.
function ThemePreview({ colors, font, radius }: { colors: ThemeConfig["colors"]; font: string; radius: string }) {
  const c = colors;
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm sticky top-20" style={{ fontFamily: `'${font}', ui-sans-serif, sans-serif` }}>
      <div style={{ background: c.dark }} className="p-5 text-white">
        <span style={{ background: c.primary + "33", color: c.primary }} className="text-[10px] font-bold px-2 py-1 rounded-full">YOUR BADGE</span>
        <h4 className="text-lg font-extrabold mt-2 text-white">Your Business <span style={{ color: c.primary }}>Tagline</span></h4>
        <p className="text-xs mt-1 text-white/80">A short description of your services goes here.</p>
        <div className="mt-3 flex gap-2">
          <button type="button" style={{ background: c.primary }} className="text-white text-xs font-semibold px-4 py-2 rounded-full">Call Now</button>
          <button type="button" className="text-white/90 text-xs font-semibold px-4 py-2 rounded-full border border-white/30">Services</button>
        </div>
      </div>
      <div style={{ background: c.light }} className="p-5">
        <h5 className="text-sm font-bold" style={{ color: c.heading }}>Our Services</h5>
        <div className="mt-2 bg-white p-3 shadow-sm" style={{ borderRadius: radius }}>
          <div className="h-14 rounded" style={{ background: c.secondary + "22" }} />
          <p className="text-xs font-semibold mt-2" style={{ color: c.heading }}>Service name</p>
          <p className="text-[11px]" style={{ color: c.text }}>Short description of this service.</p>
        </div>
      </div>
    </div>
  );
}

function ThemeForm({ theme }: { theme: ThemeConfig }) {
  const [colors, setColors] = useState(theme.colors);
  const [font, setFont] = useState(theme.font);
  const [radius, setRadius] = useState(theme.radius);
  const set = (k: keyof ThemeConfig["colors"]) => (v: string) => setColors((c) => ({ ...c, [k]: v }));

  return (
    <Card className="p-6">
      <form action={saveTheme} className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Brand colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ColorField label="Primary" name="primary" value={colors.primary} onChange={set("primary")} />
              <ColorField label="Primary (dark)" name="primaryDark" value={colors.primaryDark} onChange={set("primaryDark")} />
              <ColorField label="Secondary" name="secondary" value={colors.secondary} onChange={set("secondary")} />
              <ColorField label="Accent" name="accent" value={colors.accent} onChange={set("accent")} />
              <ColorField label="Dark bg" name="dark" value={colors.dark} onChange={set("dark")} />
              <ColorField label="Light bg" name="light" value={colors.light} onChange={set("light")} />
              <ColorField label="Body text" name="text" value={colors.text} onChange={set("text")} />
              <ColorField label="Headings" name="heading" value={colors.heading} onChange={set("heading")} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-600 mb-1">Font</span>
              <select name="font" value={font} onChange={(e) => setFont(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm">
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-600 mb-1">Corner roundness</span>
              <select name="radius" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm">
                {RADII.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </label>
          </div>
          <SaveBar label="Save theme" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Live preview</p>
          <ThemePreview colors={colors} font={font} radius={radius} />
          <p className="text-xs text-slate-400 mt-2">Updates instantly · click Save to apply to your live site.</p>
        </div>
      </form>
    </Card>
  );
}

function navToText(nav: NavItem[]): string {
  return nav.map((n) => `${n.label} | ${n.href}`).join("\n");
}

function HeaderForm({ header }: { header: HeaderConfig }) {
  return (
    <Card className="p-6">
      <form action={saveHeader} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <Field label="Logo text" name="logoText" defaultValue={header.logoText} />
          <ImageInput name="logoImage" label="Logo image (optional)" defaultValue={header.logoImage} aspect="aspect-[3/1]" />
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" name="announceShow" defaultChecked={header.announcement?.show} className="rounded" />
            Show announcement / offer bar (top of site)
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Announcement text" name="announceText" defaultValue={header.announcement?.text ?? ""} placeholder="🎉 Get 10% off your first service!" />
            <Field label="Announcement link" name="announceLink" defaultValue={header.announcement?.link ?? ""} placeholder="/quote" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="topbarShow" defaultChecked={header.topbar.show} className="rounded" />
          Show top contact bar
        </label>
        <Field label="Address" name="address" defaultValue={header.topbar.address} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone numbers (comma separated)" name="phones" defaultValue={header.topbar.phones.join(", ")} />
          <Field label="Email" name="email" defaultValue={header.topbar.email} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Facebook URL" name="facebook" defaultValue={header.topbar.social.facebook ?? ""} />
          <Field label="Instagram URL" name="instagram" defaultValue={header.topbar.social.instagram ?? ""} />
          <Field label="WhatsApp URL" name="whatsapp" defaultValue={header.topbar.social.whatsapp ?? ""} />
        </div>
        <TextArea label="Navigation (one per line: Label | /href)" name="nav" rows={5} defaultValue={navToText(header.nav)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="CTA button label" name="ctaLabel" defaultValue={header.cta.label} />
          <Field label="CTA button link" name="ctaHref" defaultValue={header.cta.href} />
        </div>
        <SaveBar label="Save header" />
      </form>
    </Card>
  );
}

function FooterForm({ footer }: { footer: FooterConfig }) {
  const quick = footer.columns[0]?.links ?? [];
  return (
    <Card className="p-6">
      <form action={saveFooter} className="space-y-5">
        <TextArea label="About text" name="about" defaultValue={footer.about} rows={2} />
        <TextArea label="Quick links (one per line: Label | /href)" name="quickLinks" rows={5} defaultValue={navToText(quick)} />
        <Field label="Service areas (comma separated)" name="serviceAreas" defaultValue={footer.serviceAreas.join(", ")} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Contact phones (comma separated)" name="cphones" defaultValue={footer.contact.phones.join(", ")} />
          <Field label="Contact email" name="cemail" defaultValue={footer.contact.email} />
        </div>
        <Field label="Contact address" name="caddress" defaultValue={footer.contact.address} />
        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Facebook" name="ffacebook" defaultValue={footer.social.facebook ?? ""} />
          <Field label="Instagram" name="finstagram" defaultValue={footer.social.instagram ?? ""} />
          <Field label="WhatsApp" name="fwhatsapp" defaultValue={footer.social.whatsapp ?? ""} />
          <Field label="Location URL" name="flocation" defaultValue={footer.social.location ?? ""} />
        </div>
        <Field label="Copyright (use {year} for current year)" name="copyright" defaultValue={footer.copyright} />
        <SaveBar label="Save footer" />
      </form>
    </Card>
  );
}

