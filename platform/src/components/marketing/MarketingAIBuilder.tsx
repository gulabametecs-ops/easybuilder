"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles, Loader2, LayoutDashboard, Globe, ArrowRight, ArrowUp, ExternalLink, ImagePlus,
  Palette, ChevronDown, RotateCcw, Bot, User, Check,
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
import { AiBuildAnimation } from "./AiBuildAnimation";
import { AiInlinePreview } from "./AiInlinePreview";
import { AiAdminPreview } from "./AiAdminPreview";
import { DesignPicker } from "./DesignPicker";

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
type RightView = "site" | "admin";
type Msg = { role: "user" | "ai"; text: string };

const DEFAULT_PRIMARY = "#171717";
const DEFAULT_SECONDARY = "#b45309";

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
  const [rightView, setRightView] = useState<RightView>("site");
  const [previewKey, setPreviewKey] = useState("");
  const [previewLogin, setPreviewLogin] = useState<{ email: string; password: string } | null>(null);
  const [brandOpen, setBrandOpen] = useState(false);
  const [thread, setThread] = useState<Msg[]>([]);
  const [look, setLook] = useState<LookId>("classic");
  const [focusSlug, setFocusSlug] = useState<string | undefined>(undefined);
  const lookRef = useRef<LookId>("classic");
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

  // scrollIntoView would also scroll the page; scroll just the chat panel.
  useEffect(() => {
    const el = threadBox.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thread.length, pending]);

  const persist = (bp: WebsiteBlueprint, p: string) => saveAiDraft(p, bp);

  const brand = () => ({
    companyName: companyName.trim(),
    primaryColor,
    secondaryColor,
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
    setRightView("site");
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
        setBlueprint(bp);
        persist(bp, prompt.trim());
        setBuildDone(true);
        setThread((t) => [...t, { role: "ai", text: summarize(bp) }]);
        setTimeout(() => setStep("ready"), 800);
      } catch {
        setError("Something went wrong. Please try again.");
        setStep("prompt");
      }
    });
  };

  const refine = (override?: string) => {
    const text = (override ?? refinePrompt).trim();
    if (!blueprint || text.length < 3 || pending) return;
    setError("");
    setThread((t) => [...t, { role: "user", text }]);
    setRefinePrompt("");

    // Colour-only requests: apply instantly on the client, no AI call.
    const colour = detectColorIntent(text, primaryColor);
    if (colour) {
      setPrimaryColor(colour.primary);
      setSecondaryColor(colour.secondary);
      const bp = withLook(
        applyBrandToBlueprint(blueprint, { ...brand(), primaryColor: colour.primary, secondaryColor: colour.secondary }),
        lookRef.current,
      );
      setBlueprint(bp);
      persist(bp, `${prompt.trim()}\n\nChange: ${text}`);
      setRightView("site");
      setThread((t) => [...t, { role: "ai", text: `Done — switched to a ${colour.name} colour theme. Say another colour anytime (e.g. “make it teal”).` }]);
      return;
    }

    const before = blueprint;
    start(async () => {
      const res = await fetch("/api/ai/website/public-modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, prompt: text }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : { error: "Network error — check your internet and try again." };
      if (!data.success) {
        const msg = data.error || "Could not apply changes.";
        setError(msg);
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
      setBlueprint(bp);
      persist(bp, `${prompt.trim()}\n\nChange: ${text}`);
      setRightView("site");
      const change = describeChange(before, bp);
      if (change.focus) setFocusSlug(change.focus);
      setThread((t) => [...t, { role: "ai", text: change.text }]);
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
      primary: primaryColor, primaryDark: primaryColor, secondary: secondaryColor, accent: primaryColor,
      dark: secondaryColor, light: "#f8fafc", text: "#475569", heading: secondaryColor,
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

  const lookPicker = (
    <DesignPicker
      designs={designCards}
      value={look}
      onChange={(id) => pickLook(id as LookId)}
      layout="bar"
      label="Design style"
    />
  );

  // ─── Start screen: studio composer ─────────────────────────────────────────
  if (step === "prompt") {
    return (
      <section className="relative isolate overflow-hidden bg-[var(--mkt-bg)]">
        <div className="absolute inset-0 -z-10 mkt-hero-wash" aria-hidden />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center px-4 py-14 sm:px-6">
          <div className="text-center">
            <span className={mkt.badge}>
              <Sparkles className="w-3.5 h-3.5" /> AI website builder
            </span>
            <h1 className="font-display mt-5 text-[clamp(2.1rem,4.8vw,3.25rem)] leading-[1.12] text-[var(--mkt-text)]">
              Describe the business. Get a full website.
            </h1>
            <p className={`mx-auto mt-4 max-w-xl text-[15px] leading-relaxed ${mkt.muted}`}>
              Name, pages, services and tone from one prompt. Then chat to tweak headlines, colours and sections.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              plan();
            }}
            className={`mt-10 ${mkt.card} p-3 sm:p-4`}
          >
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Business name — e.g. GULAB NGO"
                aria-label="Business name"
                className="w-full rounded-xl bg-transparent px-3 py-2 text-sm font-semibold text-[var(--mkt-text)] placeholder:font-normal placeholder:text-[var(--mkt-text-muted)] outline-none"
              />
              <div className="mx-3 border-t border-[var(--mkt-border)]" />
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
                placeholder="Describe your website… e.g. A play school in Pune with programs, daily routine, fees, gallery and an admission enquiry form."
                aria-label="Describe your website"
                className="w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-relaxed text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
              />
              {brandOpen && <div className="px-2 pb-3">{brandKit}</div>}
              <div className="flex items-center justify-between gap-2 px-1">
                <button
                  type="button"
                  onClick={() => setBrandOpen((v) => !v)}
                  aria-expanded={brandOpen}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] px-3 py-1.5 text-xs font-semibold text-[var(--mkt-text-secondary)] hover:border-[var(--mkt-accent)]/50 hover:text-[var(--mkt-text)] transition"
                >
                  <Palette className="h-3.5 w-3.5" />
                  Brand kit
                  <span className="flex -space-x-1">
                    <span className="h-3.5 w-3.5 rounded-full ring-2 ring-[var(--mkt-surface)]" style={{ background: primaryColor }} />
                    <span className="h-3.5 w-3.5 rounded-full ring-2 ring-[var(--mkt-surface)]" style={{ background: secondaryColor }} />
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
                </button>
                <div className="flex items-center gap-3">
                  <span className={`hidden text-[11px] sm:inline ${mkt.muted}`}>
                    {canBuild ? "Enter to continue" : !nameOk ? "Add a business name" : "Describe your website"}
                  </span>
                  <button
                    type="submit"
                    disabled={!canBuild}
                    aria-label="Build my website"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--mkt-accent)] px-4 text-sm font-semibold text-[var(--mkt-accent-on)] shadow-md shadow-[var(--mkt-accent)]/30 transition hover:bg-[var(--mkt-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--mkt-border-strong)] disabled:text-[var(--mkt-text-muted)] disabled:shadow-none"
                  >
                    Continue <ArrowUp className="h-4 w-4 rotate-90" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
          </form>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <p className={`mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.16em] ${mkt.muted}`}>Try a starting point</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setPrompt(ex.prompt);
                  setCompanyName(ex.name);
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  prompt === ex.prompt
                    ? "border-[var(--mkt-accent)] bg-[var(--mkt-accent-soft)]"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)]/80 hover:border-[var(--mkt-accent)]/45"
                }`}
              >
                <span className="block text-sm font-semibold text-[var(--mkt-text)]">{ex.label}</span>
                <span className={`mt-0.5 line-clamp-1 block text-xs ${mkt.muted}`}>{ex.name}</span>
              </button>
            ))}
          </div>

          <ul className={`mt-8 grid gap-3 text-sm sm:grid-cols-3 ${mkt.muted}`}>
            {["Multi-page draft", "Live preview + admin", "Chat to refine"].map((t) => (
              <li key={t} className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-[var(--mkt-accent)]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // ─── Step 2: choose a design (same five styles as the live demos) ──────────
  if (step === "design") {
    const chosen = designCards.find((d) => d.id === look) ?? designCards[0];
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button type="button" onClick={() => setStep("prompt")} className={`text-sm font-medium ${mkt.muted} hover:text-[var(--mkt-text)]`}>
          ← Edit prompt
        </button>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--mkt-text)] sm:text-3xl">
            Choose a design for {companyName.trim() || "your website"}
          </h1>
          <button type="button" onClick={build} className={`${mkt.btnPrimary} ${mkt.btnPrimaryLg} shrink-0`}>
            <Sparkles className="h-4 w-4" /> Build in {chosen.name}
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
            hint="Same content in your brand colours. You can change this later."
          />
        </div>
      </section>
    );
  }

  // ─── Workspace: chat thread on the left, live preview on the right ─────────
  // Fixed to the viewport on desktop so the page never scrolls; each panel scrolls
  // inside itself (overscroll-contain stops wheel scroll leaking to the page).
  return (
    <section className="mx-auto grid max-w-[1500px] gap-4 px-3 py-3 sm:px-5 lg:h-[calc(100dvh-4rem)] lg:grid-cols-[380px_1fr] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
      <div className={`${mkt.card} flex min-h-[70vh] flex-col overflow-hidden lg:min-h-0`}>
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--mkt-border)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: primaryColor }}>
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--mkt-text)]">{companyName || "Your website"}</p>
              <p className={`text-[11px] ${mkt.muted}`}>{step === "building" ? "Building…" : `${pageNames.length} pages · ${DESIGNS.find((d) => d.id === look)?.name ?? "Original"} design`}</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={pending} className={`inline-flex items-center gap-1 text-xs font-medium ${mkt.muted} hover:text-[var(--mkt-text)] disabled:opacity-50`}>
            <RotateCcw className="h-3.5 w-3.5" /> New
          </button>
        </div>

        <div ref={threadBox} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
          {thread.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-secondary)]" : "bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)]"
                }`}
              >
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </span>
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-[var(--mkt-accent-soft)] text-[var(--mkt-text)]"
                    : "rounded-tl-sm border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-secondary)]"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {pending && (
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)]">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <span className={`inline-flex items-center gap-2 text-sm ${mkt.muted}`}>
                <Loader2 className="h-4 w-4 animate-spin" /> {step === "building" ? "Planning pages & writing content…" : "Working on it…"}
              </span>
            </div>
          )}
        </div>

        {step === "ready" && (
          <div className="shrink-0 space-y-2.5 border-t border-[var(--mkt-border)] p-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {ideas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  disabled={pending}
                  onClick={() => refine(idea)}
                  className="shrink-0 rounded-full border border-[var(--mkt-border)] px-2.5 py-1 text-[11px] text-[var(--mkt-text-secondary)] hover:border-[var(--mkt-accent)]/50 hover:text-[var(--mkt-text)] disabled:opacity-50 transition"
                >
                  {idea}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                refine();
              }}
              className="flex items-end gap-2 rounded-2xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-2 focus-within:border-[var(--mkt-accent)]/60 transition"
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
                placeholder="Ask for a change… e.g. “make it blue”, “add an FAQ section”"
                aria-label="Ask AI for a change"
                className="min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
              />
              <button
                type="submit"
                disabled={pending || refinePrompt.trim().length < 3}
                aria-label="Send change"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)] transition hover:bg-[var(--mkt-accent-hover)] disabled:bg-[var(--mkt-border-strong)] disabled:text-[var(--mkt-text-muted)]"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
              </button>
            </form>
            {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-[var(--mkt-text-secondary)] [&::-webkit-details-marker]:hidden">
                <Palette className="h-3.5 w-3.5" /> Brand kit — colours, logo, hero image
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2">{brandKit}</div>
            </details>
          </div>
        )}
      </div>

      <div className={`${mkt.card} flex min-h-[80vh] flex-col overflow-hidden lg:min-h-0`}>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--mkt-border)] px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="inline-flex rounded-lg bg-[var(--mkt-surface-muted)] p-1">
              {([["site", Globe, "Website"], ["admin", LayoutDashboard, "Admin"]] as const).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  disabled={step !== "ready"}
                  onClick={() => setRightView(v)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                    rightView === v ? "bg-[var(--mkt-surface)] text-[var(--mkt-text)] shadow-sm" : "text-[var(--mkt-text-muted)] hover:text-[var(--mkt-text)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
            {step === "ready" && <div className="hidden min-w-0 border-l border-[var(--mkt-border)] pl-3 xl:block">{lookPicker}</div>}
          </div>
          {step === "ready" && (
            <div className="flex items-center gap-1.5">
              <button type="button" disabled={pending} onClick={() => openLive("site")} className={`${mkt.btnSecondary} px-3 py-1.5 text-xs disabled:opacity-50`}>
                <ExternalLink className="h-3.5 w-3.5" /> Open site
              </button>
              <button type="button" disabled={pending} onClick={() => openLive("admin")} className={`${mkt.btnSecondary} px-3 py-1.5 text-xs disabled:opacity-50`}>
                <LayoutDashboard className="h-3.5 w-3.5" /> Open admin
              </button>
              <Link
                href="/subscribe?from=ai"
                onClick={() => blueprint && persist(blueprint, prompt.trim())}
                className={`${mkt.btnPrimary} px-3.5 py-1.5 text-xs`}
              >
                Buy this website <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
        {step === "ready" && <div className="shrink-0 border-b border-[var(--mkt-border)] px-3 py-1.5 xl:hidden">{lookPicker}</div>}
        {previewLogin && (
          <div className="shrink-0 border-b border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-3 py-1.5 text-[11px]">
            <span className="font-semibold text-[var(--mkt-text)]">Admin login (if asked): </span>
            <span className="font-mono break-all">{previewLogin.email}</span> / <span className="font-mono">{previewLogin.password}</span>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[var(--mkt-surface-muted)]">
          {step === "building" && (
            <AiBuildAnimation siteName={companyName || blueprint?.website.name} pageNames={pageNames} done={buildDone} />
          )}
          {step === "ready" && previewBlueprint && rightView === "site" && <AiInlinePreview key={focusSlug ?? "home"} blueprint={previewBlueprint} initialSlug={focusSlug} />}
          {step === "ready" && blueprint && rightView === "admin" && <AiAdminPreview blueprint={blueprint} />}
        </div>
      </div>
    </section>
  );
}
