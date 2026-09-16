import { serve } from "bun";
import index from "./index.html";
import { getAppDatabase } from "./server/db/database";
import { createRecipeApi } from "./server/api/recipes";
import { RecipeRepository } from "./server/repositories/recipes";

const database = getAppDatabase({ seedNewDatabase: process.env.NODE_ENV !== "production" });
const recipeApi = createRecipeApi(new RecipeRepository(database));
const developmentIndex = index;

async function productionAsset(request: Request): Promise<Response> {
  const pathname = decodeURIComponent(new URL(request.url).pathname);
  const relativePath = pathname.replace(/^\/+/, "");

  if (relativePath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const asset = Bun.file(`./dist/${relativePath || "index.html"}`);
  if (await asset.exists()) {
    return new Response(asset);
  }

  return new Response(Bun.file("./dist/index.html"));
}

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

    // Development serves the HTML entrypoint directly. Production serves the
    // compiled assets and falls back to dist/index.html for client-side routes.
    "/*": process.env.NODE_ENV === "production" ? productionAsset : developmentIndex,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
