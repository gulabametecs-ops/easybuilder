import Script from "next/script";
import { VERTICALS } from "@/lib/verticals";
import { paymentMode } from "@/lib/actions/checkout";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTiers } from "@/lib/plans";
import { SubscribeFlow } from "@/components/marketing/SubscribeFlow";

export const metadata = { title: "Subscribe — Standard SaaS" };

type Props = { searchParams: Promise<{ vertical?: string; tier?: string }> };

export default async function SubscribePage({ searchParams }: Props) {
  const { vertical, tier } = await searchParams;
  const mode = await paymentMode();
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      {mode === "razorpay" && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Get your website</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Pick a sector, plan and duration — your site goes live the moment you pay.</p>
      </div>
      <SubscribeFlow
        verticals={VERTICALS.map((v) => ({ id: v.id, name: v.name, status: v.status }))}
        defaultVertical={vertical ?? "home-services"}
        defaultTier={tier}
        mock={mode === "mock"}
        tiers={tiers}
      />
    </main>
  );
}
