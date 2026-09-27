/** Client-safe Groq model constants & validation (no database imports). */

export const GROQ_DEFAULT_MODEL = "openai/gpt-oss-120b";

/** Groq model IDs use vendor/name format, e.g. openai/gpt-oss-120b */
export function isValidGroqModelId(model: string): boolean {
  const m = model.trim();
  if (!m || m === "new") return false;
  return /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i.test(m) && m.length >= 10;
}

/** Normalize model input for DB storage — empty string means “use default”. */
export function normalizeGroqModelInput(raw: string): string {
  const m = raw.trim();
  if (!m) return "";
  return isValidGroqModelId(m) ? m : "";
}

/** Resolve model used for API calls (invalid/blank → default). */
export function resolveGroqModel(model: string | undefined): string {
  const m = (model ?? "").trim();
  if (!isValidGroqModelId(m)) return GROQ_DEFAULT_MODEL;
  return m;
}
