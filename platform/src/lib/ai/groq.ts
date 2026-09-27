import { getGroqConfig } from "@/lib/platformConfig";
import { GROQ_DEFAULT_MODEL } from "@/lib/groqModel";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 60_000;

export type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export class GroqError extends Error {
  constructor(
    message: string,
    public status?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "GroqError";
  }
}

type GroqCallOptions = {
  jsonMode?: boolean;
  maxTokens?: number;
  temperature?: number;
};

/** Pull a JSON object string from model output (handles markdown fences). */
export function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  if (trimmed.startsWith("{")) return trimmed;
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function errorCause(e: unknown): string {
  if (!e || typeof e !== "object") return "";
  const c = (e as { cause?: unknown }).cause;
  if (!c) return "";
  if (c instanceof Error) return `${c.message} ${errorCause(c)}`;
  return String(c);
}

function isNetworkError(e: unknown): boolean {
  const blob = `${e instanceof Error ? e.message : ""} ${errorCause(e)}`.toLowerCase();
  return (
    blob.includes("fetch failed") ||
    blob.includes("econnreset") ||
    blob.includes("econnrefused") ||
    blob.includes("etimedout") ||
    blob.includes("enotfound") ||
    blob.includes("socket") ||
    blob.includes("network") ||
    blob.includes("und_err") ||
    blob.includes("could not reach groq")
  );
}

export function friendlyGroqError(e: unknown): string {
  if (e instanceof GroqError) {
    if (e.message === "JSON_GENERATION_FAILED") {
      return "AI could not finish the website plan. Try a shorter prompt.";
    }
    if (isNetworkError(e) || e.message.toLowerCase() === "fetch failed") {
      return "Could not reach Groq AI. Check your internet connection and try again.";
    }
    return e.message;
  }
  if (isNetworkError(e)) {
    return "Could not reach Groq AI. Check your internet connection and try again.";
  }
  return e instanceof Error ? e.message : "AI request failed";
}

async function groqChatOnce(messages: GroqMessage[], opts: GroqCallOptions): Promise<string> {
  const { apiKey: key, model } = await getGroqConfig();
  if (!key) throw new GroqError("AI is not configured. Add a Groq API key in Super Admin → Settings.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const body: Record<string, unknown> = {
    model: model || GROQ_DEFAULT_MODEL,
    messages,
    temperature: opts.temperature ?? 0.15,
    max_tokens: opts.maxTokens ?? 8192,
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text().catch(() => "");

    if (!res.ok) {
      const isJsonFail =
        text.includes("json_validate_failed") ||
        text.includes("Failed to generate JSON") ||
        text.includes("structured_generation_failed");
      throw new GroqError(
        isJsonFail
          ? "JSON_GENERATION_FAILED"
          : `Groq API error (${res.status}): ${text.slice(0, 200)}`,
        res.status,
      );
    }

    const data = JSON.parse(text) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
    };
    const choice = data.choices?.[0];
    const content = choice?.message?.content;
    if (!content) throw new GroqError("Empty response from Groq");
    if (choice?.finish_reason === "length") {
      throw new GroqError("JSON_GENERATION_FAILED");
    }
    return content;
  } catch (e) {
    if (e instanceof GroqError) throw e;
    if ((e as Error).name === "AbortError") throw new GroqError("AI request timed out. Try a shorter prompt.");
    throw new GroqError(friendlyGroqError(e), undefined, { cause: e });
  } finally {
    clearTimeout(timer);
  }
}

async function groqChat(messages: GroqMessage[], opts: GroqCallOptions): Promise<string> {
  let last: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await groqChatOnce(messages, opts);
    } catch (e) {
      last = e;
      const retryable =
        e instanceof GroqError &&
        (isNetworkError(e) || e.message.includes("Could not reach Groq") || e.status === 429 || e.status === 503);
      if (!retryable || attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  throw last instanceof GroqError ? last : new GroqError(friendlyGroqError(last));
}

function parseGroqJson<T>(raw: string): T {
  try {
    return JSON.parse(extractJsonText(raw)) as T;
  } catch {
    throw new GroqError("Groq returned invalid JSON");
  }
}

export async function callGroqJson<T>(messages: GroqMessage[], maxTokens = 8192): Promise<T> {
  const jsonRetryHint: GroqMessage = {
    role: "user",
    content:
      "Output ONLY one valid JSON object matching the schema. No markdown, no comments, no trailing commas. Keep strings short.",
  };

  try {
    const raw = await groqChat(messages, { jsonMode: true, maxTokens, temperature: 0.15 });
    return parseGroqJson<T>(raw);
  } catch (first) {
    const retry =
      first instanceof GroqError &&
      (first.message === "JSON_GENERATION_FAILED" ||
        first.status === 400 ||
        first.message.includes("Could not reach Groq"));
    if (!retry) throw first;
  }

  try {
    const raw = await groqChat([...messages, jsonRetryHint], {
      jsonMode: false,
      maxTokens,
      temperature: 0.1,
    });
    return parseGroqJson<T>(raw);
  } catch (second) {
    if (second instanceof GroqError && second.message !== "Groq returned invalid JSON") throw second;
    throw new GroqError("AI could not produce a valid website plan. Try a shorter, simpler prompt.");
  }
}
