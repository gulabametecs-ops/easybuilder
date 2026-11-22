/** Client storage for AI prompt → preview → subscribe. Uses localStorage so a new tab can open /ai-preview. */

import { useSyncExternalStore } from "react";

export const AI_PROMPT_KEY = "ss_ai_prompt";
export const AI_BLUEPRINT_KEY = "ss_ai_blueprint";

function store(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function saveAiDraft(prompt: string, blueprint: object) {
  const s = store();
  if (!s) return;
  try {
    s.setItem(AI_PROMPT_KEY, prompt);
    s.setItem(AI_BLUEPRINT_KEY, JSON.stringify(blueprint));
  } catch {
    try {
      s.setItem(AI_PROMPT_KEY, prompt);
      s.setItem(AI_BLUEPRINT_KEY, JSON.stringify({
        website: (blueprint as { website?: unknown }).website,
        design: (blueprint as { design?: unknown }).design,
        pages: (blueprint as { pages?: unknown }).pages,
        questions: (blueprint as { questions?: unknown }).questions,
      }));
    } catch {
      /* quota */
    }
  }
}

export function readAiDraft(): { prompt: string; blueprint: string } | null {
  const s = store();
  if (!s) return null;
  try {
    const prompt = s.getItem(AI_PROMPT_KEY) ?? "";
    const blueprint = s.getItem(AI_BLUEPRINT_KEY) ?? "";
    if (!prompt && !blueprint) return null;
    return { prompt, blueprint };
  } catch {
    return null;
  }
}

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Reactive read of one draft key (AI_PROMPT_KEY / AI_BLUEPRINT_KEY). Returns `null` during SSR and
 * hydration so server and client markup match, then the stored string ("" when absent).
 * Updates when another tab writes the key.
 */
export function useAiDraftItem(key: string): string | null {
  return useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        return store()?.getItem(key) ?? "";
      } catch {
        return "";
      }
    },
    () => null,
  );
}

export function clearAiDraft() {
  const s = store();
  if (!s) return;
  s.removeItem(AI_PROMPT_KEY);
  s.removeItem(AI_BLUEPRINT_KEY);
}
