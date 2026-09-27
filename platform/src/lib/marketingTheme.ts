/**
 * StandardSaaS marketing tokens — pairs with CSS variables on `.mkt-root` (globals.css).
 * Light: warm sage bands + white elevated cards. Dark: deep green-black + glass surfaces.
 */
export const mkt = {
  shell: "bg-[var(--mkt-bg)] text-[var(--mkt-text-secondary)]",
  sectionBg: "bg-[var(--mkt-surface)]",
  sectionBgAlt: "bg-[var(--mkt-bg-alt)]",
  container: "mx-auto max-w-6xl px-4 sm:px-6",
  containerNarrow: "mx-auto max-w-5xl px-4 sm:px-6",
  h1: "text-4xl sm:text-5xl font-bold tracking-tight text-[var(--mkt-text)]",
  h2: "text-3xl sm:text-4xl font-bold tracking-tight text-[var(--mkt-text)]",
  eyebrow: "text-[var(--mkt-accent-text)] text-sm font-semibold tracking-wider uppercase",
  muted: "text-[var(--mkt-text-muted)]",
  card:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] shadow-[var(--mkt-card-shadow)]",
  cardSoft:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] shadow-[var(--mkt-card-shadow)]",
  cardHover:
    "hover:border-lime-500/35 hover:shadow-md hover:shadow-lime-500/8 transition-all duration-300",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-lime-500 text-slate-950 font-semibold hover:bg-lime-400 transition shadow-sm shadow-lime-600/20",
  btnPrimarySm: "px-4 py-2 text-sm",
  btnPrimaryMd: "px-5 py-2.5 text-sm",
  btnPrimaryLg: "px-7 py-3.5 text-sm rounded-full",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] font-medium hover:border-lime-500/45 hover:bg-lime-500/5 transition shadow-sm",
  btnPill:
    "inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] font-semibold hover:border-lime-500/45 hover:bg-lime-500/5 transition shadow-sm",
  logoMark:
    "w-9 h-9 rounded-lg bg-lime-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shadow-sm shadow-lime-600/25",
  logoText: "font-bold text-[var(--mkt-text)] tracking-tight",
  logoAccent: "text-[var(--mkt-accent-text)]",
  input:
    "w-full rounded-xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-4 py-3 text-sm text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/25 transition shadow-sm",
  badge:
    "inline-flex items-center gap-2 rounded-full bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)] text-xs font-semibold px-4 py-1.5 border border-lime-500/15",
  statCard:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-5 py-6 text-center shadow-[var(--mkt-card-shadow)]",
  statValue: "text-3xl sm:text-4xl font-bold tracking-tight text-[var(--mkt-accent-text)]",
  sectionDivider: "border-t border-[var(--mkt-border)]",
  header: "sticky top-0 z-40 border-b border-[var(--mkt-border)] bg-[var(--mkt-header-bg)] backdrop-blur-md shadow-sm shadow-slate-900/[0.03]",
};
