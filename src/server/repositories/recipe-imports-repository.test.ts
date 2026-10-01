import { afterEach, describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { openDatabase } from "@/server/db/database";
import { RecipeImportRepository } from "./recipe-imports-repository";

let db: Database | undefined;

afterEach(() => {
  db?.close();
  db = undefined;
});

describe("RecipeImportRepository", () => {
  test("creates an image import and its media together", () => {
    db = openDatabase(":memory:");
    const repository = new RecipeImportRepository(db);

    const media = repository.createImageImport({
      importId: "import-1",
      mediaId: "media-1",
      storageKey: "imports/import-1/media-1.png",
      mimeType: "image/png",
      originalFileName: "recipe.png",
      sizeBytes: 42,
    });

    expect(repository.count()).toBe(1);
    expect(media).toEqual({
      id: "media-1",
      importId: "import-1",
      storageKey: "imports/import-1/media-1.png",
      mimeType: "image/png",
      originalFileName: "recipe.png",
      sizeBytes: 42,
      createdAt: expect.any(String),
    });
    expect(repository.getMedia("import-1", "media-1")).toEqual(media);
  });

  test("rolls back the parent import when media creation fails", () => {
    db = openDatabase(":memory:");
    const repository = new RecipeImportRepository(db);
    repository.createImageImport({
      importId: "import-1",
      mediaId: "media-1",
      storageKey: "duplicate.png",
      mimeType: "image/png",
      sizeBytes: 42,
    });

    expect(() => repository.createImageImport({
      importId: "import-2",
      mediaId: "media-2",
      storageKey: "duplicate.png",
      mimeType: "image/png",
      sizeBytes: 42,
    })).toThrow();
    expect(repository.count()).toBe(1);
  });
});
