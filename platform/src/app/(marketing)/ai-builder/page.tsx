import { MarketingAIBuilder } from "@/components/marketing/MarketingAIBuilder";

export const metadata = {
  title: "AI Website Builder — Standard SaaS",
  description: "Describe your business and AI builds a complete multi-page website with a live preview and admin panel.",
};

type Props = { searchParams: Promise<{ prompt?: string }> };

export default async function AiBuilderPage({ searchParams }: Props) {
  const { prompt } = await searchParams;
  return (
    <main>
      <MarketingAIBuilder initialPrompt={(prompt ?? "").slice(0, 2000)} />
    </main>
  );
}
