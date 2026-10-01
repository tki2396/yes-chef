import type { Database } from "bun:sqlite";
import type { RecipeImportMedia } from "@/shared/recipe-import-api";

type CreateImageImportInput = {
  importId: string;
  mediaId: string;
  storageKey: string;
  mimeType: string;
  originalFileName?: string;
  sizeBytes: number;
};

type RecipeImportMediaRow = {
  id: string;
  importId: string;
  storageKey: string;
  mimeType: string;
  originalFileName: string | null;
  sizeBytes: number;
  createdAt: string;
};

export class RecipeImportRepository {
  constructor(private readonly db: Database) {}

  createImageImport(input: CreateImageImportInput): RecipeImportMedia {
    const now = new Date().toISOString();
    const insert = this.db.transaction(() => {
      this.db
        .query(`
          INSERT INTO recipe_imports (
            id, source_type, status, created_at, updated_at
          ) VALUES (?, 'image', 'draft', ?, ?)
        `)
        .run(input.importId, now, now);

      this.db
        .query(`
          INSERT INTO recipe_import_media (
            id, import_id, storage_key, mime_type, original_filename, size_bytes, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          input.mediaId,
          input.importId,
          input.storageKey,
          input.mimeType,
          input.originalFileName ?? null,
          input.sizeBytes,
          now,
        );
    });

    insert.immediate();
    return this.getMedia(input.importId, input.mediaId)!;
  }

  getMedia(importId: string, mediaId: string): RecipeImportMedia | undefined {
    const row = this.db
      .query<RecipeImportMediaRow, [string, string]>(`
        SELECT
          id,
          import_id AS importId,
          storage_key AS storageKey,
          mime_type AS mimeType,
          original_filename AS originalFileName,
          size_bytes AS sizeBytes,
          created_at AS createdAt
        FROM recipe_import_media
        WHERE import_id = ? AND id = ?
      `)
      .get(importId, mediaId);

    if (!row) return undefined;
    return {
      id: row.id,
      importId: row.importId,
      storageKey: row.storageKey,
      mimeType: row.mimeType,
      originalFileName: row.originalFileName ?? undefined,
      sizeBytes: row.sizeBytes,
      createdAt: row.createdAt,
    };
  }

  count() {
    return this.db.query<{ count: number }, []>("SELECT count(*) AS count FROM recipe_imports").get()!.count;
  }
}
