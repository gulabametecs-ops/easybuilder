// AI providers for the website builder. All speak the OpenAI "chat/completions" format,
// so one client (lib/ai/groq.ts) works with every one of them. Client-safe (no DB imports).

export type AiProviderId = "groq" | "openai" | "gemini" | "openrouter" | "deepseek" | "custom";

export type AiProvider = {
  id: AiProviderId;
  name: string;
  /** chat/completions endpoint ("" for custom — taken from the base URL setting) */
  url: string;
  defaultModel: string;
  /** suggestions for the model field (any model id the provider accepts works) */
  models: string[];
  keysUrl: string;
  keyHint: string;
  /**
   * Tokens-per-minute budget the request must fit in (prompt + output). Groq's free tier
   * is ~8k; the others are far higher, so they get a generous output cap.
   */
  tpm: number;
  note: string;
};

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "groq",
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "openai/gpt-oss-120b",
    models: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
    keysUrl: "https://console.groq.com/keys",
    keyHint: "gsk_…",
    tpm: 7600,
    note: "Fast and free to start, but the free tier has a small per-minute limit (busy errors on long edits).",
  },
  {
    id: "openai",
    name: "OpenAI (ChatGPT)",
    url: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"],
    keysUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-…",
    tpm: 100_000,
    note: "Most reliable JSON output. Paid per use — add billing on platform.openai.com.",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    defaultModel: "gemini-2.5-flash",
    models: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"],
    keysUrl: "https://aistudio.google.com/apikey",
    keyHint: "AIza…",
    tpm: 100_000,
    note: "Generous free tier from Google AI Studio.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "openai/gpt-4o-mini",
    models: ["openai/gpt-4o-mini", "google/gemini-2.5-flash", "meta-llama/llama-3.3-70b-instruct"],
    keysUrl: "https://openrouter.ai/keys",
    keyHint: "sk-or-…",
    tpm: 100_000,
    note: "One key, hundreds of models from every vendor.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://api.deepseek.com/chat/completions",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat"],
    keysUrl: "https://platform.deepseek.com/api_keys",
    keyHint: "sk-…",
    tpm: 100_000,
    note: "Low cost per request.",
  },
  {
    id: "custom",
    name: "Other (OpenAI-compatible)",
    url: "",
    defaultModel: "",
    models: [],
    keysUrl: "",
    keyHint: "API key",
    tpm: 100_000,
    note: "Any service with an OpenAI-compatible API (Together, Mistral, Fireworks, local LM Studio…). Enter its base URL.",
  },
];

export function getProvider(id: string | undefined): AiProvider {
  return AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0];
}

/** Base URL → chat/completions endpoint ("https://x/v1" → "https://x/v1/chat/completions"). */
export function chatUrlFromBase(base: string): string {
  const b = base.trim().replace(/\/+$/, "");
  if (!b) return "";
  return /\/chat\/completions$/.test(b) ? b : `${b}/chat/completions`;
}

/** Model ids: letters, digits, . _ - : / (vendor/name allowed). */
export function isValidModelId(model: string): boolean {
  return /^[a-z0-9][a-z0-9._:/-]{1,99}$/i.test(model.trim());
}

/** Parse a stored JSON map ({ provider: value }) safely. */
export function parseMap(raw: string | null | undefined): Record<string, string> {
  try {
    const v = JSON.parse(raw || "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}
