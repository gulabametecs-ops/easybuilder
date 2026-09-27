import { callGroqJson, GroqError, friendlyGroqError } from "./groq";
import { AI_SYSTEM_PROMPT, BLUEPRINT_JSON_INSTRUCTION } from "./prompts";
import { enrichBlueprint } from "./enrichBlueprint";
import { normalizeBlueprint } from "./normalizeBlueprint";
import { type WebsiteBlueprint } from "./blueprintSchema";
import { applyBrandToBlueprint, normalizeHexColor, type PublicPlanBrand } from "./applyBrand";

const MAX_PROMPT = 4000;

export type { PublicPlanBrand };
export { applyBrandToBlueprint, normalizeHexColor };

export type PublicAiPlanResult =
  | { ok: true; blueprint: WebsiteBlueprint; questions?: string[] }
  | { ok: false; error: string };

/** Plan a website from a public marketing prompt (no tenant context). */
export async function planWebsiteFromPublicPrompt(
  prompt: string,
  brand: PublicPlanBrand = {},
): Promise<PublicAiPlanResult> {
  const text = prompt.trim().slice(0, MAX_PROMPT);
  if (text.length < 8) {
    return { ok: false, error: "Please describe your website in a few words." };
  }

  const name = brand.companyName?.trim();
  const primary = normalizeHexColor(brand.primaryColor);
  const secondary = normalizeHexColor(brand.secondaryColor);

  try {
    const raw = await callGroqJson<WebsiteBlueprint>([
      { role: "system", content: AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Business context: New business

${name ? `Company / project name (MUST use as website.name): ${name}` : ""}
${primary ? `Primary brand color: ${primary}` : ""}
${secondary ? `Secondary brand color: ${secondary}` : ""}

User prompt:
${text}

Follow the user's requirements. If they omit pages, copy, or colors, fill sensible complete defaults for that industry.
Home page MUST include a full basic structure (hero + about + services/programs + social proof + CTA), not a single thin hero.
Use content.titleTop / titleHighlight / description for hero (not only "heading").

${BLUEPRINT_JSON_INSTRUCTION}`,
      },
    ]);

    const parsed = normalizeBlueprint(raw);
    if (!parsed) {
      return { ok: false, error: "AI returned an invalid plan. Please try rephrasing your prompt." };
    }

    const blueprint = applyBrandToBlueprint(enrichBlueprint(parsed, text), brand);
    return { ok: true, blueprint, questions: blueprint.questions };
  } catch (e) {
    const msg = e instanceof GroqError ? friendlyGroqError(e) : "AI planning failed. Please try again.";
    return { ok: false, error: msg };
  }
}
