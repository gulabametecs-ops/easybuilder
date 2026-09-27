"use client";

import {
  LayoutTemplate, LayoutGrid, AlignLeft, BarChart3, Images, ListOrdered, Megaphone, Users, Tag, Sparkles,
  Quote, HelpCircle, Play, MapPin, FileText, Mail, Bell, Trophy, Download, CreditCard, Clock, Type, Timer,
  PanelTop, CalendarClock, X, type LucideIcon,
} from "lucide-react";
import { SECTION_META } from "@/lib/sectionDefaults";
import type { SectionType } from "@/lib/config";

const SECTION_ICON: Record<string, LucideIcon> = {
  banner: PanelTop, hero: LayoutTemplate, about: AlignLeft, serviceCategories: LayoutGrid, stats: BarChart3,
  gallery: Images, steps: ListOrdered, cta: Megaphone, team: Users, priceList: Tag, features: Sparkles,
  testimonials: Quote, faq: HelpCircle, logos: Users, video: Play, imageBanner: Images, contactInfo: MapPin,
  quoteForm: FileText, contactForm: Mail, appointmentForm: CalendarClock, richText: Type, pricingPlans: CreditCard,
  openingHours: Clock, countdown: Timer, map: MapPin, noticeBoard: Bell, toppers: Trophy, downloads: Download,
};

const CATEGORIES: { name: string; types: SectionType[] }[] = [
  {
    name: "Headers & banners",
    types: ["hero", "banner", "imageBanner", "video"],
  },
  {
    name: "Content & text",
    types: ["about", "richText", "features", "steps", "stats", "logos", "openingHours", "countdown", "map"],
  },
  {
    name: "Services & pricing",
    types: ["serviceCategories", "priceList", "pricingPlans"],
  },
  {
    name: "Photos & media",
    types: ["gallery", "team", "toppers", "downloads"],
  },
  {
    name: "Forms & contact",
    types: ["quoteForm", "contactForm", "appointmentForm", "contactInfo"],
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
}: {
  open: boolean;
  onClose: () => void;
  onPick: (type: string) => void;
}) {
  if (!open) return null;

  const metaMap = new Map(SECTION_META.map((m) => [m.type, m]));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Add a section</h3>
            <p className="text-sm text-slate-500">Pick a block — you can edit everything after adding</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5 space-y-6">
          {CATEGORIES.map((cat) => {
            const items = cat.types.map((t) => metaMap.get(t)).filter(Boolean);
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
                          onClose();
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
