import { afterEach, describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { openDatabase } from "@/server/db/database";
import { RecipeRepository } from "./recipes";

let db: Database | undefined;

afterEach(() => {
  db?.close();
  db = undefined;
});

describe("RecipeRepository", () => {
  test("creates and reads a private recipe with a version", () => {
    db = openDatabase(":memory:");
    const recipes = new RecipeRepository(db);

    const created = recipes.create({
      title: "  Tomato toast  ",
      description: "A flexible lunch",
      version: {
        roughNotes: "Use whatever bread is around.",
        ingredients: [
          { label: "tomatoes", amount: "a few" },
          { label: "bread", notes: "stale is fine" },
        ],
        steps: [{ text: "Toast the bread." }, { text: "Pile on tomatoes.", duration: "2 min" }],
        substitutionNotes: ["Any sturdy bread works."],
        tags: ["lunch", "quick", "QUICK"],
      },
      media: [{ dataUrl: "data:image/png;base64,aGVsbG8=", caption: "Lunch" }],
    });

    expect(created.title).toBe("Tomato toast");
    expect(created.visibility).toBe("private");
    expect(created.versions).toHaveLength(1);
    expect(created.versions[0].ingredients[0].amount).toBe("a few");
    expect(created.versions[0].steps[1].order).toBe(2);
    expect(created.versions[0].substitutionNotes).toEqual(["Any sturdy bread works."]);
    expect(created.tags).toEqual(["lunch", "quick"]);
    expect(created.media).toHaveLength(1);
    expect(created.media[0].caption).toBe("Lunch");
    expect(recipes.getMedia(created.id, created.media[0].id)?.storageKey).toBe("data:image/png;base64,aGVsbG8=");
    expect(recipes.get(created.id)).toEqual(created);
    expect(recipes.list()).toEqual([created]);
  });

  test("rolls back the recipe when nested data is invalid", () => {
    db = openDatabase(":memory:");
    const recipes = new RecipeRepository(db);

    expect(() =>
      recipes.create({
        title: "Broken recipe",
        version: { ingredients: [{ label: "   " }] },
      }),
    ).toThrow();
    expect(recipes.count()).toBe(0);
  });
});
