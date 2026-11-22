"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requestDemoOtp, verifyDemoOtp, switchDemo, type DemoFlowState } from "@/lib/actions/demos";
import { Lock, ExternalLink, LayoutDashboard, Clock, Copy, Check, ArrowLeftRight } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";
import { LegalConsent } from "./LegalConsent";
import { BrandSpinner } from "@/components/BrandLogo";

const initial: DemoFlowState = { step: "idle" };

type Vertical = {
  id: string;
  name: string;
};

type ActiveInfo = {
  siteUrl: string;
  adminUrl: string;
  expiresAt: string;
  minutesLeft: number;
  adminUsername?: string;
  adminPassword?: string;
};

type DesignRef = { id: string; name: string };

export function previewUrl(siteUrl: string, designId: string) {
  try {
    const u = new URL(siteUrl);
    if (u.pathname.includes("/api/demo/establish")) {
      const to = u.searchParams.get("to") || "/";
      const dest = new URL(to, u.origin);
      dest.searchParams.set("design", designId);
      u.searchParams.set("to", `${dest.pathname}${dest.search}`);
      return u.toString();
    }
    u.searchParams.set("design", designId);
    return u.toString();
  } catch {
    return `${siteUrl}${siteUrl.includes("?") ? "&" : "?"}design=${designId}`;
  }
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[var(--mkt-text-secondary)]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function DemoVerticalPanel({
  vertical,
  active,
  defaultOpen = false,
  blocked = false,
  blockedVerticalName,
  blockedVerticalId,
  designs = [],
  design,
  onShowActive,
  onActivated,
}: {
  vertical: Vertical;
  active?: ActiveInfo;
  defaultOpen?: boolean;
  blocked?: boolean;
  blockedVerticalName?: string;
  blockedVerticalId?: string;
  designs?: DesignRef[];
  /** Selected design id — default target of the main preview button. */
  design?: string;
  onShowActive?: (verticalId: string) => void;
  onActivated?: (info: ActiveInfo) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState<"user" | "pass" | null>(null);
  const [requestState, requestAction, requestPending] = useActionState(requestDemoOtp, initial);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyDemoOtp, initial);
  const [switchState, switchAction, switchPending] = useActionState(switchDemo, initial);
  const router = useRouter();
  // After a switch, re-read server state so the "running" banner/badges follow the new sector.
  useEffect(() => {
    if (switchState.step !== "active") return;
    onActivated?.({
      siteUrl: switchState.siteUrl,
      adminUrl: switchState.adminUrl,
      expiresAt: switchState.expiresAt,
      minutesLeft: switchState.minutesLeft,
      adminUsername: switchState.adminUsername,
      adminPassword: switchState.adminPassword,
    });
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchState.step]);

  useEffect(() => {
    if (verifyState.step !== "active") return;
    onActivated?.({
      siteUrl: verifyState.siteUrl,
      adminUrl: verifyState.adminUrl,
      expiresAt: verifyState.expiresAt,
      minutesLeft: verifyState.minutesLeft,
      adminUsername: verifyState.adminUsername,
      adminPassword: verifyState.adminPassword,
    });
    router.refresh();
    // Parent swaps to the full-screen stage; don't retrigger if it stays mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyState.step]);

  const flow = verifyState.step !== "idle" && verifyState.step !== "error" ? verifyState : requestState;

  const justStarted = verifyState.step === "active" ? verifyState : switchState.step === "active" ? switchState : null;
  const liveFromVerify = justStarted
    ? {
        siteUrl: justStarted.siteUrl,
        adminUrl: justStarted.adminUrl,
        expiresAt: justStarted.expiresAt,
        minutesLeft: justStarted.minutesLeft,
        adminUsername: justStarted.adminUsername,
        adminPassword: justStarted.adminPassword,
      }
    : null;

  const live = liveFromVerify ?? active ?? null;

  async function copyText(kind: "user" | "pass", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  if (live) {
    const creds = liveFromVerify ?? (active?.adminUsername ? active : null);
    const current = designs.find((d) => d.id === design) ?? designs[0];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--mkt-accent)]/30 bg-[var(--mkt-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--mkt-accent-text)]">
          <Clock className="w-4 h-4 shrink-0" />
          Demo active · ~{live.minutesLeft} min left
        </div>

        {creds?.adminUsername && creds.adminPassword && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-3 text-xs text-amber-950 dark:text-amber-100 space-y-2">
            <p className="font-semibold">Temporary admin login</p>
            {(
              [
                ["user", "User", creds.adminUsername],
                ["pass", "Pass", creds.adminPassword],
              ] as const
            ).map(([kind, label, value]) => (
              <div key={kind} className="flex items-center justify-between gap-2">
                <span>
                  {label}: <span className="font-mono font-bold">{value}</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyText(kind, value)}
                  className="p-1 rounded hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`Copy ${kind === "user" ? "username" : "password"}`}
                >
                  {copied === kind ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
            <p className="text-[11px] opacity-80">Also shown on the admin login page after you open admin.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {current && (
            <a
              href={previewUrl(live.siteUrl, current.id)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mkt.btnPrimary} px-4 py-2.5 text-sm`}
            >
              Preview {current.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={live.adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${mkt.btnSecondary} px-4 py-2.5 text-sm font-semibold`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Open admin
          </a>
        </div>

        {designs.length > 1 && (
          <p className={`text-xs ${mkt.muted}`}>
            Preview uses the design you picked above. Switch the cards, then open preview again.
          </p>
        )}
      </div>
    );
  }

  if (blocked && blockedVerticalName && blockedVerticalId) {
    return (
      <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-4 py-3 text-sm text-[var(--mkt-text-secondary)]">
        <p>
          You&apos;re verified and your <strong>{blockedVerticalName}</strong> demo is running. Switch to{" "}
          <strong>{vertical.name}</strong> instantly — no new OTP needed.
        </p>
        <form action={switchAction} className="mt-3">
          <input type="hidden" name="vertical" value={vertical.id} />
          <button
            type="submit"
            disabled={switchPending}
            className={`w-full ${mkt.btnPrimary} py-2.5 text-sm disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent)] focus-visible:ring-offset-2`}
          >
            {switchPending ? <BrandSpinner className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
            Switch to {vertical.name} demo
          </button>
        </form>
        <p className="mt-2 text-xs">Your {blockedVerticalName} sandbox will be reset and a fresh timer starts.</p>
        {switchState.step === "error" && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{switchState.message}</p>}
        {onShowActive ? (
          <button
            type="button"
            onClick={() => onShowActive(blockedVerticalId)}
            className="block mt-2 font-semibold text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] hover:underline focus-visible:outline-none focus-visible:underline"
          >
            Back to {blockedVerticalName} demo →
          </button>
        ) : (
          <a href={`/demos?vertical=${blockedVerticalId}`} className="block mt-2 font-semibold text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)] hover:underline">
            Go to active demo →
          </a>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`w-full ${mkt.btnPrimary} py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent)] focus-visible:ring-offset-2`}
        >
          Start 10-min demo
        </button>
      </div>
    );
  }

  if (flow.step === "otp") {
    return (
      <form action={verifyAction} className="space-y-3">
        <input type="hidden" name="sessionId" value={flow.sessionId} />
        <input type="hidden" name="vertical" value={flow.vertical} />
        <p className="text-sm text-slate-600 dark:text-slate-300">{flow.message}</p>
        {flow.displayOtp && (
          <div className="rounded-xl bg-slate-900 text-white text-center py-3 font-mono text-2xl tracking-widest">
            {flow.displayOtp}
          </div>
        )}
        <input name="otp" required placeholder="Enter 6-digit OTP" className={mkt.input} maxLength={6} inputMode="numeric" />
        {(verifyState.step === "error" || requestState.step === "error") && (
          <p className="text-sm text-red-500">
            {(verifyState as { message: string }).message || (requestState as { message: string }).message}
          </p>
        )}
        <button
          type="submit"
          disabled={verifyPending}
          className={`w-full ${mkt.btnPrimary} py-2.5 text-sm disabled:opacity-60`}
        >
          {verifyPending ? "Verifying…" : "Verify & start demo"}
        </button>
      </form>
    );
  }

  return (
    <form action={requestAction} className="space-y-3">
      <input type="hidden" name="vertical" value={vertical.id} />
      <p className={`text-xs ${mkt.muted} flex items-center gap-1.5`}>
        <Lock className="w-3.5 h-3.5 shrink-0" />
        OTP unlocks this sector only · 10-minute private sandbox
      </p>
      <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
        <Field label="Your name" required>
          <input name="name" required autoComplete="name" placeholder="Rahul Sharma" className={mkt.input} />
        </Field>
        <Field label="WhatsApp / phone" required>
          <input name="phone" required type="tel" autoComplete="tel" placeholder="98765 43210" className={mkt.input} />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required autoComplete="email" placeholder="you@business.com" className={mkt.input} />
        </Field>
        <Field label="Business name" required>
          <input name="company" required autoComplete="organization" placeholder="Bright Smile Dental" className={mkt.input} />
        </Field>
        <Field label="City" required>
          <input name="city" required autoComplete="address-level2" placeholder="Pune" className={mkt.input} />
        </Field>
        <Field label="Your role" required>
          <select name="role" required defaultValue="" className={mkt.input}>
            <option value="" disabled>Select…</option>
            {["Owner / Founder", "Manager", "Staff member", "Agency / Freelancer", "Other"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Already have a website?">
          <select name="website" defaultValue="" className={mkt.input}>
            <option value="">Select…</option>
            {["No, this is my first", "Yes, needs a redesign", "Yes, want to switch"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="When do you want to go live?">
          <select name="timeline" defaultValue="" className={mkt.input}>
            <option value="">Select…</option>
            {["This week", "This month", "In 1–3 months", "Just exploring"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>
      <fieldset>
        <legend className="mb-1 block text-xs font-semibold text-[var(--mkt-text-secondary)]">Best way to reach you</legend>
        <div className="grid grid-cols-3 gap-2">
          {["WhatsApp", "Call", "Email"].map((o, i) => (
            <label key={o} className="cursor-pointer">
              <input type="radio" name="contactVia" value={o} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-xl border border-[var(--mkt-border-strong)] py-2 text-center text-sm font-medium text-[var(--mkt-text-secondary)] transition peer-checked:border-[var(--mkt-accent-2)] peer-checked:bg-[var(--mkt-accent-soft)] peer-checked:text-[var(--mkt-accent-text)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--mkt-accent-2)]/40">
                {o}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="What do you need? (optional)">
        <textarea name="needs" rows={2} maxLength={1000} placeholder="e.g. Online appointments, gallery and a WhatsApp button" className={`${mkt.input} resize-none`} />
      </Field>
      {requestState.step === "error" && <p className="text-sm text-red-500">{requestState.message}</p>}
      <button
        type="submit"
        disabled={requestPending}
        className={`w-full rounded-lg border border-black/15 dark:border-white/15 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold px-4 py-2.5 text-sm hover:opacity-90 disabled:opacity-60`}
      >
        {requestPending ? "Sending OTP…" : "Get OTP & continue"}
      </button>
      <LegalConsent className="text-center" />
    </form>
  );
}
