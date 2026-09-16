import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { apiErrorResponseSchema, recipeListResponseSchema, recipeResponseSchema } from "@/shared/recipe-api";
import { openDatabase } from "@/server/db/database";
import { RecipeRepository } from "@/server/repositories/recipes";
import { createRecipeApi } from "./recipes";

let database: Database;
let api: ReturnType<typeof createRecipeApi>;

beforeEach(() => {
  database = openDatabase(":memory:");
  api = createRecipeApi(new RecipeRepository(database));
});

afterEach(() => database.close());

describe("recipe API", () => {
  test("lists recipes", async () => {
    const response = api.list();

    expect(response.status).toBe(200);
    expect(recipeListResponseSchema.parse(await response.json())).toEqual({ recipes: [] });
  });

  test("creates and retrieves a recipe", async () => {
    const createResponse = await api.create(
      new Request("http://localhost/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "  Tomato toast  ",
          description: "Fast lunch",
          version: {
            roughNotes: "Use any bread.",
            ingredients: [{ label: " tomatoes ", amount: "a few" }],
            steps: [{ text: " Toast the bread. " }],
            tags: ["quick"],
          },
        }),
      }),
    );

    expect(createResponse.status).toBe(201);
    const created = recipeResponseSchema.parse(await createResponse.json()).recipe;
    expect(created.title).toBe("Tomato toast");
    expect(created.versions[0].ingredients[0].label).toBe("tomatoes");
    expect(createResponse.headers.get("Location")).toBe(`/api/recipes/${created.id}`);

    const detailResponse = api.detail(created.id);
    expect(detailResponse.status).toBe(200);
    expect(recipeResponseSchema.parse(await detailResponse.json()).recipe).toEqual(created);
  });

  test("reports invalid JSON", async () => {
    const response = await api.create(
      new Request("http://localhost/api/recipes", { method: "POST", body: "{" }),
    );
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_json");
  });

  test("reports validation issues", async () => {
    const response = await api.create(
      new Request("http://localhost/api/recipes", {
        method: "POST",
        body: JSON.stringify({ title: "   ", version: { rating: 6 } }),
      }),
    );
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("validation_failed");
    expect(body.error.issues?.map(issue => issue.path.join("."))).toEqual(["title", "version.rating"]);
  });

  test("returns a consistent not-found response", async () => {
    const response = api.detail("missing");
    const body = apiErrorResponseSchema.parse(await response.json());

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("recipe_not_found");
  });
});
