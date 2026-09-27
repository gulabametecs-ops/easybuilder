import { getPreview } from "@/lib/ai/previewStore";
import { AiBlueprintLivePreview } from "@/components/marketing/AiBlueprintLivePreview";
import { AiAdminPreview } from "@/components/marketing/AiAdminPreview";
import { canonicalPageSlug } from "@/lib/ai/completeHome";
import { ROOT_DOMAIN } from "@/lib/domains";

// May render on a preview subdomain — link back to the builder on the marketing host.
const BUILDER_URL = `${ROOT_DOMAIN.includes("localhost") ? "http" : "https"}://${ROOT_DOMAIN}/ai-builder`;

export const dynamic = "force-dynamic";

function MissingPreview({ keyName }: { keyName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white text-slate-900">
      <div className="max-w-md text-center space-y-3">
        <p className="text-lg font-bold">Preview not found</p>
        <p className="text-sm text-slate-600">
          Session <span className="font-mono text-xs">{keyName}</span> expired or was not saved. Go back to the AI builder and click Open website / Open admin again.
        </p>
        <a href={BUILDER_URL} className="inline-block text-sm font-semibold text-lime-700 hover:underline">
          Return to AI Website Builder
        </a>
      </div>
    </div>
  );
}

export default async function AiLivePage({
  params,
}: {
  params: Promise<{ key: string; slug?: string[] }>;
}) {
  const { key, slug } = await params;
  if (!key.startsWith("ai-")) {
    return <MissingPreview keyName={key} />;
  }
  const blueprint = getPreview(key);
  if (!blueprint) {
    return <MissingPreview keyName={key} />;
  }

  const parts = slug ?? [];
  if (parts[0] === "admin") {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <AiAdminPreview blueprint={blueprint} />
      </div>
    );
  }

  const pageSlug = parts[0] ? canonicalPageSlug(parts[0], parts[0]) : "home";
  return <AiBlueprintLivePreview blueprint={blueprint} pageSlug={pageSlug} />;
}
