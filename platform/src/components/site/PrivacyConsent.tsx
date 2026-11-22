/** One-line consent note under tenant-site forms that collect visitor data. */
export function PrivacyConsent({ className = "text-center text-slate-400" }: { className?: string }) {
  return (
    <p className={`text-xs ${className}`}>
      By submitting, you agree to our{" "}
      <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-primary">
        Privacy Policy
      </a>
      .
    </p>
  );
}
