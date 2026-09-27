import { z } from "zod";
import { isAllowedSectionType } from "./builderRegistry";

const imageIntentSchema = z
  .object({
    imageIntent: z.string().max(200).optional(),
    alt: z.string().max(200).optional(),
  })
  .optional();

export const blueprintSectionSchema = z.object({
  sectionType: z.string().min(1).max(40),
  variant: z.string().max(40).optional(),
  style: z.record(z.string(), z.unknown()).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  imageIntent: imageIntentSchema,
});

export const blueprintPageSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(0).max(80),
  pageTemplateId: z.string().max(40).optional(),
  showInNav: z.boolean().optional(),
  published: z.boolean().optional(),
  sections: z.array(blueprintSectionSchema).max(24).optional(),
});

export const websiteBlueprintSchema = z.object({
  website: z.object({
    name: z.string().min(1).max(120),
    type: z.string().max(80).optional(),
    description: z.string().max(500).optional(),
    logoImage: z.string().max(2000).optional(),
  }),
  design: z
    .object({
      style: z.string().max(80).optional(),
      theme: z.string().max(40).optional(),
      primaryColor: z.string().max(20).optional(),
      secondaryColor: z.string().max(20).optional(),
      fontStyle: z.string().max(60).optional(),
      borderRadius: z.string().max(20).optional(),
      spacing: z.string().max(20).optional(),
      animationLevel: z.string().max(20).optional(),
    })
    .optional(),
  services: z
    .array(
      z.object({
        category: z.string().max(80),
        title: z.string().max(120),
        description: z.string().max(500),
      }),
    )
    .max(40)
    .optional(),
  pages: z.array(blueprintPageSchema).min(1).max(12),
  questions: z.array(z.string().max(200)).max(8).optional(),
});

export type WebsiteBlueprint = z.infer<typeof websiteBlueprintSchema>;

export const aiOperationSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("update_section"),
    sectionId: z.string().min(1),
    content: z.record(z.string(), z.unknown()).optional(),
    style: z.record(z.string(), z.unknown()).optional(),
  }),
  z.object({
    op: z.literal("add_section"),
    pageId: z.string().optional(),
    pageSlug: z.string().optional(),
    sectionType: z.string().min(1),
    afterSectionId: z.string().optional(),
    content: z.record(z.string(), z.unknown()).optional(),
    style: z.record(z.string(), z.unknown()).optional(),
  }),
  z.object({
    op: z.literal("delete_section"),
    sectionId: z.string().min(1),
  }),
  z.object({
    op: z.literal("move_section"),
    sectionId: z.string().min(1),
    direction: z.enum(["up", "down"]),
  }),
  z.object({
    op: z.literal("update_theme"),
    theme: z.record(z.string(), z.unknown()),
  }),
  z.object({
    op: z.literal("update_header"),
    header: z.record(z.string(), z.unknown()).optional(),
    nav: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  }),
  z.object({
    op: z.literal("create_page"),
    name: z.string().min(1),
    slug: z.string().min(1),
    pageTemplateId: z.string().optional(),
    sections: z.array(blueprintSectionSchema).optional(),
  }),
]);

export const modifyResponseSchema = z.object({
  message: z.string().max(500).optional(),
  operations: z.array(aiOperationSchema).max(20),
  questions: z.array(z.string().max(200)).max(4).optional(),
});

export type AiOperation = z.infer<typeof aiOperationSchema>;
export type ModifyResponse = z.infer<typeof modifyResponseSchema>;

export function filterValidSectionTypes(blueprint: WebsiteBlueprint): WebsiteBlueprint {
  return {
    ...blueprint,
    pages: blueprint.pages.map((p) => ({
      ...p,
      sections: (p.sections ?? []).filter((s) => isAllowedSectionType(s.sectionType)),
    })),
  };
}
