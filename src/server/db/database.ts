import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { migrateDatabase } from "./migrate";
import { seedDevelopmentData } from "./seed";

const defaultDatabasePath = path.join(process.cwd(), "data", "yes-chef.sqlite");

let appDatabase: Database | undefined;

export function openDatabase(databasePath = defaultDatabasePath) {
  if (databasePath !== ":memory:") {
    mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const db = new Database(databasePath, { create: true, strict: true });
  db.run("PRAGMA foreign_keys = ON");
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA busy_timeout = 5000");
  migrateDatabase(db);
  return db;
}

export function getAppDatabase(options: { seedNewDatabase?: boolean } = {}) {
  if (!appDatabase) {
    const databasePath = process.env.YES_CHEF_DB_PATH || defaultDatabasePath;
    const isNewDatabase = databasePath !== ":memory:" && !existsSync(databasePath);
    appDatabase = openDatabase(databasePath);

    if (isNewDatabase && options.seedNewDatabase) {
      seedDevelopmentData(appDatabase);
    }
  }

  return appDatabase;
}

export function closeAppDatabase() {
  appDatabase?.close();
  appDatabase = undefined;
}
