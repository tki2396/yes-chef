import type { Database } from "bun:sqlite";
import type { Ingredient, Recipe, RecipeStatus, RecipeVersion, RecipeVisibility } from "@/types/recipe";

type RecipeRow = {
  id: string;
  title: string;
  description: string;
  status: RecipeStatus;
  visibility: RecipeVisibility;
  sourceLabel: string | null;
  updatedAt: string;
};

type VersionRow = {
  id: string;
  recipeId: string;
  parentVersionId: string | null;
  label: string;
  createdAt: string;
  source: RecipeVersion["source"];
  visibility: RecipeVisibility;
  roughNotes: string;
  activeTime: string | null;
  passiveTime: string | null;
  servings: string | null;
  outcomeNotes: string | null;
  rating: number | null;
  effortRating: number | null;
};

type IngredientRow = {
  id: string;
  label: string;
  amount: string | null;
  notes: string | null;
};

type StepRow = {
  id: string;
  position: number;
  instruction: string;
  duration: string | null;
};

export type CreateRecipeInput = {
  title: string;
  description?: string;
  status?: RecipeStatus;
  visibility?: RecipeVisibility;
  sourceLabel?: string;
  version?: {
    label?: string;
    source?: RecipeVersion["source"];
    roughNotes?: string;
    activeTime?: string;
    passiveTime?: string;
    servings?: string;
    ingredients?: Array<Omit<Ingredient, "id">>;
    steps?: Array<{ text: string; duration?: string }>;
    outcomeNotes?: string;
    rating?: number;
    effortRating?: number;
    tags?: string[];
  };
};

export class RecipeRepository {
  constructor(private readonly db: Database) {}

  list(): Recipe[] {
    const rows = this.db
      .query<RecipeRow, []>(`
        SELECT
          id,
          title,
          description,
          status,
          visibility,
          source_label AS sourceLabel,
          updated_at AS updatedAt
        FROM recipes
        ORDER BY updated_at DESC, title COLLATE NOCASE
      `)
      .all();

    return rows.map(row => this.hydrate(row));
  }

  get(recipeId: string): Recipe | undefined {
    const row = this.db
      .query<RecipeRow, [string]>(`
        SELECT
          id,
          title,
          description,
          status,
          visibility,
          source_label AS sourceLabel,
          updated_at AS updatedAt
        FROM recipes
        WHERE id = ?
      `)
      .get(recipeId);

    return row ? this.hydrate(row) : undefined;
  }

  create(input: CreateRecipeInput): Recipe {
    const recipeId = crypto.randomUUID();
    const versionId = crypto.randomUUID();
    const now = new Date().toISOString();
    const version = input.version ?? {};

    const insert = this.db.transaction(() => {
      this.db
        .query(`
          INSERT INTO recipes (
            id, title, description, status, visibility, source_label, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          recipeId,
          input.title.trim(),
          input.description?.trim() ?? "",
          input.status ?? "draft",
          input.visibility ?? "private",
          input.sourceLabel ?? null,
          now,
          now,
        );

      this.db
        .query(`
          INSERT INTO recipe_versions (
            id, recipe_id, label, source, visibility, rough_notes, active_time,
            passive_time, servings, outcome_notes, rating, effort_rating, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          versionId,
          recipeId,
          version.label ?? "Original",
          version.source ?? "manual",
          input.visibility ?? "private",
          version.roughNotes?.trim() ?? "",
          version.activeTime ?? null,
          version.passiveTime ?? null,
          version.servings ?? null,
          version.outcomeNotes ?? null,
          version.rating ?? null,
          version.effortRating ?? null,
          now,
          now,
        );

      for (const [position, ingredient] of (version.ingredients ?? []).entries()) {
        this.db
          .query(`
            INSERT INTO recipe_ingredients (
              id, recipe_version_id, position, label, amount, notes
            ) VALUES (?, ?, ?, ?, ?, ?)
          `)
          .run(
            crypto.randomUUID(),
            versionId,
            position,
            ingredient.label.trim(),
            ingredient.amount ?? null,
            ingredient.notes ?? null,
          );
      }

      for (const [position, step] of (version.steps ?? []).entries()) {
        this.db
          .query(`
            INSERT INTO recipe_steps (
              id, recipe_version_id, position, instruction, duration
            ) VALUES (?, ?, ?, ?, ?)
          `)
          .run(crypto.randomUUID(), versionId, position, step.text.trim(), step.duration ?? null);
      }

      for (const tagName of new Set((version.tags ?? []).map(tag => tag.trim()).filter(Boolean))) {
        const tagId = crypto.randomUUID();
        this.db.query("INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)").run(tagId, tagName);
        const tag = this.db.query<{ id: string }, [string]>("SELECT id FROM tags WHERE name = ? COLLATE NOCASE").get(tagName);
        this.db
          .query("INSERT OR IGNORE INTO recipe_version_tags (recipe_version_id, tag_id) VALUES (?, ?)")
          .run(versionId, tag!.id);
      }
    });

    insert.immediate();
    return this.get(recipeId)!;
  }

  count() {
    return this.db.query<{ count: number }, []>("SELECT count(*) AS count FROM recipes").get()!.count;
  }

  private hydrate(row: RecipeRow): Recipe {
    const versions = this.db
      .query<VersionRow, [string]>(`
        SELECT
          id,
          recipe_id AS recipeId,
          parent_version_id AS parentVersionId,
          label,
          created_at AS createdAt,
          source,
          visibility,
          rough_notes AS roughNotes,
          active_time AS activeTime,
          passive_time AS passiveTime,
          servings,
          outcome_notes AS outcomeNotes,
          rating,
          effort_rating AS effortRating
        FROM recipe_versions
        WHERE recipe_id = ?
        ORDER BY created_at DESC, id
      `)
      .all(row.id)
      .map(version => this.hydrateVersion(version));

    const tags = this.db
      .query<{ name: string }, [string]>(`
        SELECT DISTINCT tags.name
        FROM tags
        JOIN recipe_version_tags ON recipe_version_tags.tag_id = tags.id
        JOIN recipe_versions ON recipe_versions.id = recipe_version_tags.recipe_version_id
        WHERE recipe_versions.recipe_id = ?
        ORDER BY tags.name COLLATE NOCASE
      `)
      .all(row.id)
      .map(tag => tag.name);

    const mediaCount = this.db
      .query<{ count: number }, [string, string]>(`
        SELECT count(*) AS count
        FROM recipe_media
        WHERE recipe_id = ?
           OR recipe_version_id IN (SELECT id FROM recipe_versions WHERE recipe_id = ?)
      `)
      .get(row.id, row.id)!.count;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      visibility: row.visibility,
      tags,
      updatedAt: row.updatedAt,
      sourceLabel: row.sourceLabel ?? undefined,
      mediaCount,
      versions,
    };
  }

  private hydrateVersion(row: VersionRow): RecipeVersion {
    const ingredients = this.db
      .query<IngredientRow, [string]>(`
        SELECT id, label, amount, notes
        FROM recipe_ingredients
        WHERE recipe_version_id = ?
        ORDER BY position
      `)
      .all(row.id)
      .map(ingredient => ({
        id: ingredient.id,
        label: ingredient.label,
        amount: ingredient.amount ?? undefined,
        notes: ingredient.notes ?? undefined,
      }));

    const steps = this.db
      .query<StepRow, [string]>(`
        SELECT id, position, instruction, duration
        FROM recipe_steps
        WHERE recipe_version_id = ?
        ORDER BY position
      `)
      .all(row.id)
      .map(step => ({
        id: step.id,
        order: step.position + 1,
        text: step.instruction,
        duration: step.duration ?? undefined,
      }));

    return {
      id: row.id,
      recipeId: row.recipeId,
      parentVersionId: row.parentVersionId ?? undefined,
      label: row.label,
      createdAt: row.createdAt,
      source: row.source,
      visibility: row.visibility,
      roughNotes: row.roughNotes || undefined,
      activeTime: row.activeTime ?? undefined,
      passiveTime: row.passiveTime ?? undefined,
      servings: row.servings ?? undefined,
      ingredients,
      steps,
      outcomeNotes: row.outcomeNotes ?? undefined,
      rating: row.rating ?? undefined,
      effortRating: row.effortRating ?? undefined,
    };
  }
}
