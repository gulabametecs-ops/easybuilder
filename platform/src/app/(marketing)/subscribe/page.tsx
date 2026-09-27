import Script from "next/script";
import Link from "next/link";
import { VERTICALS, getVertical, categoryOf } from "@/lib/verticals";
import { paymentMode } from "@/lib/actions/checkout";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTiers } from "@/lib/plans";
import { SubscribeFlow } from "@/components/marketing/SubscribeFlow";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { mkt } from "@/lib/marketingTheme";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Subscribe — Standard SaaS" };

type Props = { searchParams: Promise<{ vertical?: string; tier?: string; duration?: string; from?: string; design?: string }> };

export default async function SubscribePage({ searchParams }: Props) {
  const { vertical, tier, duration, from, design } = await searchParams;
  const fromAi = from === "ai";
  const mode = await paymentMode();
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);

  const selected = vertical ? getVertical(vertical) : null;
  const validVertical = selected ? vertical! : "home-services";

  return (
    <main>
      {mode === "razorpay" && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      <MarketingPageHero
        eyebrow={
          selected ? (
            <span className={`${mkt.badge} mb-4`}>{categoryOf(selected.id)}</span>
          ) : undefined
        }
        title={
          fromAi
            ? "Buy your custom AI website"
            : selected
              ? `Launch your ${selected.name} website`
              : "Get your website"
        }
        description={
          fromAi
            ? "Your AI-designed website is saved — pick a plan and pay once. We build your exact design on your domain instantly."
            : selected
              ? `Subscribe for ${selected.name} — pick a plan, pay once, and your site + admin panel go live instantly.`
              : "Pick a sector, plan and duration — your site goes live the moment you pay."
        }
      >
        <Link
          href={selected ? `/demos?vertical=${selected.id}` : "/demos"}
          className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-lime-600 dark:text-lime-400 hover:underline`}
        >
          <ArrowLeft className="w-4 h-4" />
          {selected ? "Try live demo first" : "Explore live demos"}
        </Link>
      </MarketingPageHero>

      <div className={`${mkt.container} py-10 sm:py-14`}>
        <SubscribeFlow
          verticals={VERTICALS.map((v) => ({ id: v.id, name: v.name, status: v.status }))}
          defaultVertical={validVertical}
          defaultTier={tier}
          defaultDuration={duration}
          mock={mode === "mock"}
          tiers={tiers}
          fromAi={fromAi}
          defaultDesign={design}
        />
      </div>
    </main>
  );
}
