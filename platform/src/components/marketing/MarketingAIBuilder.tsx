"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles, Loader2, LayoutDashboard, Globe, ArrowRight, ArrowUp, ExternalLink, ImagePlus,
  Palette, ChevronDown, RotateCcw, Bot, User, Check,
} from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { saveAiDraft } from "@/lib/ai/promptStorage";
import { applyBrandToBlueprint } from "@/lib/ai/applyBrand";
import { mkt } from "@/lib/marketingTheme";
import { AiBuildAnimation } from "./AiBuildAnimation";
import { AiInlinePreview } from "./AiInlinePreview";
import { AiAdminPreview } from "./AiAdminPreview";

const EXAMPLES = [
  { label: "NGO", name: "GULAB NGO", prompt: "Create an NGO website for child education named GULAB NGO — programs, impact, donate, volunteer, gallery and contact." },
  { label: "Marketing agency", name: "Nova Digital", prompt: "Create a premium digital marketing agency website with services, portfolio, pricing and contact." },
  { label: "Restaurant", name: "Royal Spice", prompt: "Modern restaurant website called Royal Spice — menu, gallery and reservation." },
  { label: "Gym", name: "IronPulse Fitness", prompt: "High-energy gym website with programs, membership plans, trainers, class schedule and free trial booking." },
  { label: "Clinic", name: "CityCare Clinic", prompt: "Multi-speciality clinic website with departments, doctors, health packages and appointment booking." },
];

const REFINE_IDEAS = ["Add a testimonials section", "Make the hero headline shorter", "Add a pricing page", "Add an FAQ about delivery"];

type Step = "prompt" | "building" | "ready";
type RightView = "site" | "admin";
type Msg = { role: "user" | "ai"; text: string };

const DEFAULT_PRIMARY = "#7cb518";
const DEFAULT_SECONDARY = "#0f2942";

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
  const threadEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length]);

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

  const plan = () => {
    if (!canBuild) return;
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
        const bp = applyBrandToBlueprint(data.blueprint as WebsiteBlueprint, brand());
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
      const bp = applyBrandToBlueprint(data.blueprint as WebsiteBlueprint, brand());
      setBlueprint(bp);
      persist(bp, `${prompt.trim()}\n\nChange: ${text}`);
      setRightView("site");
      setThread((t) => [...t, { role: "ai", text: "Done — the preview is updated. Anything else?" }]);
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
  };

  const pageNames = blueprint?.pages.map((p) => p.name) ?? [];

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
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-2.5 py-1.5 hover:border-lime-500/60 transition">
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

  // ─── Start screen: ChatGPT-style centred composer ──────────────────────────
  if (step === "prompt") {
    return (
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 mkt-hero-wash opacity-80" aria-hidden />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center px-4 py-14 sm:px-6">
          <div className="text-center">
            <span className={mkt.badge}>
              <Sparkles className="w-3.5 h-3.5" /> AI Website Builder
            </span>
            <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--mkt-text)]">
              What should we build <span className="text-[var(--mkt-accent-text)]">today?</span>
            </h1>
            <p className={`mx-auto mt-4 max-w-xl text-[15px] leading-relaxed ${mkt.muted}`}>
              Describe your business in plain words. AI plans the pages, writes the content and shows a live preview — then refine it by chatting.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              plan();
            }}
            className="mt-9 rounded-3xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-3 shadow-xl shadow-slate-900/10 focus-within:border-lime-500/60 focus-within:ring-4 focus-within:ring-lime-500/10 transition"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] px-3 py-1.5 text-xs font-semibold text-[var(--mkt-text-secondary)] hover:border-lime-500/50 hover:text-[var(--mkt-text)] transition"
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
                  {canBuild ? "Enter to build · Shift+Enter for new line" : !nameOk ? "Add a business name" : "Describe your website"}
                </span>
                <button
                  type="submit"
                  disabled={!canBuild}
                  aria-label="Build my website"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500 text-slate-950 shadow-md shadow-lime-600/30 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:bg-[var(--mkt-border-strong)] disabled:text-[var(--mkt-text-muted)] disabled:shadow-none"
                >
                  <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                title={ex.prompt}
                onClick={() => {
                  setPrompt(ex.prompt);
                  setCompanyName(ex.name);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  prompt === ex.prompt
                    ? "border-lime-500 bg-lime-500/10 text-[var(--mkt-text)]"
                    : "border-[var(--mkt-border)] bg-[var(--mkt-surface)] text-[var(--mkt-text-secondary)] hover:border-lime-500/50 hover:text-[var(--mkt-text)]"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <ul className={`mt-10 grid gap-3 text-sm sm:grid-cols-3 ${mkt.muted}`}>
            {["Full multi-page website", "Live preview + admin panel", "Refine by chatting"].map((t) => (
              <li key={t} className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-lime-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // ─── Workspace: chat thread on the left, live preview on the right ─────────
  return (
    <section className="mx-auto grid max-w-[1500px] gap-4 px-3 py-4 sm:px-5 lg:h-[calc(100vh-4rem)] lg:grid-cols-[400px_1fr]">
      <div className={`${mkt.card} flex min-h-0 flex-col overflow-hidden`}>
        <div className="flex items-center justify-between gap-2 border-b border-[var(--mkt-border)] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: primaryColor }}>
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--mkt-text)]">{companyName || "Your website"}</p>
              <p className={`text-[11px] ${mkt.muted}`}>{step === "building" ? "Building…" : `${pageNames.length} pages · draft`}</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={pending} className={`inline-flex items-center gap-1 text-xs font-medium ${mkt.muted} hover:text-[var(--mkt-text)] disabled:opacity-50`}>
            <RotateCcw className="h-3.5 w-3.5" /> New
          </button>
        </div>

        <div className="min-h-[240px] flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {thread.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-secondary)]" : "bg-lime-500 text-slate-950"
                }`}
              >
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </span>
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-lime-500/12 text-[var(--mkt-text)]"
                    : "rounded-tl-sm border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] text-[var(--mkt-text-secondary)]"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {pending && (
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-500 text-slate-950">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <span className={`inline-flex items-center gap-2 text-sm ${mkt.muted}`}>
                <Loader2 className="h-4 w-4 animate-spin" /> {step === "building" ? "Planning pages & writing content…" : "Working on it…"}
              </span>
            </div>
          )}
          <div ref={threadEnd} />
        </div>

        {step === "ready" && (
          <div className="space-y-3 border-t border-[var(--mkt-border)] p-3">
            <div className="flex flex-wrap gap-1.5">
              {REFINE_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  disabled={pending}
                  onClick={() => refine(idea)}
                  className="rounded-full border border-[var(--mkt-border)] px-2.5 py-1 text-[11px] text-[var(--mkt-text-secondary)] hover:border-lime-500/50 hover:text-[var(--mkt-text)] disabled:opacity-50 transition"
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
              className="flex items-end gap-2 rounded-2xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] p-2 focus-within:border-lime-500/60 transition"
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
                placeholder="Ask for a change…"
                aria-label="Ask AI for a change"
                className="min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none"
              />
              <button
                type="submit"
                disabled={pending || refinePrompt.trim().length < 3}
                aria-label="Send change"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-500 text-slate-950 transition hover:bg-lime-400 disabled:bg-[var(--mkt-border-strong)] disabled:text-[var(--mkt-text-muted)]"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
              </button>
            </form>

            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-[var(--mkt-text-secondary)] [&::-webkit-details-marker]:hidden">
                <Palette className="h-3.5 w-3.5" /> Brand kit
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2">{brandKit}</div>
            </details>

            {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={pending} onClick={() => openLive("site")} className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} disabled:opacity-50`}>
                <ExternalLink className="h-4 w-4" /> Open website
              </button>
              <button type="button" disabled={pending} onClick={() => openLive("admin")} className={`${mkt.btnSecondary} ${mkt.btnPrimarySm} disabled:opacity-50`}>
                <LayoutDashboard className="h-4 w-4" /> Open admin
              </button>
            </div>
            {previewLogin && (
              <div className="rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-3 py-2 text-[11px]">
                <span className="font-semibold text-[var(--mkt-text)]">Admin login (if asked): </span>
                <span className="font-mono break-all">{previewLogin.email}</span> / <span className="font-mono">{previewLogin.password}</span>
              </div>
            )}
            <Link
              href="/subscribe?from=ai"
              onClick={() => blueprint && persist(blueprint, prompt.trim())}
              className={`${mkt.btnPrimary} w-full py-2.5`}
            >
              Buy this website <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <div className={`${mkt.card} flex min-h-[560px] flex-col overflow-hidden`}>
        <div className="flex items-center justify-between gap-2 border-b border-[var(--mkt-border)] px-3 py-2">
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
          <span className={`text-[11px] ${mkt.muted}`}>Live preview</span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-[var(--mkt-surface-muted)]">
          {step === "building" && (
            <AiBuildAnimation siteName={companyName || blueprint?.website.name} pageNames={pageNames} done={buildDone} />
          )}
          {step === "ready" && blueprint && rightView === "site" && <AiInlinePreview blueprint={blueprint} />}
          {step === "ready" && blueprint && rightView === "admin" && <AiAdminPreview blueprint={blueprint} />}
        </div>
      </div>
    </section>
  );
}
