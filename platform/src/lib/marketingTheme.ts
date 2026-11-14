/**
 * StandardSaaS marketing tokens — pairs with CSS variables on `.mkt-root` (globals.css).
 * Ivory paper + charcoal ink + terracotta highlights.
 */
export const mkt = {
  shell: "bg-[var(--mkt-bg)] text-[var(--mkt-text-secondary)]",
  sectionBg: "bg-[var(--mkt-surface)]",
  sectionBgAlt: "bg-[var(--mkt-bg-alt)]",
  container: "mx-auto max-w-6xl px-4 sm:px-6",
  containerNarrow: "mx-auto max-w-5xl px-4 sm:px-6",
  h1: "font-display text-4xl sm:text-5xl leading-[1.1] text-[var(--mkt-text)]",
  h2: "font-display text-[1.75rem] sm:text-[2.35rem] leading-[1.15] text-[var(--mkt-text)] text-balance",
  eyebrow:
    "inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-1 text-[var(--mkt-accent-text)] text-[11px] font-semibold tracking-[0.16em] uppercase",
  muted: "text-[var(--mkt-text-muted)]",
  card:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] shadow-[var(--mkt-card-shadow)]",
  cardSoft:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] shadow-[var(--mkt-card-shadow)]",
  cardHover:
    "hover:border-[var(--mkt-accent-2)]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)] font-semibold hover:bg-[var(--mkt-accent-hover)] transition shadow-sm",
  btnPrimarySm: "px-4 py-2 text-sm",
  btnPrimaryMd: "px-5 py-2.5 text-sm",
  btnPrimaryLg: "px-6 py-3 text-sm",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] font-medium hover:border-[var(--mkt-accent-2)]/50 hover:bg-[var(--mkt-accent-soft)] transition shadow-sm",
  btnPill:
    "inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] text-[var(--mkt-text)] font-semibold hover:border-[var(--mkt-accent-2)]/50 hover:bg-[var(--mkt-accent-soft)] transition shadow-sm",
  logoMark:
    "w-9 h-9 rounded-lg bg-[var(--mkt-ink)] text-[var(--mkt-accent-on)] dark:bg-[var(--mkt-accent)] dark:text-[var(--mkt-accent-on)] font-extrabold text-sm flex items-center justify-center",
  logoText: "font-bold text-[var(--mkt-text)] tracking-tight",
  logoAccent: "text-[var(--mkt-accent-text)]",
  input:
    "w-full rounded-xl border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-4 py-3 text-sm text-[var(--mkt-text)] placeholder:text-[var(--mkt-text-muted)] outline-none focus:border-[var(--mkt-accent-2)] focus:ring-2 focus:ring-[var(--mkt-accent-2)]/20 transition shadow-sm",
  badge:
    "inline-flex items-center gap-2 rounded-full bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent-text)] text-xs font-semibold px-4 py-1.5 border border-[var(--mkt-accent-2)]/15",
  statCard:
    "rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-5 py-6 text-center shadow-[var(--mkt-card-shadow)]",
  statValue: "text-2xl sm:text-3xl font-bold tracking-tight text-[var(--mkt-accent-text)]",
  sectionDivider: "border-t border-[var(--mkt-border)]",
  header: "sticky top-0 z-40 border-b border-[var(--mkt-border)] bg-[var(--mkt-header-bg)] backdrop-blur-xl",
};
