import { callGroqJson, GroqError, friendlyGroqError } from "./groq";
import { AI_SYSTEM_PROMPT, BLUEPRINT_JSON_INSTRUCTION } from "./prompts";
import { type WebsiteBlueprint } from "./blueprintSchema";
import { compactBlueprintSummary } from "./blueprintPreview";
import { enrichBlueprint } from "./enrichBlueprint";
import { normalizeBlueprint } from "./normalizeBlueprint";

const MAX_PROMPT = 2000;

export type PublicModifyResult =
  | { ok: true; blueprint: WebsiteBlueprint }
  | { ok: false; error: string };

/** Refine a marketing-site blueprint from a follow-up prompt (no tenant). */
export async function refinePublicBlueprint(
  blueprint: WebsiteBlueprint,
  changePrompt: string,
): Promise<PublicModifyResult> {
  const text = changePrompt.trim().slice(0, MAX_PROMPT);
  if (text.length < 3) return { ok: false, error: "Describe what you want to change." };

  try {
    const raw = await callGroqJson<WebsiteBlueprint>([
      { role: "system", content: AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: `You are updating an existing website blueprint.

Current site: ${blueprint.website.name}
Structure: ${compactBlueprintSummary(blueprint)}

Current blueprint JSON:
${JSON.stringify(blueprint)}

User requested changes:
${text}

Return the FULL updated blueprint JSON (not a diff). Keep unchanged parts unless the user asked to change them.

${BLUEPRINT_JSON_INSTRUCTION}`,
      },
    ]);

    const parsed = normalizeBlueprint(raw);
    if (!parsed) {
      return { ok: false, error: "AI could not apply your changes. Try a simpler request." };
    }
    return { ok: true, blueprint: enrichBlueprint(parsed, text) };
  } catch (e) {
    const msg = e instanceof GroqError ? friendlyGroqError(e) : "Update failed. Please try again.";
    return { ok: false, error: msg };
  }
}
