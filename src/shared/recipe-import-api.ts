import { z } from "zod";

export const allowedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type RecipeImportMedia = {
  id: string;
  importId: string;
  storageKey: string;
  mimeType: string;
  originalFileName?: string;
  sizeBytes: number;
  createdAt: string;
};

export type RecipeImportResponse = {
  importId: string;
  mediaId: string;
};

export const recipeImportMediaSchema = z.object({
  id: z.string().min(1),
  importId: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  originalFileName: z.string().min(1).optional(),
  sizeBytes: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
});

export const recipeImportResponseSchema = z.object({
  importId: z.string().uuid(),
  mediaId: z.string().uuid(),
});
