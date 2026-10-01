import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { apiErrorResponseSchema } from "@/shared/api-errors";
import { recipeImportResponseSchema } from "@/shared/recipe-import-api";
import { openDatabase } from "@/server/db/database";
import { RecipeImportRepository } from "@/server/repositories/recipe-imports-repository";
import { RecipeImportFileStorage } from "@/server/storage/recipe-import-files";
import { recipeImportApi } from "./recipe-imports";

let database: Database;
let repository: RecipeImportRepository;
let uploadDirectory: string;
let storage: RecipeImportFileStorage;
let api: ReturnType<typeof recipeImportApi>;

beforeEach(async () => {
  database = openDatabase(":memory:");
  repository = new RecipeImportRepository(database);
  uploadDirectory = await mkdtemp(path.join(tmpdir(), "yes-chef-upload-test-"));
  storage = new RecipeImportFileStorage(uploadDirectory);
  api = recipeImportApi(repository, storage);
});

afterEach(async () => {
  database.close();
  await rm(uploadDirectory, { recursive: true, force: true });
});

function uploadRequest(file?: File) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return new Request("http://localhost/api/imports", { method: "POST", body: formData });
}

describe("recipe import API", () => {
  test("stores a valid screenshot and creates its draft import", async () => {
    const png = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      "recipe.png",
      { type: "image/png" },
    );

    const response = await api.upload(uploadRequest(png));
    const body = recipeImportResponseSchema.parse(await response.json());
    const media = repository.getMedia(body.importId, body.mediaId)!;

    expect(response.status).toBe(201);
    expect(repository.count()).toBe(1);
    expect(media.originalFileName).toBe("recipe.png");
    expect(media.mimeType).toBe("image/png");
    expect(await Bun.file(storage.resolve(media.storageKey)).exists()).toBe(true);
  });

  test("rejects a file whose contents do not match its image type", async () => {
    const fakePng = new File(["not an image"], "recipe.png", { type: "image/png" });
    const response = await api.upload(uploadRequest(fakePng));
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_file_type");
    expect(repository.count()).toBe(0);
  });

  test("requires an uploaded file", async () => {
    const response = await api.upload(uploadRequest());
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("missing_file");
  });
});
