import type { Database } from "bun:sqlite";
import { recipes as mockRecipes } from "@/data/mockRecipes";
import { RecipeRepository } from "@/server/repositories/recipes";

export function seedDevelopmentData(db: Database) {
  const repository = new RecipeRepository(db);
  if (repository.count() > 0) return 0;

  for (const recipe of mockRecipes) {
    const version = recipe.versions[0];
    repository.create({
      title: recipe.title,
      description: recipe.description,
      status: recipe.status,
      visibility: recipe.visibility,
      sourceLabel: recipe.sourceLabel,
      version: {
        label: version.label,
        source: version.source,
        activeTime: version.activeTime,
        passiveTime: version.passiveTime,
        servings: version.servings,
        ingredients: version.ingredients.map(({ label, amount, notes }) => ({ label, amount, notes })),
        steps: version.steps.map(({ text, duration }) => ({ text, duration })),
        outcomeNotes: version.outcomeNotes,
        rating: version.rating,
        effortRating: version.effortRating,
        tags: recipe.tags,
      },
    });
  }

  return mockRecipes.length;
}
