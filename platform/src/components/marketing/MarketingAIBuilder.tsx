"use client";

import { useEffect, useMemo, useRef, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles, LayoutDashboard, ArrowRight, ArrowUp, ExternalLink, ImagePlus,
  Palette, ChevronDown, RotateCcw, User, Check, MessageSquare, Wand2, Layers, PanelsTopLeft, KeyRound, Copy,
} from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { saveAiDraft } from "@/lib/ai/promptStorage";
import { applyBrandToBlueprint } from "@/lib/ai/applyBrand";
import { mkt } from "@/lib/marketingTheme";
import { stockImg } from "@/lib/img";
import { normalizeHexColor } from "@/lib/ai/applyBrand";
import { detectColorIntent } from "@/lib/ai/colorIntent";
import { PAGE_TEMPLATES } from "@/lib/pageTemplates";
import { DESIGNS } from "@/lib/designs";
import { AiBuildAnimation, AiUpdateOverlay } from "./AiBuildAnimation";
import { AiInlinePreview } from "./AiInlinePreview";
import { DesignPicker } from "./DesignPicker";
import { LegalConsent } from "./LegalConsent";
import { BrandSpinner } from "@/components/BrandLogo";

const SECTION_LABEL: Record<string, string> = {
  faq: "FAQ", testimonials: "testimonials", pricingPlans: "pricing", priceList: "price list", gallery: "gallery",
  team: "team", stats: "stats", cta: "call-to-action", hero: "hero", about: "about", features: "features",
  serviceCategories: "services", contactForm: "contact form", appointmentForm: "booking form", steps: "steps",
};

/** Plain-English summary of what a refine changed, and which page to show. */
function describeChange(before: WebsiteBlueprint, after: WebsiteBlueprint): { text: string; focus?: string } {
  const slug = (p: { slug?: string; name: string }) => (p.slug || p.name).toLowerCase();
  const beforeBySlug = new Map(before.pages.map((p) => [slug(p), p]));
  const notes: string[] = [];
  let focus: string | undefined;

  for (const p of after.pages) {
    const old = beforeBySlug.get(slug(p));
    if (!old) {
      notes.push(`added a new “${p.name}” page`);
      focus ??= p.slug;
      continue;
    }
    // Pages without explicit sections render their template's sections — count those too.
    const oldTypes = old.sections?.length
      ? old.sections.map((s) => s.sectionType)
      : (PAGE_TEMPLATES.find((t) => t.id === old.pageTemplateId)?.sections ?? []);
    const added = (p.sections ?? []).map((s) => s.sectionType).filter((t) => !oldTypes.includes(t));
    if (added.length) {
      notes.push(`added ${added.map((t) => SECTION_LABEL[t] ?? t).join(", ")} to ${p.name}`);
      focus ??= p.slug;
    } else if (JSON.stringify(old.sections) !== JSON.stringify(p.sections)) {
      notes.push(`updated the ${p.name} page`);
      focus ??= p.slug;
    }
  }
  const removed = before.pages.filter((p) => !after.pages.some((q) => slug(q) === slug(p)));
  if (removed.length) notes.push(`removed ${removed.map((p) => p.name).join(", ")}`);
  if (JSON.stringify(before.design) !== JSON.stringify(after.design) && !notes.length) notes.push("updated the design");

  if (!notes.length) return { text: "I couldn't find anything to change for that — try naming the section or page." };
  return { text: `Done — ${notes.join("; ")}. Anything else?`, focus };
}

// Same five design styles as the live demos (lib/designs). The chosen preset is
// stored on the blueprint and drives theme, header/footer, hero and section look.
type LookId = (typeof DESIGNS)[number]["id"];

function withLook(bp: WebsiteBlueprint, look: LookId): WebsiteBlueprint {
  return { ...bp, design: { ...(bp.design ?? {}), preset: look === "classic" ? undefined : look } };
}
const EXAMPLES = [
  { label: "NGO", name: "GULAB NGO", prompt: "Create an NGO website for child education named GULAB NGO — programs, impact, donate, volunteer, gallery and contact." },
  { label: "Foundation", name: "Rise Social Foundation", prompt: "Create a Section 8 social foundation website with six grassroots initiatives, public team, live events, volunteer form and donate." },
  { label: "Marketing agency", name: "Nova Digital", prompt: "Create a premium digital marketing agency website with services, portfolio, pricing and contact." },
  { label: "Restaurant", name: "Royal Spice", prompt: "Modern restaurant website called Royal Spice — menu, gallery and reservation." },
  { label: "Gym", name: "IronPulse Fitness", prompt: "High-energy gym website with programs, membership plans, trainers, class schedule and free trial booking." },
  { label: "Clinic", name: "CityCare Clinic", prompt: "Multi-speciality clinic website with departments, doctors, health packages and appointment booking." },
];

/** Suggest only what the generated site is missing, plus two always-useful tweaks. */
function refineIdeas(bp: WebsiteBlueprint | null): string[] {
  if (!bp) return [];
  const types = new Set(bp.pages.flatMap((p) => (p.sections ?? []).map((s) => s.sectionType)));
  const ideas: string[] = [];
  if (!types.has("testimonials")) ideas.push("Add customer testimonials");
  if (!types.has("faq")) ideas.push("Add an FAQ section");
  if (!types.has("pricingPlans") && !types.has("priceList")) ideas.push("Add a pricing section");
  if (!types.has("gallery")) ideas.push("Add a photo gallery");
  ideas.push("Make the hero headline more catchy", "Use a darker, premium colour style");
  return ideas.slice(0, 4);
}

type Step = "prompt" | "design" | "building" | "ready";
type Msg = { role: "user" | "ai"; text: string };

// "" = auto: the server picks an industry palette. Fallbacks only tint the design thumbnails.
const DEFAULT_PRIMARY = "";
const DEFAULT_SECONDARY = "";
const THUMB_PRIMARY = "#2f5bff";
const THUMB_SECONDARY = "#0f172a";

async function uploadAiFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/ai/website/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

function summarize(bp: WebsiteBlueprint): string {
  const pages = bp.pages.map((p) => p.name);
  return `Your website “${bp.website.name}” is ready with ${pages.length} page${pages.length === 1 ? "" : "s"}: ${pages.join(", ")}. Check the preview, ask me for changes, or open it live.`;
}

export function MarketingAIBuilder({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY);
  const [logoImage, setLogoImage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [step, setStep] = useState<Step>("prompt");
  const [buildDone, setBuildDone] = useState(false);
  const [previewKey, setPreviewKey] = useState("");
  const [previewLogin, setPreviewLogin] = useState<{ email: string; password: string } | null>(null);
  const [brandOpen, setBrandOpen] = useState(false);
  const [leftTab, setLeftTab] = useState<"chat" | "design">("chat");
  const [thread, setThread] = useState<Msg[]>([]);
  const [look, setLook] = useState<LookId>("classic");
  const [focusSlug, setFocusSlug] = useState<string | undefined>(undefined);
  const lookRef = useRef<LookId>("classic");
  const persist = (bp: WebsiteBlueprint, p: string) => saveAiDraft(p, bp);

  const pickLook = (id: LookId) => {
    lookRef.current = id;
    setLook(id);
    setBlueprint((bp) => {
      if (!bp) return bp;
      const next = withLook(bp, id);
      persist(next, prompt.trim());
      return next;
    });
  };
  const threadBox = useRef<HTMLDivElement>(null);
  const summaryRef = useRef("");
  // Refine: overlay plays while the AI works; the result is held here and applied when it ends.
  const [updating, setUpdating] = useState<{ request: string; done: boolean } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [justUpdated, setJustUpdated] = useState(false);
  const pendingUpdate = useRef<{ bp: WebsiteBlueprint; note: string; text: string; focus?: string } | null>(null);
  const finishUpdate = useCallback(() => {
    const u = pendingUpdate.current;
    pendingUpdate.current = null;
    setUpdating(null);
    if (!u) return;
    setBlueprint(u.bp);
    saveAiDraft(u.note, u.bp);
    if (u.focus) setFocusSlug(u.focus);
    setThread((t) => [...t, { role: "ai", text: u.text }]);
    setRefreshKey((k) => k + 1); // remount the preview = auto refresh
    setJustUpdated(true);
    window.setTimeout(() => setJustUpdated(false), 2600);
  }, []);
  const finishBuild = useCallback(() => {
    setThread((t) => [...t, { role: "ai", text: summaryRef.current }]);
    setStep("ready");
  }, []);

  // scrollIntoView would also scroll the page; scroll just the chat panel.
  useEffect(() => {
    const el = threadBox.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thread.length, pending]);

  const brand = () => ({
    companyName: companyName.trim(),
    primaryColor: primaryColor || undefined,
    secondaryColor: secondaryColor || undefined,
    logoImage,
    heroImage,
  });

  const nameOk = companyName.trim().length >= 2;
  const canBuild = nameOk && prompt.trim().length >= 8 && !pending;

  // Step 1 → 2: after the prompt, pick a design before anything is generated.
  const plan = () => {
    if (!canBuild) return;
    setError("");
    setStep("design");
  };

  const build = () => {
    setError("");
    setBlueprint(null);
    setStep("building");
    setBuildDone(false);
    setThread([{ role: "user", text: prompt.trim() }]);

    start(async () => {
      try {
        let res: Response | null = null;
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            res = await fetch("/api/ai/website/public-plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: prompt.trim(), ...brand() }),
            });
            break;
          } catch {
            if (attempt === 2) {
              setError("Network error — check your internet and try again.");
              setStep("prompt");
              return;
            }
            await new Promise((r) => setTimeout(r, 600));
          }
        }
        if (!res) {
          setError("Could not reach the server.");
          setStep("prompt");
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!data.success || !data.blueprint) {
          const err = data.error || "Could not generate plan. Please try again.";
          setError(/fetch failed/i.test(err) ? "The AI service is busy right now. Please try again." : err);
          setStep("prompt");
          return;
        }
        const bp = withLook(applyBrandToBlueprint(data.blueprint as WebsiteBlueprint, brand()), lookRef.current);
        // Show the palette that was actually used in the brand kit.
        setPrimaryColor(normalizeHexColor(bp.design?.primaryColor) ?? primaryColor);
        setSecondaryColor(normalizeHexColor(bp.design?.secondaryColor) ?? secondaryColor);
        setBlueprint(bp);
        persist(bp, prompt.trim());
        // The build timeline (AiBuildAnimation) plays out, then finishBuild() opens the result.
        summaryRef.current = summarize(bp);
        setBuildDone(true);
      } catch {
        setError("Something went wrong. Please try again.");
        setStep("prompt");
      }
    });
  };

  const refine = (override?: string) => {
    const text = (override ?? refinePrompt).trim();
    if (!blueprint || text.length < 3 || pending || updating) return;
    setError("");
    setThread((t) => [...t, { role: "user", text }]);
    setRefinePrompt("");
    setUpdating({ request: text, done: false });

    // Colour-only requests: apply instantly on the client, no AI call.
    const colour = detectColorIntent(text, primaryColor);
    if (colour) {
      setPrimaryColor(colour.primary);
      setSecondaryColor(colour.secondary);
      const bp = withLook(
        applyBrandToBlueprint(blueprint, { ...brand(), primaryColor: colour.primary, secondaryColor: colour.secondary }),
        lookRef.current,
      );
      pendingUpdate.current = {
        bp,
        note: `${prompt.trim()}\n\nChange: ${text}`,
        text: `Done — switched to a ${colour.name} colour theme. Say another colour anytime (e.g. “make it teal”).`,
      };
      setUpdating({ request: text, done: true });
      return;
    }

    const before = blueprint;
    start(async () => {
      const res = await fetch("/api/ai/website/public-modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, prompt: text, page: focusSlug }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : { error: "Network error — check your internet and try again." };
      if (!data.success) {
        const msg = data.error || "Could not apply changes.";
        setError(msg);
        setUpdating(null);
        setThread((t) => [...t, { role: "ai", text: `I couldn't apply that: ${msg}` }]);
        return;
      }
      // If the AI changed the colours, adopt them in the brand kit — otherwise
      // re-applying the old kit would silently undo a "change the colours" request.
      const aiDesign = (data.blueprint as WebsiteBlueprint).design ?? {};
      const p = normalizeHexColor(aiDesign.primaryColor) ?? primaryColor;
      const s2 = normalizeHexColor(aiDesign.secondaryColor) ?? secondaryColor;
      setPrimaryColor(p);
      setSecondaryColor(s2);
      const bp = withLook(
        applyBrandToBlueprint(data.blueprint as WebsiteBlueprint, { ...brand(), primaryColor: p, secondaryColor: s2 }),
        lookRef.current,
      );
      const change = describeChange(before, bp);
      pendingUpdate.current = { bp, note: `${prompt.trim()}\n\nChange: ${text}`, text: change.text, focus: change.focus };
      setUpdating({ request: text, done: true });
    });
  };

  const openLive = (kind: "site" | "admin") => {
    if (!blueprint) return;
    persist(blueprint, prompt.trim());
    start(async () => {
      const res = await fetch("/api/ai/website/preview-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, key: previewKey || undefined }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : { error: "Network error — check your internet and try again." };
      if (!data.success) {
        setError(data.error || "Could not open preview.");
        return;
      }
      setPreviewKey(data.key);
      if (data.adminEmail && data.adminPassword) {
        setPreviewLogin({ email: data.adminEmail, password: data.adminPassword });
      }
      const url = kind === "admin" ? data.adminUrl : data.siteUrl;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  const onPick = async (kind: "logo" | "hero", file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const url = await uploadAiFile(file);
      if (kind === "logo") setLogoImage(url);
      else setHeroImage(url);
      if (blueprint) {
        const bp = applyBrandToBlueprint(blueprint, {
          ...brand(),
          logoImage: kind === "logo" ? url : logoImage,
          heroImage: kind === "hero" ? url : heroImage,
        });
        setBlueprint(bp);
        persist(bp, prompt.trim());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const reset = () => {
    setStep("prompt");
    setBlueprint(null);
    setBuildDone(false);
    setError("");
    setPreviewKey("");
    setPreviewLogin(null);
    setThread([]);
    lookRef.current = "classic";
    setLook("classic");
  };

  const pageNames = blueprint?.pages.map((p) => p.name) ?? [];
  const designCards = useMemo(() => {
    const base = {
      primary: primaryColor || THUMB_PRIMARY, primaryDark: primaryColor || THUMB_PRIMARY,
      secondary: secondaryColor || THUMB_SECONDARY, accent: primaryColor || THUMB_PRIMARY,
      dark: secondaryColor || THUMB_SECONDARY, light: "#f8fafc", text: "#475569", heading: secondaryColor || THUMB_SECONDARY,
    };
    return DESIGNS.map((d) => ({
      id: d.id, name: d.name, blurb: d.blurb, tagline: d.tagline, font: d.font || "Balanced default",
      header: d.header, hero: d.hero ?? null, colors: d.palette(base),
    }));
  }, [primaryColor, secondaryColor]);
  const ideas = useMemo(() => refineIdeas(blueprint), [blueprint]);

  // Preview only: show a relevant stock photo in the hero until the visitor uploads
  // their own. The saved / purchased blueprint keeps the empty slot for their photo.
  const previewBlueprint = useMemo(() => {
    if (!blueprint || heroImage) return blueprint;
    const seed = `${blueprint.website.type ?? ""} ${blueprint.website.name} ${prompt}`;
    return applyBrandToBlueprint(blueprint, { ...brand(), heroImage: stockImg(seed, 1400, 900) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueprint, heroImage]);

  const colorField = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center gap-2 rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-2.5 py-1.5">
      <input
        type="color"
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
        onChange={(e) => set(e.target.value)}
        className="h-7 w-7 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0"
        aria-label={label}
      />
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--mkt-text-muted)]">{label}</span>
        <input
          value={value}
          placeholder="Auto"
          onChange={(e) => set(e.target.value)}
          className="w-20 bg-transparent font-mono text-xs text-[var(--mkt-text)] outline-none"
          aria-label={`${label} hex`}
        />
      </span>
    </label>
  );

  const uploadField = (kind: "logo" | "hero", label: string, value: string) => (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-2.5 py-1.5 hover:border-[var(--mkt-accent)]/60 transition">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-7 w-7 shrink-0 rounded-md object-cover" />
      ) : (
        <ImagePlus className="h-7 w-7 shrink-0 p-1 text-[var(--mkt-text-muted)]" />
      )}
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--mkt-text-muted)]">{label}</span>
        <span className="block text-xs text-[var(--mkt-text)]">{value ? "Uploaded ✓" : "Upload"}</span>
      </span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => onPick(kind, e.target.files?.[0])}
      />
    </label>
  );

  const brandKit = (
    <div className="flex flex-wrap gap-2">
      {colorField("Primary", primaryColor, setPrimaryColor)}
      {colorField("Secondary", secondaryColor, setSecondaryColor)}
      {uploadField("logo", "Logo", logoImage)}
      {uploadField("hero", "Hero image", heroImage)}
    </div>
  );


  // ─── Start screen: studio composer ────────────────────────────────────
  if (step === "prompt") {
    return (
      <section className="mkt-hero-dark relative isolate overflow-hidden text-[var(--mkt-text)]">
        <div className="mkt-hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="mkt-hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]" aria-hidden />
        <div className="mx-auto flex min-h-[calc(100dvh/var(--mkt-zoom,1)-4rem)] max-w-3xl flex-col justify-center px-4 py-14 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-1 text-xs font-medium text-[var(--mkt-text-secondary)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--mkt-accent-2)]" /> AI website builder
            </span>
            <h1 className="font-display mt-6 text-[clamp(2rem,4.6vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.04em]">
              Describe your business.
              <br />
              <span className="mkt-gradient-text">Get a complete website.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--mkt-text-muted)]">
              AI plans the pages, writes the content and designs it in your brand — with a working admin panel. Then just chat to change anything.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              plan();
            }}
            className="relative mt-10"
          >
            <div className="mkt-hero-frame-glow pointer-events-none absolute -inset-6 -z-10" aria-hidden />
            <div className="rounded-3xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-2 shadow-[0_30px_80px_-30px_rgba(10,13,20,0.25)] transition focus-within:border-[var(--mkt-accent-2)]/60">
              <div className="flex items-center gap-2.5 border-b border-[var(--mkt-border)] px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-muted)]">
                  <PanelsTopLeft className="h-4 w-4" />
                </span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Business name — e.g. Royal Spice"
                  aria-label="Business name"
                  className="w-full bg-transparent text-[15px] font-semibold text-[var(--mkt-text)] placeholder:font-normal placeholder:text-[var(--mkt-text-muted)] outline-none"
                />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    plan();
                  }
                }}
                rows={4}
                autoFocus
                placeholder="What should the website do? e.g. A play school in Pune with programs, daily routine, fees, gallery and an admission enquiry form."
                aria-label="Describe your website"
                className="w-full resize-none bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
              />
              {brandOpen && <div className="px-3 pb-3">{brandKit}</div>}
              <div className="flex items-center justify-between gap-2 px-2 pb-1">
                <button
                  type="button"
                  onClick={() => setBrandOpen((v) => !v)}
                  aria-expanded={brandOpen}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] px-3 py-1.5 text-xs font-semibold text-[var(--mkt-text-secondary)] transition hover:border-[var(--mkt-border-strong)] hover:text-[var(--mkt-text)]"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Brand kit
                  {primaryColor || secondaryColor ? (
                    <span className="flex -space-x-1">
                      <span className="h-3.5 w-3.5 rounded-full ring-2 ring-[var(--mkt-surface)]" style={{ background: primaryColor || THUMB_PRIMARY }} />
                      <span className="h-3.5 w-3.5 rounded-full ring-2 ring-[var(--mkt-surface)]" style={{ background: secondaryColor || THUMB_SECONDARY }} />
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--mkt-surface-muted)] px-1.5 py-px text-[10px] font-medium text-[var(--mkt-text-muted)]">Auto</span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
                </button>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[11px] text-[var(--mkt-text-muted)] sm:inline">
                    {canBuild ? "Press Enter ↵" : !nameOk ? "Add a business name" : "Describe your website"}
                  </span>
                  <button
                    type="submit"
                    disabled={!canBuild}
                    aria-label="Build my website"
                    className="inline-flex h-11 items-center gap-2 rounded-full mkt-brand-grad px-5 text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(47,91,255,0.6)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    <Wand2 className="h-4 w-4" /> Generate website
                  </button>
                </div>
              </div>
            </div>
          </form>
          <LegalConsent
            className="mt-3 text-center"
            lead="Your prompt is sent to our AI provider to generate the site. By continuing you agree to our"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs text-[var(--mkt-text-muted)]">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setPrompt(ex.prompt);
                  setCompanyName(ex.name);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  prompt === ex.prompt
                    ? "border-[var(--mkt-accent-2)]/50 bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)]"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] text-[var(--mkt-text-secondary)] hover:border-[var(--mkt-border-strong)] hover:text-[var(--mkt-text)]"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <ol className="mt-14 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Layers, t: "Full multi-page site", d: "Pages, sections and real copy for your business" },
              { icon: LayoutDashboard, t: "Admin panel included", d: "Edit pages, leads, gallery and SEO yourself" },
              { icon: MessageSquare, t: "Chat to change", d: "“Add pricing”, “make it teal” — done in seconds" },
            ].map((f, i) => (
              <li key={f.t} className="rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] p-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)]">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--mkt-text-muted)]">0{i + 1}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--mkt-text)]">{f.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--mkt-text-muted)]">{f.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // ─── Step 2: choose a design (same five styles as the live demos) ──────────
  if (step === "design") {
    const chosen = designCards.find((d) => d.id === look) ?? designCards[0];
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex items-center gap-3 text-xs font-medium">
          <button type="button" onClick={() => setStep("prompt")} className={`${mkt.muted} hover:text-[var(--mkt-text)]`}>
            ← Edit prompt
          </button>
          <span className={mkt.muted}>/</span>
          <span className="rounded-full bg-[var(--mkt-accent-soft)] px-2.5 py-0.5 text-[var(--mkt-accent-text)]">Step 2 of 2 · Design</span>
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-[var(--mkt-text)] sm:text-3xl">Pick a look for {companyName.trim() || "your website"}</h1>
            <p className={`mt-2 text-sm ${mkt.muted}`}>Same content, different personality. You can switch anytime after it&apos;s built.</p>
          </div>
          <button
            type="button"
            onClick={build}
            className="inline-flex shrink-0 items-center gap-2 rounded-full mkt-brand-grad px-6 py-3 text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(47,91,255,0.6)] transition hover:brightness-110"
          >
            <Wand2 className="h-4 w-4" /> Build in {chosen.name}
          </button>
        </div>
        <div className="mt-8">
          <DesignPicker
            designs={designCards}
            value={look}
            onChange={(id) => {
              lookRef.current = id as LookId;
              setLook(id as LookId);
            }}
            layout="page"
            label=""
            hint="Shown in your brand colours."
          />
        </div>
      </section>
    );
  }

  // ─── Workspace: top bar · left panel (chat / design) · preview canvas ──────
  // Fixed to the viewport on desktop so the page never scrolls; each panel scrolls
  // inside itself (overscroll-contain stops wheel scroll leaking to the page).
  const ready = step === "ready";
  const lookName = DESIGNS.find((d) => d.id === look)?.name ?? "Original";
  return (
    <section className="flex flex-col bg-[var(--mkt-bg-alt)] lg:h-[calc(100dvh/var(--mkt-zoom,1)-4rem)] lg:overflow-hidden">
      {/* Top bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: primaryColor || THUMB_PRIMARY }}>
            {(companyName || "W").trim().slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--mkt-text)]">{companyName || "Your website"}</p>
            <p className={`flex items-center gap-1.5 text-[11px] ${mkt.muted}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
              {ready ? `${pageNames.length} pages · ${lookName} design` : "Building your website…"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={reset} disabled={pending} title="Start a new website" className={`hidden h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium sm:inline-flex ${mkt.muted} hover:bg-[var(--mkt-surface-muted)] hover:text-[var(--mkt-text)] disabled:opacity-50`}>
            <RotateCcw className="h-3.5 w-3.5" /> New
          </button>
          {ready && (
            <>
              <button type="button" disabled={pending} onClick={() => openLive("site")} className={`${mkt.btnSecondary} h-9 px-3 text-xs disabled:opacity-50`}>
                <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden md:inline">Open site</span>
              </button>
              <button type="button" disabled={pending} onClick={() => openLive("admin")} className={`${mkt.btnSecondary} h-9 px-3 text-xs disabled:opacity-50`}>
                <LayoutDashboard className="h-3.5 w-3.5" /> <span className="hidden md:inline">Open admin</span>
              </button>
              {previewLogin && (
                // ponytail: native <details> as the popover — no state, closes on re-click
                <details className="relative">
                  <summary
                    title="Admin login details"
                    className={`${mkt.btnSecondary} h-9 w-9 cursor-pointer list-none p-0 [&::-webkit-details-marker]:hidden`}
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </summary>
                  <div className={`${mkt.card} absolute right-0 top-11 z-50 w-72 p-3 text-xs shadow-xl`}>
                    <p className="font-semibold text-[var(--mkt-text)]">Admin login (if asked)</p>
                    {([["Email", previewLogin.email], ["Password", previewLogin.password]] as const).map(([k, v]) => (
                      <div key={k} className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[var(--mkt-surface-muted)] px-2.5 py-1.5">
                        <span className="min-w-0">
                          <span className={`block text-[10px] ${mkt.muted}`}>{k}</span>
                          <span className="block truncate font-mono text-[var(--mkt-text)]">{v}</span>
                        </span>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(v)} aria-label={`Copy ${k}`} className={`shrink-0 rounded p-1 ${mkt.muted} hover:text-[var(--mkt-text)]`}>
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              <Link
                href="/subscribe?from=ai"
                onClick={() => blueprint && persist(blueprint, prompt.trim())}
                className="inline-flex h-9 items-center gap-1.5 rounded-full mkt-brand-grad px-4 text-xs font-semibold shadow-[0_6px_20px_-6px_rgba(47,91,255,0.6)] transition hover:brightness-110"
              >
                Buy this website <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[400px_1fr] lg:grid-rows-[minmax(0,1fr)]">
        {/* Left panel: chat / design */}
        <div className={`${mkt.card} flex min-h-[70vh] flex-col overflow-hidden lg:min-h-0`}>
          <div className="flex shrink-0 gap-1 border-b border-[var(--mkt-border)] p-1.5">
            {([["chat", MessageSquare, "Chat"], ["design", Palette, "Design & brand"]] as const).map(([v, Icon, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setLeftTab(v)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                  leftTab === v ? "bg-[var(--mkt-surface-muted)] text-[var(--mkt-text)]" : "text-[var(--mkt-text-muted)] hover:text-[var(--mkt-text)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          {leftTab === "chat" ? (
            <>
              <div ref={threadBox} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5">
                {thread.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end gap-2">
                      <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-[var(--mkt-text)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--mkt-bg)]">{m.text}</p>
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-secondary)] ring-1 ring-[var(--mkt-border)]">
                        <User className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2.5">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full mkt-brand-grad">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 max-w-[88%]">
                        <p className="text-[11px] font-semibold text-[var(--mkt-text-muted)]">AI builder</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--mkt-text-secondary)]">{m.text}</p>
                        {i === 1 && blueprint && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {pageNames.map((n) => (
                              <span key={n} className="inline-flex items-center gap-1 rounded-md border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-2 py-0.5 text-[11px] text-[var(--mkt-text-secondary)]">
                                <Check className="h-3 w-3 text-emerald-500" /> {n}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
                {(pending || step === "building") && (
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full mkt-brand-grad">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span className={`inline-flex items-center gap-2 text-sm ${mkt.muted}`}>
                      <BrandSpinner className="h-4 w-4" /> {step === "building" ? "Building your website — follow the progress on the right" : "Working on it…"}
                    </span>
                  </div>
                )}
              </div>

              {ready && (
                <div className="shrink-0 space-y-2.5 border-t border-[var(--mkt-border)] p-3">
                  {ideas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {ideas.map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          disabled={pending || !!updating}
                          onClick={() => refine(idea)}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-2.5 py-1 text-[11px] text-[var(--mkt-text-secondary)] transition hover:border-[var(--mkt-accent-2)]/50 hover:text-[var(--mkt-text)] disabled:opacity-50"
                        >
                          <Sparkles className="h-3 w-3 text-[var(--mkt-accent-2)]" /> {idea}
                        </button>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      refine();
                    }}
                    className="rounded-2xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-2 shadow-sm transition focus-within:border-[var(--mkt-accent-2)]/60 focus-within:ring-4 focus-within:ring-[var(--mkt-accent-2)]/10"
                  >
                    <textarea
                      value={refinePrompt}
                      onChange={(e) => setRefinePrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          refine();
                        }
                      }}
                      rows={2}
                      placeholder="Ask for a change… “make it blue”, “add an FAQ”"
                      aria-label="Ask AI for a change"
                      className="w-full resize-none bg-transparent px-2 py-1.5 text-sm text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
                    />
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-[11px] ${mkt.muted}`}>Enter to send · Shift+Enter for new line</span>
                      <button
                        type="submit"
                        disabled={pending || !!updating || refinePrompt.trim().length < 3}
                        aria-label="Send change"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mkt-text)] text-[var(--mkt-bg)] transition hover:opacity-90 disabled:bg-[var(--mkt-border-strong)] disabled:text-[var(--mkt-text-muted)]"
                      >
                        {pending || updating ? <BrandSpinner className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </form>
                  {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
                </div>
              )}
            </>
          ) : (
            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--mkt-text-muted)]">Design style</p>
                <p className={`mt-1 text-xs ${mkt.muted}`}>Same content — switch the whole look in one click.</p>
                <div className="mt-3">
                  <DesignPicker designs={designCards} value={look} onChange={(id) => pickLook(id as LookId)} layout="drawer" label="" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--mkt-text-muted)]">Brand</p>
                <p className={`mt-1 text-xs ${mkt.muted}`}>Your colours, logo and hero photo — applied everywhere.</p>
                <div className="mt-3">{brandKit}</div>
              </div>
            </div>
          )}
        </div>

        {/* Preview canvas */}
        <div className={`${mkt.card} flex min-h-[80vh] flex-col overflow-hidden lg:min-h-0`}>
          <div className="mkt-canvas flex min-h-[75vh] flex-1 flex-col overflow-hidden lg:min-h-0 [&>*]:min-h-0 [&>*]:flex-1">
            {step === "building" && (
              <AiBuildAnimation
                siteName={companyName || blueprint?.website.name}
                pageNames={pageNames}
                done={buildDone}
                accent={primaryColor || THUMB_PRIMARY}
                onFinished={finishBuild}
              />
            )}
            {ready && previewBlueprint && (
              <div className="relative flex min-h-0 flex-1 flex-col">
                <div key={refreshKey} className={`flex min-h-0 flex-1 flex-col ${refreshKey ? "ai-refreshed" : ""}`}>
                  <AiInlinePreview key={focusSlug ?? "home"} blueprint={previewBlueprint} initialSlug={focusSlug} />
                </div>
                {updating && <AiUpdateOverlay request={updating.request} done={updating.done} onFinished={finishUpdate} />}
                {justUpdated && (
                  <span className="ai-toast pointer-events-none absolute left-1/2 top-14 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> Website updated
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
