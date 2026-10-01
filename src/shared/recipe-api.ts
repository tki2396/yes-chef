import { z } from "zod";

export const recipeVisibilitySchema = z.enum(["private", "public"]);
export const recipeStatusSchema = z.enum(["draft", "active", "archived"]);
export const recipeVersionSourceSchema = z.enum(["manual", "import", "variation"]);

export const ingredientSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  amount: z.string().optional(),
  notes: z.string().optional(),
});

export const recipeStepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  text: z.string().min(1),
  duration: z.string().optional(),
});

export const recipeVersionSchema = z.object({
  id: z.string().min(1),
  recipeId: z.string().min(1),
  parentVersionId: z.string().min(1).optional(),
  label: z.string().min(1),
  createdAt: z.string().min(1),
  source: recipeVersionSourceSchema,
  visibility: recipeVisibilitySchema,
  roughNotes: z.string().optional(),
  activeTime: z.string().optional(),
  passiveTime: z.string().optional(),
  servings: z.string().optional(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(recipeStepSchema),
  substitutionNotes: z.array(z.string()).optional(),
  outcomeNotes: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  effortRating: z.number().int().min(1).max(5).optional(),
});

export const recipeMediaSchema = z.object({
  id: z.string().min(1),
  caption: z.string().optional(),
});

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  status: recipeStatusSchema,
  visibility: recipeVisibilitySchema,
  tags: z.array(z.string()),
  updatedAt: z.string().min(1),
  sourceLabel: z.string().optional(),
  mediaCount: z.number().int().nonnegative(),
  media: z.array(recipeMediaSchema),
  versions: z.array(recipeVersionSchema),
});

const optionalShortText = z.string().trim().max(200).optional();
const imageDataUrl = z
  .string()
  .max(8_000_000, "Each photo must be smaller than 6 MB.")
  .regex(/^data:image\/(?:gif|jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/, "Photo must be a supported image.");

export const createRecipeInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().trim().max(5_000).optional(),
  status: recipeStatusSchema.optional(),
  visibility: recipeVisibilitySchema.optional(),
  sourceLabel: optionalShortText,
  version: z
    .object({
      label: optionalShortText,
      source: recipeVersionSourceSchema.optional(),
      roughNotes: z.string().trim().max(20_000).optional(),
      activeTime: optionalShortText,
      passiveTime: optionalShortText,
      servings: optionalShortText,
      ingredients: z
        .array(
          z.object({
            label: z.string().trim().min(1, "Ingredient name is required.").max(500),
            amount: optionalShortText,
            notes: z.string().trim().max(1_000).optional(),
          }),
        )
        .max(500)
        .optional(),
      steps: z
        .array(
          z.object({
            text: z.string().trim().min(1, "Instruction is required.").max(5_000),
            duration: optionalShortText,
          }),
        )
        .max(500)
        .optional(),
      substitutionNotes: z.array(z.string().trim().min(1).max(1_000)).max(100).optional(),
      outcomeNotes: z.string().trim().max(20_000).optional(),
      rating: z.number().int().min(1).max(5).optional(),
      effortRating: z.number().int().min(1).max(5).optional(),
      tags: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
    })
    .optional(),
  media: z
    .array(
      z.object({
        dataUrl: imageDataUrl,
        caption: z.string().trim().max(500).optional(),
      }),
    )
    .max(8, "Add no more than 8 photos at a time.")
    .optional(),
});

export const recipeResponseSchema = z.object({ recipe: recipeSchema });
export const recipeListResponseSchema = z.object({ recipes: z.array(recipeSchema) });

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;
export type RecipeListResponse = z.infer<typeof recipeListResponseSchema>;
