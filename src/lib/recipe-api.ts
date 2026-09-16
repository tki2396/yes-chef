import {
  apiErrorResponseSchema,
  createRecipeInputSchema,
  recipeListResponseSchema,
  recipeResponseSchema,
  type CreateRecipeInput,
} from "@/shared/recipe-api";
import type { Recipe } from "@/types/recipe";

export class RecipeApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "RecipeApiError";
  }
}

async function request(input: string, init?: RequestInit) {
  const response = await fetch(input, init);
  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const apiError = apiErrorResponseSchema.safeParse(body);
    throw new RecipeApiError(
      apiError.success ? apiError.data.error.message : "The recipe service returned an unexpected error.",
      response.status,
      apiError.success ? apiError.data.error.code : undefined,
    );
  }

  return body;
}

export async function listRecipes(): Promise<Recipe[]> {
  const body = await request("/api/recipes");
  return recipeListResponseSchema.parse(body).recipes as Recipe[];
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
  const body = await request(`/api/recipes/${encodeURIComponent(recipeId)}`);
  return recipeResponseSchema.parse(body).recipe as Recipe;
}

export async function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  const validatedInput = createRecipeInputSchema.parse(input);
  const body = await request("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedInput),
  });
  return recipeResponseSchema.parse(body).recipe as Recipe;
}
