"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, Send, Wand2 } from "lucide-react";
import { modifyWebsiteFromPrompt } from "@/lib/actions/aiBuilder";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";

const SUGGESTIONS = [
  "Make the hero section darker",
  "Add a testimonials section below services",
  "Change the primary color to blue",
  "Make the design more premium",
  "Add an FAQ section",
  "Update the hero heading to be more compelling",
];

type Props = {
  pageId: string;
  onApplied?: () => void;
  compact?: boolean;
};

export function AIBuilderPanel({ pageId, onApplied, compact }: Props) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [pending, start] = useTransition();

  const run = (text: string) => {
    const p = text.trim();
    if (!p || pending) return;
    setMessages((m) => [...m, { role: "user", text: p }]);
    setPrompt("");
    start(async () => {
      const res = await modifyWebsiteFromPrompt(p, pageId);
      if (res.ok) {
        setMessages((m) => [...m, { role: "assistant", text: res.message }]);
        onApplied?.();
      } else {
        setMessages((m) => [...m, { role: "assistant", text: res.error }]);
      }
    });
  };

  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"} h-full min-h-0`}>
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-8 h-8 rounded-lg bg-lime-500/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">AI Assistant</p>
          <p className="text-[10px] text-slate-500">Describe changes — only affected sections update</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-2 max-h-32">
          {messages.map((m, i) => (
            <p
              key={i}
              className={`text-xs leading-relaxed ${m.role === "user" ? "text-slate-700 dark:text-slate-300" : "text-lime-700 dark:text-lime-300"}`}
            >
              {m.role === "user" ? "You: " : "AI: "}
              {m.text}
            </p>
          ))}
        </div>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Make the hero darker and change the heading to Build Faster"
        rows={compact ? 2 : 3}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-lime-500 resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            run(prompt);
          }
        }}
      />

      <button
        type="button"
        disabled={pending || !prompt.trim()}
        onClick={() => run(prompt)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-500 text-slate-950 text-sm font-semibold px-3 py-2 hover:bg-lime-400 disabled:opacity-50 shrink-0"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {pending ? "Applying…" : "Apply change"}
      </button>

      <div className="shrink-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Suggestions</p>
        <div className="flex flex-wrap gap-1">
          {SUGGESTIONS.slice(0, compact ? 3 : 6).map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => run(s)}
              className="text-[10px] px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-lime-500/40 hover:bg-lime-500/5"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full-site generation modal content (used from Pages manager). */
export function AIWebsiteGenerator({
  onDone,
}: {
  onDone: (pageIds: string[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [blueprint, setBlueprint] = useState<WebsiteBlueprint | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [step, setStep] = useState<"prompt" | "preview">("prompt");

  const plan = () => {
    setError("");
    start(async () => {
      const res = await fetch("/api/ai/website/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Generation failed");
        return;
      }
      setBlueprint(data.blueprint);
      setQuestions(data.questions ?? []);
      setStep("preview");
    });
  };

  const apply = (mode: "create_pages" | "replace_home" = "create_pages") => {
    if (!blueprint) return;
    setError("");
    start(async () => {
      const res = await fetch("/api/ai/website/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, apply: true, mode }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to create website");
        return;
      }
      onDone(data.pageIds ?? []);
    });
  };

  if (step === "preview" && blueprint) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-lime-500/30 bg-lime-500/5 p-4">
          <p className="font-bold text-slate-900 dark:text-white">{blueprint.website.name}</p>
          <p className="text-sm text-slate-500 mt-1">{blueprint.website.description}</p>
          {blueprint.design?.style && (
            <p className="text-xs text-lime-700 dark:text-lime-400 mt-2">Style: {blueprint.design.style}</p>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Pages</p>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {blueprint.pages.map((p) => (
              <li key={p.slug} className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-lime-500" />
                {p.name} — {p.sections?.length ?? 0} sections
              </li>
            ))}
          </ul>
        </div>
        {questions.length > 0 && (
          <p className="text-xs text-amber-700 dark:text-amber-300">
            AI suggested clarifications (optional): {questions.join(" · ")}
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => apply("create_pages")}
            className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-slate-950 font-semibold px-4 py-2.5 text-sm hover:bg-lime-400 disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create pages
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => apply("replace_home")}
            className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            Replace home page only
          </button>
          <button type="button" onClick={() => setStep("prompt")} className="text-sm text-slate-500 hover:underline">
            Edit prompt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Describe your website in plain English. AI will plan pages and sections using your existing builder blocks — no code generated.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        placeholder="Create a premium digital marketing agency website called Nova Digital. Dark theme with hero, services, portfolio, testimonials, pricing, FAQ and contact."
        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-lime-500"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="button"
        disabled={pending || prompt.trim().length < 8}
        onClick={plan}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-lime-500 text-slate-950 font-semibold py-3 hover:bg-lime-400 disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {pending ? "Planning…" : "Generate preview"}
      </button>
    </div>
  );
}
