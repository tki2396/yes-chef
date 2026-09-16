import {
  createRecipeInputSchema,
  type ApiErrorResponse,
  type RecipeListResponse,
  type RecipeResponse,
} from "@/shared/recipe-api";
import type { RecipeRepository } from "@/server/repositories/recipes";

function json<T>(body: T, init?: ResponseInit) {
  return Response.json(body, init);
}

function apiError(
  status: number,
  code: ApiErrorResponse["error"]["code"],
  message: string,
  issues?: ApiErrorResponse["error"]["issues"],
) {
  return json<ApiErrorResponse>({ error: { code, message, ...(issues ? { issues } : {}) } }, { status });
}

export function createRecipeApi(repository: RecipeRepository) {
  return {
    list() {
      try {
        return json<RecipeListResponse>({ recipes: repository.list() });
      } catch (error) {
        console.error("Unable to list recipes", error);
        return apiError(500, "internal_error", "Unable to load recipes.");
      }
    },

    detail(recipeId: string) {
      try {
        const recipe = repository.get(recipeId);
        if (!recipe) return apiError(404, "recipe_not_found", "Recipe not found.");
        return json<RecipeResponse>({ recipe });
      } catch (error) {
        console.error("Unable to load recipe", error);
        return apiError(500, "internal_error", "Unable to load the recipe.");
      }
    },

    async create(request: Request) {
      let body: unknown;

      try {
        body = await request.json();
      } catch {
        return apiError(400, "invalid_json", "Request body must be valid JSON.");
      }

      const result = createRecipeInputSchema.safeParse(body);
      if (!result.success) {
        return apiError(
          400,
          "validation_failed",
          "Recipe details are invalid.",
          result.error.issues.map(issue => ({ path: issue.path, message: issue.message })),
        );
      }

      try {
        const recipe = repository.create(result.data);
        return json<RecipeResponse>(
          { recipe },
          { status: 201, headers: { Location: `/api/recipes/${recipe.id}` } },
        );
      } catch (error) {
        console.error("Unable to create recipe", error);
        return apiError(500, "internal_error", "Unable to save the recipe.");
      }
    },
  };
}
