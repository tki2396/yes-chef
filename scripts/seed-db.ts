import { getAppDatabase } from "@/server/db/database";
import { seedDevelopmentData } from "@/server/db/seed";

const count = seedDevelopmentData(getAppDatabase());
console.log(count ? `Seeded ${count} recipes.` : "Database already contains recipes; nothing was changed.");
