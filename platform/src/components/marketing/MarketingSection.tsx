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
  const bg = variant === "alt" ? `${mkt.sectionBgAlt} mkt-sec-glow` : mkt.sectionBg;
  const wrap =
    container === "narrow" ? mkt.containerNarrow : container === "none" ? "" : mkt.container;

  return (
    <section
      id={id}
      className={`scroll-mt-16 overflow-x-clip ${mkt.sectionDivider} py-14 sm:py-16 lg:py-20 ${bg} ${className}`}
    >
      <div className={wrap}>{children}</div>
    </section>
  );
}
