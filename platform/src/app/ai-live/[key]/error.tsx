"use client";

export default function AiLiveError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 px-6">
      <div className="max-w-md text-center space-y-2">
        <p className="text-lg font-bold">Preview crashed</p>
        <p className="text-sm text-slate-600">{error.message || "The live preview failed to render."}</p>
      </div>
    </div>
  );
}
