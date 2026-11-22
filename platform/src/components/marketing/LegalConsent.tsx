const A = "underline underline-offset-2 hover:text-[var(--mkt-accent-text)]";

/** One-line consent notice shown under every form that collects personal data. */
export function LegalConsent({ className = "", lead = "By continuing you agree to our" }: { className?: string; lead?: string }) {
  // Opens in a new tab so the half-filled form isn't lost.
  return (
    <p className={`text-xs text-[var(--mkt-text-muted)] ${className}`}>
      {lead}{" "}
      <a href="/terms" target="_blank" rel="noopener" className={A}>Terms</a> and{" "}
      <a href="/privacy" target="_blank" rel="noopener" className={A}>Privacy Policy</a>.
    </p>
  );
}
