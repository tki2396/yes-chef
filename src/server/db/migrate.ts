import { CryptoHasher } from "bun";
import type { Database } from "bun:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type AppliedMigration = {
  name: string;
  checksum: string;
  appliedAt: string;
};

const migrationDirectory = path.join(import.meta.dir, "migrations");

function checksum(contents: string) {
  return new CryptoHasher("sha256").update(contents).digest("hex");
}

function migrationFiles() {
  return readdirSync(migrationDirectory)
    .filter(name => /^\d+_[a-z0-9_]+\.sql$/.test(name))
    .sort((left, right) => left.localeCompare(right));
}

export function getAppliedMigrations(db: Database): AppliedMigration[] {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);

  return db
    .query<AppliedMigration, []>(`
      SELECT name, checksum, applied_at AS appliedAt
      FROM schema_migrations
      ORDER BY name
    `)
    .all();
}

export function migrateDatabase(db: Database) {
  const applied = new Map(getAppliedMigrations(db).map(migration => [migration.name, migration]));
  const appliedNow: string[] = [];

  for (const name of migrationFiles()) {
    const sql = readFileSync(path.join(migrationDirectory, name), "utf8");
    const migrationChecksum = checksum(sql);
    const existing = applied.get(name);

    if (existing) {
      if (existing.checksum !== migrationChecksum) {
        throw new Error(`Migration ${name} changed after it was applied.`);
      }
      continue;
    }

    const apply = db.transaction(() => {
      db.run(sql);
      db.query("INSERT INTO schema_migrations (name, checksum, applied_at) VALUES (?, ?, ?)").run(
        name,
        migrationChecksum,
        new Date().toISOString(),
      );
    });

    apply.immediate();
    appliedNow.push(name);
  }

  return appliedNow;
}
