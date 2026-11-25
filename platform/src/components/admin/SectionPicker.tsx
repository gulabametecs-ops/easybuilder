"use client";

import { useState } from "react";

import {
  LayoutTemplate, LayoutGrid, AlignLeft, BarChart3, Images, ListOrdered, Megaphone, Users, Tag, Sparkles,
  Quote, HelpCircle, Play, MapPin, FileText, Mail, Bell, Trophy, Download, CreditCard, Clock, Type, Timer,
  PanelTop, CalendarClock, Building2, HandHeart, Wallet, ShoppingBag, X, Search, type LucideIcon,
} from "lucide-react";
import { SECTION_META } from "@/lib/sectionDefaults";
import type { SectionType } from "@/lib/config";

const SECTION_ICON: Record<string, LucideIcon> = {
  banner: PanelTop, hero: LayoutTemplate, about: AlignLeft, serviceCategories: LayoutGrid, stats: BarChart3,
  gallery: Images, steps: ListOrdered, cta: Megaphone, team: Users, priceList: Tag, features: Sparkles,
  testimonials: Quote, faq: HelpCircle, logos: Users, video: Play, imageBanner: Images, contactInfo: MapPin,
  quoteForm: FileText, contactForm: Mail, appointmentForm: CalendarClock, richText: Type, pricingPlans: CreditCard,
  openingHours: Clock, countdown: Timer, map: MapPin, noticeBoard: Bell, toppers: Trophy, downloads: Download, propertyList: Building2, productGrid: ShoppingBag, productCategories: LayoutGrid, causeList: HandHeart, payOnline: Wallet,
};

const CATEGORIES: { name: string; types: SectionType[] }[] = [
  {
    name: "Headers & banners",
    types: ["hero", "banner", "imageBanner", "video"],
  },
  {
    name: "Content & text",
    types: ["about", "richText", "visionMission", "features", "steps", "stats", "logos", "openingHours", "countdown", "map"],
  },
  {
    name: "Services & pricing",
    types: ["serviceCategories", "priceList", "pricingPlans", "propertyList", "productGrid", "productCategories"],
  },
  {
    name: "Nonprofit & donations",
    types: ["causeList", "donatePay", "eventList", "volunteerForm"],
  },
  {
    name: "Photos & media",
    types: ["gallery", "team", "toppers", "downloads"],
  },
  {
    name: "Forms & contact",
    types: ["quoteForm", "contactForm", "appointmentForm", "contactInfo", "payOnline"],
  },
  {
    name: "Trust & engagement",
    types: ["testimonials", "faq", "cta", "noticeBoard"],
  },
];

export function SectionPicker({
  open,
  onClose,
  onPick,
  positionHint,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (type: string) => void;
  /** e.g. 'after "Hero"' — shown so the user knows where it will land. */
  positionHint?: string;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  if (!open) return null;

  const metaMap = new Map(SECTION_META.map((m) => [m.type, m]));
  const needle = q.trim().toLowerCase();
  const matches = (t: string) => {
    const m = metaMap.get(t as SectionType);
    return !!m && (!needle || `${m.label} ${m.description ?? ""} ${m.type}`.toLowerCase().includes(needle));
  };
  const close = () => { setQ(""); setCat(null); onClose(); };
  const shown = CATEGORIES.filter((c) => (!cat || c.name === cat) && c.types.some(matches));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full sm:max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Add a section</h3>
            <p className="text-sm text-slate-500">
              Pick a block — it will be added <span className="font-semibold text-lime-600">{positionHint ?? "at the end of the page"}</span>
            </p>
          </div>
          <button type="button" onClick={close} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pt-4 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search blocks — e.g. team, form, gallery, price"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 pl-9 pr-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {[null, ...CATEGORIES.map((c) => c.name)].map((name) => (
              <button
                key={name ?? "all"}
                type="button"
                onClick={() => setCat(name)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                  cat === name
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-lime-500 dark:text-slate-950 dark:border-lime-500"
                    : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-lime-500"
                }`}
              >
                {name ?? "All"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-5 space-y-6">
          {shown.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No blocks match &ldquo;{q}&rdquo;</p>}
          {shown.map((cat) => {
            const items = cat.types.filter(matches).map((t) => metaMap.get(t)).filter(Boolean);
            if (!items.length) return null;
            return (
              <div key={cat.name}>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{cat.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.map((m) => {
                    if (!m) return null;
                    const Ic = SECTION_ICON[m.type] ?? LayoutTemplate;
                    return (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => {
                          onPick(m.type);
                          close();
                        }}
                        className="group text-left p-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-lime-500/10 transition"
                      >
                        <span className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-lime-600 flex items-center justify-center mb-2 group-hover:border-lime-400">
                          <Ic className="w-5 h-5" />
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{m.label}</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{m.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
