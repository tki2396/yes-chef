import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "invalid_json",
  "validation_failed",
  "recipe_not_found",
  "internal_error",
  "missing_file",
  "invalid_file_type",
  "file_too_large",
]);

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string(),
    issues: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
