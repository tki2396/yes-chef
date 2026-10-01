import { allowedImageTypes, type RecipeImportResponse } from "@/shared/recipe-import-api";
import type { RecipeImportRepository } from "@/server/repositories/recipe-imports-repository";
import { RecipeImportFileStorage } from "@/server/storage/recipe-import-files";
import { apiError, json } from "./http";

const maximumImageSize = 5 * 1024 * 1024;
type AllowedImageType = keyof typeof allowedImageTypes;

function matches(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

async function detectImageType(file: File): Promise<AllowedImageType | undefined> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (matches(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (matches(bytes, [0x52, 0x49, 0x46, 0x46]) && matches(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }

  return undefined;
}

export function recipeImportApi(
  repository: RecipeImportRepository,
  storage = new RecipeImportFileStorage(),
) {
  return {
    async upload(request: Request) {
      let formData: FormData;
      try {
        formData = await request.formData();
      } catch {
        return apiError(400, "missing_file", "Upload must include an image file.");
      }

      const file = formData.get("file");
      if (!(file instanceof File)) {
        return apiError(400, "missing_file", "No file was uploaded.");
      }
      if (file.size === 0) {
        return apiError(400, "invalid_file_type", "The uploaded file is empty.");
      }
      if (file.size > maximumImageSize) {
        return apiError(400, "file_too_large", "File size must be 5 MB or smaller.");
      }

      const mimeType = await detectImageType(file);
      if (!mimeType || file.type !== mimeType) {
        return apiError(400, "invalid_file_type", "Only valid PNG, JPEG, or WebP images are allowed.");
      }

      const importId = crypto.randomUUID();
      const mediaId = crypto.randomUUID();
      const storageKey = `imports/${importId}/${mediaId}.${allowedImageTypes[mimeType]}`;

      try {
        await storage.write(storageKey, file);
        repository.createImageImport({
          importId,
          mediaId,
          storageKey,
          mimeType,
          originalFileName: file.name || undefined,
          sizeBytes: file.size,
        });
      } catch (error) {
        try {
          await storage.delete(storageKey);
        } catch {
          // Nothing to clean up when the file write itself failed.
        }
        console.error("Unable to save recipe screenshot", error);
        return apiError(500, "internal_error", "Unable to save the recipe screenshot.");
      }

      return json<RecipeImportResponse>({ importId, mediaId }, { status: 201 });
    },
  };
}
