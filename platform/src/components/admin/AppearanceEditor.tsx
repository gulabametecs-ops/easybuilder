"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2, Palette, PanelTop, PanelBottom, Code2,
  Type, Squircle, Sparkles, Moon, Sun, Heading, AlignLeft,
  Eye, Image as ImageIcon, Megaphone, Phone, Mail,
  MapPin, Share2, MousePointerClick,
} from "lucide-react";
import { saveTheme, saveHeader, saveFooter, saveCustomCss } from "@/lib/actions/appearance";
import { Field, TextArea, SaveBar } from "./ui";
import { ImageInput } from "./ImageInput";
import { DevicePreviewFrame } from "./DevicePreviewFrame";
import { NavLinksEditor } from "./NavLinksEditor";
import type { ThemeConfig, HeaderConfig, FooterConfig } from "@/lib/config";

const FONTS = ["Poppins", "Inter", "Roboto", "Montserrat", "Lato", "Open Sans", "Nunito", "Work Sans"];
const RADII = [
  { label: "Sharp", value: "0.25rem", r: 4 },
  { label: "Soft", value: "0.6rem", r: 10 },
  { label: "Rounded", value: "0.9rem", r: 14 },
  { label: "Pill", value: "1.3rem", r: 22 },
];

type Props = { theme: ThemeConfig; header: HeaderConfig; footer: FooterConfig; customCss: string; version: string };

const TABS = [
  { id: "Theme" as const, label: "Theme", icon: Palette, hint: "Colours & look" },
  { id: "Header" as const, label: "Header", icon: PanelTop, hint: "Logo & menu" },
  { id: "Footer" as const, label: "Footer", icon: PanelBottom, hint: "Bottom bar" },
  { id: "Custom CSS" as const, label: "CSS", icon: Code2, hint: "Advanced" },
];

const COLOR_ROLES: {
  key: keyof ThemeConfig["colors"];
  label: string;
  hint: string;
  icon: typeof Palette;
  group: "brand" | "surface" | "type";
}[] = [
  { key: "primary", label: "Brand", hint: "Buttons & accents", icon: Sparkles, group: "brand" },
  { key: "primaryDark", label: "Brand dark", hint: "Hover / depth", icon: Moon, group: "brand" },
  { key: "accent", label: "Accent", hint: "Highlights", icon: Sparkles, group: "brand" },
  { key: "secondary", label: "Secondary", hint: "Dark bands", icon: PanelTop, group: "surface" },
  { key: "dark", label: "Dark bg", hint: "Hero / footer", icon: Moon, group: "surface" },
  { key: "light", label: "Light bg", hint: "Page sections", icon: Sun, group: "surface" },
  { key: "heading", label: "Headings", hint: "Titles", icon: Heading, group: "type" },
  { key: "text", label: "Body text", hint: "Paragraphs", icon: AlignLeft, group: "type" },
];

export function AppearanceEditor({ theme, header, footer, customCss, version }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("Theme");
  const [previewHidden, setPreviewHidden] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);

  useEffect(() => {
    setPreviewTick((t) => t + 1);
  }, [version]);

  const src = `/?__edit=1&_r=${previewTick}&v=${encodeURIComponent(version)}`;

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-h-0 gap-0">
        {/* Left editor */}
        <div
          className="w-full flex flex-col min-h-0 order-2 xl:order-1"
          style={previewHidden ? { flex: "1 1 auto", width: "100%" } : { width: 400, flex: "0 0 400px", minWidth: 320, maxWidth: "100%" }}
        >
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 h-full">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shrink-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Palette className="w-4 h-4 text-lime-600 shrink-0" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">Appearance</p>
              </div>
              {previewHidden && (
                <button
                  type="button"
                  onClick={() => setPreviewHidden(false)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-xs font-medium text-lime-600"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              )}
            </div>

            {/* Icon tabs */}
            <div className="grid grid-cols-4 gap-1 p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              {TABS.map((t) => {
                const Ic = t.icon;
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition ${
                      on
                        ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900 shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Ic className="w-4 h-4" />
                    <span className="text-[10px] font-bold leading-none">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3">
              {tab === "Theme" && <ThemeForm theme={theme} />}
              {tab === "Header" && <HeaderForm header={header} />}
              {tab === "Footer" && <FooterForm footer={footer} />}
              {tab === "Custom CSS" && <CustomCssForm customCss={customCss} />}
            </div>
          </div>
        </div>

        {/* Divider */}
        {!previewHidden && (
          <div className="hidden xl:block w-px bg-slate-200 dark:bg-slate-700 shrink-0 order-1 xl:order-2 self-stretch" />
        )}

        {/* Right preview */}
        {!previewHidden && (
          <div className="flex-1 min-w-0 min-h-[420px] xl:min-h-0 order-1 xl:order-3 flex flex-col">
            <DevicePreviewFrame
              src={src}
              reloadKey={`${version}:${previewTick}`}
              className="flex-1 min-h-0 h-[calc(100vh-8rem)]"
              onToggleHidden={() => setPreviewHidden(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Theme ───────────────────────────────────────────────────────────────────
function ThemeForm({ theme }: { theme: ThemeConfig }) {
  const [colors, setColors] = useState(theme.colors);
  const [font, setFont] = useState(theme.font);
  const [radius, setRadius] = useState(theme.radius);
  const set = (k: keyof ThemeConfig["colors"]) => (v: string) => setColors((c) => ({ ...c, [k]: v }));

  return (
    <form action={saveTheme} className="space-y-5 pb-2">
      {/* Live brand strip */}
      <div
        className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
        style={{ fontFamily: `'${font}', ui-sans-serif, sans-serif` }}
      >
        <div className="p-4 text-white relative" style={{ background: `linear-gradient(135deg, ${colors.dark}, ${colors.secondary})` }}>
          <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 85% 20%, ${colors.primary}, transparent 45%)` }} />
          <div className="relative">
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 tracking-wide uppercase"
              style={{ background: colors.primary + "33", color: colors.primary, borderRadius: radius }}
            >
              Live look
            </span>
            <h4 className="text-lg font-extrabold mt-2 leading-tight" style={{ color: "#fff" }}>
              Your Brand <span style={{ color: colors.primary }}>Here</span>
            </h4>
            <p className="text-xs mt-1 text-white/75 max-w-[90%]">Buttons, titles & backgrounds update as you pick colours.</p>
            <div className="mt-3 flex gap-2">
              <span className="text-white text-[11px] font-bold px-3.5 py-2" style={{ background: colors.primary, borderRadius: radius }}>
                Call Now
              </span>
              <span className="text-white/90 text-[11px] font-semibold px-3.5 py-2 border border-white/30" style={{ borderRadius: radius }}>
                Services
              </span>
            </div>
          </div>
        </div>
        <div className="p-3 flex gap-2" style={{ background: colors.light }}>
          <div className="flex-1 bg-white p-2.5 shadow-sm" style={{ borderRadius: radius }}>
            <div className="h-8 mb-2" style={{ background: colors.primary + "22", borderRadius: radius }} />
            <p className="text-[11px] font-bold" style={{ color: colors.heading }}>Card title</p>
            <p className="text-[10px]" style={{ color: colors.text }}>Body preview text</p>
          </div>
          <div className="flex-1 bg-white p-2.5 shadow-sm" style={{ borderRadius: radius }}>
            <div className="h-8 mb-2" style={{ background: colors.secondary + "18", borderRadius: radius }} />
            <p className="text-[11px] font-bold" style={{ color: colors.heading }}>Another card</p>
            <p className="text-[10px]" style={{ color: colors.text }}>Matches your theme</p>
          </div>
        </div>
      </div>

      {/* Brand colours */}
      <SectionLabel>Brand colours</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {COLOR_ROLES.filter((r) => r.group === "brand").map((r) => (
          <ColorSwatchCard
            key={r.key}
            name={r.key}
            label={r.label}
            hint={r.hint}
            icon={r.icon}
            value={colors[r.key]}
            onChange={set(r.key)}
          />
        ))}
      </div>

      <SectionLabel>Backgrounds</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {COLOR_ROLES.filter((r) => r.group === "surface").map((r) => (
          <ColorSwatchCard
            key={r.key}
            name={r.key}
            label={r.label}
            hint={r.hint}
            icon={r.icon}
            value={colors[r.key]}
            onChange={set(r.key)}
            compact
          />
        ))}
      </div>

      <SectionLabel>Text colours</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {COLOR_ROLES.filter((r) => r.group === "type").map((r) => (
          <ColorSwatchCard
            key={r.key}
            name={r.key}
            label={r.label}
            hint={r.hint}
            icon={r.icon}
            value={colors[r.key]}
            onChange={set(r.key)}
          />
        ))}
      </div>

      {/* Font */}
      <SectionLabel icon={Type}>Font</SectionLabel>
      <input type="hidden" name="font" value={font} />
      <div className="grid grid-cols-2 gap-2">
        {FONTS.map((f) => {
          const on = font === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFont(f)}
              className={`rounded-xl border-2 p-3 text-left transition ${
                on ? "border-lime-500 bg-lime-500/10 ring-2 ring-lime-500/15" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="block text-2xl font-bold leading-none mb-1" style={{ fontFamily: `'${f}', sans-serif` }}>
                Aa
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                {f}
                {on && <CheckCircle2 className="w-3 h-3 text-lime-600" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Radius */}
      <SectionLabel icon={Squircle}>Corners</SectionLabel>
      <input type="hidden" name="radius" value={radius} />
      <div className="grid grid-cols-4 gap-2">
        {RADII.map((r) => {
          const on = radius === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setRadius(r.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2.5 transition ${
                on ? "border-lime-500 bg-lime-500/10" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <span
                className="w-10 h-10 border-2 border-slate-400/60 bg-slate-100 dark:bg-slate-800"
                style={{ borderRadius: r.r, background: colors.primary + "33", borderColor: colors.primary }}
              />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{r.label}</span>
            </button>
          );
        })}
      </div>

      <SaveBar label="Save theme" />
    </form>
  );
}

function ColorSwatchCard({
  name, label, hint, icon: Ic, value, onChange, compact,
}: {
  name: string;
  label: string;
  hint: string;
  icon: typeof Palette;
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <label className="group relative block cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:border-lime-400 transition">
      <span
        className={`block w-full ${compact ? "h-16" : "h-20"}`}
        style={{ background: value }}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <span className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between gap-1">
        <span>
          <span className="flex items-center gap-1 text-white text-[11px] font-bold drop-shadow">
            <Ic className="w-3 h-3" /> {label}
          </span>
          {!compact && <span className="block text-[9px] text-white/75">{hint}</span>}
        </span>
        <span className="text-[9px] font-mono text-white/80 bg-black/30 rounded px-1.5 py-0.5">{value}</span>
      </span>
      <input
        type="color"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>
  );
}

function SectionLabel({ children, icon: Ic }: { children: React.ReactNode; icon?: typeof Palette }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pt-1">
      {Ic && <Ic className="w-3.5 h-3.5" />}
      {children}
    </p>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
const HEADER_DESIGNS: { value: NonNullable<HeaderConfig["design"]>; label: string; desc: string; thumb: React.ReactNode }[] = [
  { value: "classic", label: "Classic", desc: "White bar + CTA", thumb: (
    <div className="w-full h-full bg-slate-100 p-1.5 flex flex-col gap-1">
      <div className="h-1.5 bg-slate-800 rounded-sm opacity-40" />
      <div className="flex-1 bg-white rounded-sm flex items-center justify-between px-1.5">
        <div className="w-4 h-2 bg-slate-800/70 rounded-sm" />
        <div className="flex gap-0.5">{[0,1,2].map((i) => <span key={i} className="w-2 h-0.5 bg-slate-400 rounded" />)}</div>
        <div className="w-3.5 h-2 bg-lime-500 rounded-sm" />
      </div>
    </div>
  ) },
  { value: "modern", label: "Modern", desc: "Dark nav bar", thumb: (
    <div className="w-full h-full bg-slate-900 p-1.5 flex items-center justify-between px-2">
      <div className="w-4 h-2 bg-white/70 rounded-sm" />
      <div className="flex gap-0.5">{[0,1,2].map((i) => <span key={i} className="w-2 h-0.5 bg-white/40 rounded" />)}</div>
      <div className="w-3.5 h-2 bg-lime-500 rounded-sm" />
    </div>
  ) },
  { value: "centered", label: "Centered", desc: "Logo in middle", thumb: (
    <div className="w-full h-full bg-white p-1.5 flex items-center justify-center gap-1.5 border border-slate-100">
      <div className="flex gap-0.5 flex-1 justify-end">{[0,1].map((i) => <span key={i} className="w-2 h-0.5 bg-slate-400 rounded" />)}</div>
      <div className="w-4 h-2.5 bg-slate-800/80 rounded-sm" />
      <div className="flex gap-0.5 flex-1">{[0,1].map((i) => <span key={i} className="w-2 h-0.5 bg-slate-400 rounded" />)}</div>
    </div>
  ) },
  { value: "minimal", label: "Minimal", desc: "Slim & clean", thumb: (
    <div className="w-full h-full bg-white flex items-center justify-between px-2.5 border border-slate-100">
      <div className="w-5 h-1 bg-slate-700 rounded" />
      <div className="flex gap-1">{[0,1,2].map((i) => <span key={i} className="w-2.5 h-0.5 bg-slate-300 rounded" />)}</div>
      <div className="w-4 h-0.5 bg-lime-500 rounded" />
    </div>
  ) },
  { value: "bold", label: "Bold", desc: "Brand colour bar", thumb: (
    <div className="w-full h-full bg-lime-600 p-1.5 flex items-center justify-between px-2">
      <div className="w-4 h-2 bg-white/90 rounded-sm" />
      <div className="flex gap-0.5">{[0,1,2].map((i) => <span key={i} className="w-2 h-0.5 bg-white/50 rounded" />)}</div>
      <div className="w-3.5 h-2 bg-white rounded-sm" />
    </div>
  ) },
];

function HeaderDesignPicker({ value }: { value: string }) {
  const [sel, setSel] = useState(value);
  return (
    <div>
      <SectionLabel>Header layout</SectionLabel>
      <input type="hidden" name="design" value={sel} />
      <div className="grid grid-cols-2 gap-2 mt-2">
        {HEADER_DESIGNS.map((d) => (
          <button
            type="button"
            key={d.value}
            onClick={() => setSel(d.value)}
            className={`text-left rounded-xl border-2 p-2 transition ${
              sel === d.value ? "border-lime-500 ring-2 ring-lime-500/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="rounded-lg overflow-hidden aspect-[16/9] border border-slate-100 dark:border-slate-700 bg-slate-50">
              {d.thumb}
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center gap-1">
              {d.label}
              {sel === d.value && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />}
            </p>
            <p className="text-[10px] text-slate-400">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function HeaderForm({ header }: { header: HeaderConfig }) {
  const [announce, setAnnounce] = useState(!!header.announcement?.show);
  const [topbar, setTopbar] = useState(!!header.topbar.show);

  return (
    <form action={saveHeader} className="space-y-4 pb-2">
      <HeaderDesignPicker value={header.design ?? "classic"} />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-lime-600" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Logo</span>
        </div>
        <div className="p-3 space-y-3">
          <Field label="Logo text" name="logoText" defaultValue={header.logoText} />
          <ImageInput name="logoImage" label="Logo image (optional)" defaultValue={header.logoImage} aspect="aspect-[3/1]" />
        </div>
      </div>

      <ToggleCard
        icon={Megaphone}
        title="Announcement bar"
        desc="Offer strip above the header"
        checked={announce}
        onChange={setAnnounce}
        name="announceShow"
      >
        <div className="grid gap-3">
          <Field label="Text" name="announceText" defaultValue={header.announcement?.text ?? ""} placeholder="🎉 Get 10% off…" />
          <Field label="Link" name="announceLink" defaultValue={header.announcement?.link ?? ""} placeholder="/quote" />
        </div>
      </ToggleCard>

      <ToggleCard
        icon={Phone}
        title="Top contact bar"
        desc="Address, phones & social"
        checked={topbar}
        onChange={setTopbar}
        name="topbarShow"
      >
        <div className="space-y-3">
          <IconField icon={MapPin} label="Address" name="address" defaultValue={header.topbar.address} />
          <div className="grid grid-cols-1 gap-3">
            <IconField icon={Phone} label="Phones (comma separated)" name="phones" defaultValue={header.topbar.phones.join(", ")} />
            <IconField icon={Mail} label="Email" name="email" defaultValue={header.topbar.email} />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <IconField icon={Share2} label="Facebook" name="facebook" defaultValue={header.topbar.social.facebook ?? ""} />
            <IconField icon={Share2} label="Instagram" name="instagram" defaultValue={header.topbar.social.instagram ?? ""} />
            <IconField icon={Share2} label="WhatsApp" name="whatsapp" defaultValue={header.topbar.social.whatsapp ?? ""} />
          </div>
        </div>
      </ToggleCard>

      <NavLinksEditor name="nav" initial={header.nav} title="Menu links" hint="Add pages people see in the top menu" />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <MousePointerClick className="w-3.5 h-3.5 text-lime-600" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Header button</span>
        </div>
        <div className="p-3 grid grid-cols-2 gap-3">
          <Field label="Label" name="ctaLabel" defaultValue={header.cta.label} />
          <Field label="Link" name="ctaHref" defaultValue={header.cta.href} />
        </div>
      </div>

      <SaveBar label="Save header" />
    </form>
  );
}

function ToggleCard({
  icon: Ic, title, desc, checked, onChange, name, children,
}: {
  icon: typeof Megaphone;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border overflow-hidden transition ${checked ? "border-lime-400/60" : "border-slate-200 dark:border-slate-700"}`}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-full flex items-center gap-3 px-3 py-3 text-left bg-slate-50/80 dark:bg-slate-800/40"
      >
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${checked ? "bg-lime-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
          <Ic className="w-4 h-4" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-slate-800 dark:text-white">{title}</span>
          <span className="block text-[11px] text-slate-400">{desc}</span>
        </span>
        <span className={`w-10 h-6 rounded-full relative transition ${checked ? "bg-lime-500" : "bg-slate-300 dark:bg-slate-600"}`}>
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${checked ? "left-4.5 right-0.5 left-auto translate-x-0" : "left-0.5"}`} style={{ left: checked ? "1.15rem" : "0.125rem" }} />
        </span>
        <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      </button>
      {checked && <div className="p-3 border-t border-slate-100 dark:border-slate-700">{children}</div>}
    </div>
  );
}

function IconField({
  icon: Ic, label, name, defaultValue, placeholder,
}: {
  icon: typeof Phone;
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
        <Ic className="w-3.5 h-3.5 text-lime-600" /> {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500"
      />
    </label>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
const col = <div className="rounded-sm bg-white/15 flex flex-col gap-0.5 p-0.5"><div className="h-0.5 bg-white/45 rounded" /><div className="h-0.5 bg-white/25 rounded w-3/4" /><div className="h-0.5 bg-white/25 rounded w-2/3" /></div>;
const dots = <div className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-white/40" />)}</div>;

const FOOTER_DESIGNS: { value: NonNullable<FooterConfig["design"]>; label: string; desc: string; thumb: React.ReactNode }[] = [
  { value: "classic", label: "Classic", desc: "4 columns", thumb: (
    <div className="w-full h-full bg-slate-900 p-1.5 flex flex-col gap-1"><div className="flex-1 grid grid-cols-4 gap-1">{col}{col}{col}{col}</div><div className="h-1 bg-white/10 rounded" /></div>
  ) },
  { value: "modern", label: "Modern", desc: "Gradient CTA", thumb: (
    <div className="w-full h-full bg-slate-900 p-1.5 flex flex-col gap-1"><div className="h-3 rounded-sm [background:linear-gradient(90deg,#84cc16,#3f6212)]" /><div className="flex-1 grid grid-cols-4 gap-1">{col}{col}{col}{col}</div></div>
  ) },
  { value: "gradient", label: "Gradient", desc: "Full gradient", thumb: (
    <div className="w-full h-full p-1.5 flex flex-col gap-1 [background:linear-gradient(135deg,#0f172a,#4d7c0f)]"><div className="flex-1 grid grid-cols-4 gap-1">{col}{col}{col}{col}</div><div className="h-1 bg-white/15 rounded" /></div>
  ) },
  { value: "centered", label: "Centered", desc: "Airy centre", thumb: (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-1.5"><div className="w-7 h-1 bg-white/50 rounded" /><div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className="w-3 h-0.5 bg-white/30 rounded" />)}</div>{dots}</div>
  ) },
  { value: "minimal", label: "Minimal", desc: "Compact band", thumb: (
    <div className="w-full h-full bg-slate-900 flex items-center justify-between px-2.5"><div className="w-7 h-1 bg-white/40 rounded" /><div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="w-3 h-0.5 bg-white/25 rounded" />)}</div>{dots}</div>
  ) },
];

function FooterDesignPicker({ value }: { value: string }) {
  const [sel, setSel] = useState(value);
  return (
    <div>
      <SectionLabel>Footer layout</SectionLabel>
      <input type="hidden" name="design" value={sel} />
      <div className="grid grid-cols-2 gap-2 mt-2">
        {FOOTER_DESIGNS.map((d) => (
          <button type="button" key={d.value} onClick={() => setSel(d.value)}
            className={`text-left rounded-xl border-2 p-2 transition ${sel === d.value ? "border-lime-500 ring-2 ring-lime-500/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
            <div className="rounded-lg overflow-hidden aspect-[16/9] border border-slate-100 dark:border-slate-700">{d.thumb}</div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center gap-1">
              {d.label}{sel === d.value && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />}
            </p>
            <p className="text-[10px] text-slate-400">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function FooterForm({ footer }: { footer: FooterConfig }) {
  const quick = footer.columns[0]?.links ?? [];
  return (
    <form action={saveFooter} className="space-y-4 pb-2">
      <FooterDesignPicker value={footer.design ?? "classic"} />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <SectionLabel>About</SectionLabel>
        <TextArea label="About text" name="about" defaultValue={footer.about} rows={2} />
        <Field label="Service areas (comma separated)" name="serviceAreas" defaultValue={footer.serviceAreas.join(", ")} />
      </div>

      <NavLinksEditor name="quickLinks" initial={quick} title="Quick links" hint="Footer menu — same easy setup as header" />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        <SectionLabel icon={Phone}>Contact</SectionLabel>
        <IconField icon={Phone} label="Phones" name="cphones" defaultValue={footer.contact.phones.join(", ")} />
        <IconField icon={Mail} label="Email" name="cemail" defaultValue={footer.contact.email} />
        <IconField icon={MapPin} label="Address" name="caddress" defaultValue={footer.contact.address} />
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
        <SectionLabel icon={Share2}>Social</SectionLabel>
        <IconField icon={Share2} label="Facebook" name="ffacebook" defaultValue={footer.social.facebook ?? ""} />
        <IconField icon={Share2} label="Instagram" name="finstagram" defaultValue={footer.social.instagram ?? ""} />
        <IconField icon={Share2} label="WhatsApp" name="fwhatsapp" defaultValue={footer.social.whatsapp ?? ""} />
        <IconField icon={MapPin} label="Location URL" name="flocation" defaultValue={footer.social.location ?? ""} />
      </div>

      <Field label="Copyright (use {year})" name="copyright" defaultValue={footer.copyright} />
      <SaveBar label="Save footer" />
    </form>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
function CustomCssForm({ customCss }: { customCss: string }) {
  return (
    <form action={saveCustomCss} className="space-y-4 pb-2">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" /> Advanced only
        </p>
        <p className="text-[11px] text-amber-700/80 dark:text-amber-200/70 mt-1 leading-relaxed">
          Extra CSS on every page. Target a section&apos;s custom class or <span className="font-mono">#anchor-id</span> from Style tab.
        </p>
      </div>
      <textarea
        name="customCss"
        defaultValue={customCss}
        rows={16}
        spellCheck={false}
        placeholder={".my-class { background: #f5f5f5; }\n#contact { padding-top: 40px; }"}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-lime-500"
      />
      <SaveBar label="Save custom CSS" />
    </form>
  );
}
