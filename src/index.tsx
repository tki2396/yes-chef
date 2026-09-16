import { serve } from "bun";
import index from "./index.html";
import { getAppDatabase } from "./server/db/database";
import { createRecipeApi } from "./server/api/recipes";
import { RecipeRepository } from "./server/repositories/recipes";

const database = getAppDatabase({ seedNewDatabase: process.env.NODE_ENV !== "production" });
const recipeApi = createRecipeApi(new RecipeRepository(database));

const server = serve({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  routes: {
    "/api/recipes": {
      GET: () => recipeApi.list(),
      POST: request => recipeApi.create(request),
    },

    "/api/recipes/:id": {
      GET: request => recipeApi.detail(request.params.id),
    },

    // Serve index.html for all unmatched application routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
