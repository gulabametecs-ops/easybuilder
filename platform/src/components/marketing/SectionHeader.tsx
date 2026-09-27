import { ReactNode } from "react";
import { mkt } from "@/lib/marketingTheme";

type Props = {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, align = "center", className = "" }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl mb-10 sm:mb-12 lg:mb-14 ${alignCls} ${className}`}>
      {eyebrow && <div className="mb-3">{eyebrow}</div>}
      <h2 className={mkt.h2}>{title}</h2>
      {description && <p className={`mt-3 text-[15px] leading-relaxed ${mkt.muted}`}>{description}</p>}
    </div>
  );
}
