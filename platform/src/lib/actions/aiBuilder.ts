"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";
import { rateLimit } from "@/lib/rateLimit";
import { callGroqJson, GroqError } from "@/lib/ai/groq";
import { AI_SYSTEM_PROMPT, BLUEPRINT_JSON_INSTRUCTION, MODIFY_JSON_INSTRUCTION, MODIFY_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import {
  websiteBlueprintSchema,
  modifyResponseSchema,
  filterValidSectionTypes,
  type WebsiteBlueprint,
} from "@/lib/ai/blueprintSchema";
import { applyBlueprint } from "@/lib/ai/applyBlueprint";
import { applyOperations } from "@/lib/ai/applyOperations";
import { loadSiteContext, siteContextPromptBlock } from "@/lib/ai/siteContext";
import { captureSiteSnapshot } from "@/lib/ai/snapshot";
import { enrichBlueprint } from "@/lib/ai/enrichBlueprint";
import { normalizeBlueprint } from "@/lib/ai/normalizeBlueprint";

const MAX_PROMPT = 4000;

export type AiPlanResult =
  | { ok: true; blueprint: WebsiteBlueprint; questions?: string[] }
  | { ok: false; error: string };

export type AiApplyResult =
  | { ok: true; pageIds: string[]; blueprint: WebsiteBlueprint; message?: string }
  | { ok: false; error: string };

export type AiModifyResult =
  | { ok: true; message: string; pageIds: string[]; operations: unknown[] }
  | { ok: false; error: string };

function checkRate(tenantId: string) {
  const rl = rateLimit(`ai:${tenantId}`, 20, 60 * 60_000);
  if (!rl.ok) throw new GroqError(`AI rate limit reached. Retry in ${rl.retryAfterSec}s.`);
}

async function logGeneration(
  tenantId: string,
  kind: string,
  prompt: string,
  data: {
    blueprint?: object;
    operations?: object;
    snapshot?: object;
    status: string;
    error?: string;
    pageId?: string;
  },
) {
  await db.aiGeneration.create({
    data: {
      tenantId,
      kind,
      prompt: prompt.slice(0, 8000),
      blueprint: JSON.stringify(data.blueprint ?? {}),
      operations: JSON.stringify(data.operations ?? []),
      snapshot: JSON.stringify(data.snapshot ?? {}),
      status: data.status,
      error: data.error ?? "",
      pageId: data.pageId ?? "",
    },
  });
}

/** Step 1: Plan only — returns blueprint + optional questions (no DB writes). */
export async function planWebsiteFromPrompt(prompt: string): Promise<AiPlanResult> {
  const tenantId = await requireTenantId();
  const text = prompt.trim().slice(0, MAX_PROMPT);
  if (text.length < 8) return { ok: false, error: "Please describe your website in a few words." };

  try {
    checkRate(tenantId);
    const ctx = await loadSiteContext(tenantId);
    const raw = await callGroqJson<WebsiteBlueprint>([
      { role: "system", content: AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Business context: ${ctx.businessName} (${ctx.vertical})

User prompt:
${text}

${BLUEPRINT_JSON_INSTRUCTION}`,
      },
    ]);

    const parsed = normalizeBlueprint(raw);
    if (!parsed) {
      await logGeneration(tenantId, "plan", text, { status: "failed", error: "invalid_blueprint" });
      return { ok: false, error: "AI returned an invalid plan. Please try rephrasing your prompt." };
    }

    const blueprint = enrichBlueprint(parsed, text);
    await logGeneration(tenantId, "plan", text, { blueprint, status: "completed" });
    return { ok: true, blueprint, questions: blueprint.questions };
  } catch (e) {
    const msg = e instanceof GroqError ? e.message : "AI planning failed";
    await logGeneration(tenantId, "plan", text, { status: "failed", error: msg }).catch(() => {});
    return { ok: false, error: msg };
  }
}

/** Step 2: Apply a validated blueprint to the tenant site. */
export async function applyWebsiteBlueprint(
  blueprint: WebsiteBlueprint,
  mode: "create_pages" | "replace_home" = "create_pages",
): Promise<AiApplyResult> {
  const tenantId = await requireTenantId();
  const parsed = websiteBlueprintSchema.safeParse(filterValidSectionTypes(blueprint));
  if (!parsed.success) return { ok: false, error: "Invalid blueprint" };

  try {
    const result = await applyBlueprint({ tenantId, blueprint: parsed.data, mode });
    await logGeneration(tenantId, "apply", parsed.data.website.name, {
      blueprint: parsed.data,
      status: "completed",
    });
    revalidatePath("/admin/pages");
    revalidatePath("/admin/appearance");
    for (const id of result.pageIds) revalidatePath(`/admin/pages/${id}`);
    revalidatePath("/");
    return { ok: true, pageIds: result.pageIds, blueprint: parsed.data };
  } catch (e) {
    const msg = (e as Error).message || "Failed to apply blueprint";
    return { ok: false, error: msg };
  }
}

/** One-shot: plan + apply. */
export async function generateWebsiteFromPrompt(
  prompt: string,
  mode: "create_pages" | "replace_home" = "create_pages",
): Promise<AiApplyResult> {
  const plan = await planWebsiteFromPrompt(prompt);
  if (!plan.ok) return plan;
  if (plan.questions?.length && !prompt.includes("[skip-questions]")) {
    return {
      ok: false,
      error: `QUESTIONS:${JSON.stringify(plan.questions)}`,
    };
  }
  return applyWebsiteBlueprint(plan.blueprint, mode);
}

/** Modify existing site with partial operations. */
export async function modifyWebsiteFromPrompt(prompt: string, pageId?: string): Promise<AiModifyResult> {
  const tenantId = await requireTenantId();
  const text = prompt.trim().slice(0, MAX_PROMPT);
  if (text.length < 3) return { ok: false, error: "Describe the change you want." };

  try {
    checkRate(tenantId);
    const ctx = await loadSiteContext(tenantId, pageId);
    const raw = await callGroqJson<unknown>([
      { role: "system", content: MODIFY_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${siteContextPromptBlock(ctx)}

User modification request:
${text}

${MODIFY_JSON_INSTRUCTION}`,
      },
    ]);

    const parsed = modifyResponseSchema.safeParse(raw);
    if (!parsed.success) {
      await logGeneration(tenantId, "modify", text, { status: "failed", error: parsed.error.message, pageId });
      return { ok: false, error: "AI returned invalid modification instructions." };
    }

    const snapshot = await captureSiteSnapshot(tenantId, pageId);
    const pageIds = await applyOperations(tenantId, parsed.data.operations);
    await logGeneration(tenantId, "modify", text, {
      operations: parsed.data.operations,
      snapshot,
      status: "completed",
      pageId,
    });

    revalidatePath("/admin/pages");
    revalidatePath("/admin/appearance");
    for (const id of pageIds) revalidatePath(`/admin/pages/${id}`);
    revalidatePath("/");

    return {
      ok: true,
      message: parsed.data.message ?? "Done.",
      pageIds,
      operations: parsed.data.operations,
    };
  } catch (e) {
    const msg = e instanceof GroqError ? e.message : "Modification failed";
    await logGeneration(tenantId, "modify", text, { status: "failed", error: msg, pageId }).catch(() => {});
    return { ok: false, error: msg };
  }
}
