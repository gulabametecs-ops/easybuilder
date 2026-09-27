import { ReactNode } from "react";
import { mkt } from "@/lib/marketingTheme";

type Props = {
  id?: string;
  variant?: "default" | "alt";
  children: ReactNode;
  className?: string;
  container?: "default" | "narrow" | "none";
};

export function MarketingSection({
  id,
  variant = "default",
  children,
  className = "",
  container = "default",
}: Props) {
  const bg = variant === "alt" ? mkt.sectionBgAlt : mkt.sectionBg;
  const wrap =
    container === "narrow" ? mkt.containerNarrow : container === "none" ? "" : mkt.container;

  return (
    <section
      id={id}
      className={`scroll-mt-16 ${mkt.sectionDivider} py-16 sm:py-20 lg:py-24 ${bg} ${className}`}
    >
      <div className={wrap}>{children}</div>
    </section>
  );
}
