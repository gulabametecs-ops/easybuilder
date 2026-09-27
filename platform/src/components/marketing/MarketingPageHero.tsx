import { ReactNode } from "react";
import { mkt } from "@/lib/marketingTheme";

type Props = {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: "center" | "left";
};

export function MarketingPageHero({ eyebrow, title, description, children, align = "center" }: Props) {
  const alignCls = align === "center" ? "text-center" : "text-left";

  return (
    <section className={`relative overflow-hidden ${mkt.sectionDivider} bg-[var(--mkt-bg)]`}>
      <div className="mkt-hero-wash absolute inset-0 pointer-events-none" aria-hidden />
      <div className={`relative ${mkt.container} py-14 sm:py-16 ${alignCls}`}>
        {eyebrow}
        <h1 className={mkt.h1}>{title}</h1>
        {description && (
          <p className={`mt-4 max-w-2xl ${align === "center" ? "mx-auto" : ""} ${mkt.muted}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
