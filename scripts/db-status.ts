import { getAppDatabase } from "@/server/db/database";
import { getAppliedMigrations } from "@/server/db/migrate";
import { RecipeRepository } from "@/server/repositories/recipes";

const db = getAppDatabase();
const migrations = getAppliedMigrations(db);
const recipes = new RecipeRepository(db).count();

console.log(`Database: ${process.env.YES_CHEF_DB_PATH || "data/yes-chef.sqlite"}`);
console.log(`Migrations: ${migrations.length}`);
for (const migration of migrations) console.log(`  ${migration.name}`);
console.log(`Recipes: ${recipes}`);
