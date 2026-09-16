import { afterEach, describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { openDatabase } from "./database";
import { getAppliedMigrations, migrateDatabase } from "./migrate";

let db: Database | undefined;

afterEach(() => {
  db?.close();
  db = undefined;
});

describe("database migrations", () => {
  test("apply once and leave foreign keys enabled", () => {
    db = openDatabase(":memory:");

    expect(getAppliedMigrations(db).map(migration => migration.name)).toEqual(["001_initial_schema.sql"]);
    expect(migrateDatabase(db)).toEqual([]);
    expect(db.query<{ foreign_keys: number }, []>("PRAGMA foreign_keys").get()!.foreign_keys).toBe(1);
  });
});
