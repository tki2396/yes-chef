CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'public')),
  source_label TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE recipe_versions (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  parent_version_id TEXT REFERENCES recipe_versions(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'import', 'variation')),
  visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'public')),
  rough_notes TEXT NOT NULL DEFAULT '',
  active_time TEXT,
  passive_time TEXT,
  servings TEXT,
  outcome_notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  effort_rating INTEGER CHECK (effort_rating BETWEEN 1 AND 5),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX recipe_versions_recipe_id_idx
  ON recipe_versions(recipe_id, created_at DESC);
CREATE INDEX recipe_versions_parent_version_id_idx
  ON recipe_versions(parent_version_id);

CREATE TABLE recipe_ingredients (
  id TEXT PRIMARY KEY,
  recipe_version_id TEXT NOT NULL REFERENCES recipe_versions(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL CHECK (length(trim(label)) > 0),
  amount TEXT,
  notes TEXT,
  UNIQUE (recipe_version_id, position)
);

CREATE INDEX recipe_ingredients_version_id_idx
  ON recipe_ingredients(recipe_version_id, position);

CREATE TABLE recipe_steps (
  id TEXT PRIMARY KEY,
  recipe_version_id TEXT NOT NULL REFERENCES recipe_versions(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  instruction TEXT NOT NULL CHECK (length(trim(instruction)) > 0),
  duration TEXT,
  UNIQUE (recipe_version_id, position)
);

CREATE INDEX recipe_steps_version_id_idx
  ON recipe_steps(recipe_version_id, position);

CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name)) > 0)
);

CREATE TABLE recipe_version_tags (
  recipe_version_id TEXT NOT NULL REFERENCES recipe_versions(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_version_id, tag_id)
);

CREATE TABLE recipe_imports (
  id TEXT PRIMARY KEY,
  recipe_id TEXT REFERENCES recipes(id) ON DELETE SET NULL,
  recipe_version_id TEXT REFERENCES recipe_versions(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL
    CHECK (source_type IN ('text', 'url', 'image', 'pdf', 'verbal', 'other')),
  source_url TEXT,
  raw_content TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'needs_review', 'saved', 'failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE recipe_media (
  id TEXT PRIMARY KEY,
  recipe_id TEXT REFERENCES recipes(id) ON DELETE CASCADE,
  recipe_version_id TEXT REFERENCES recipe_versions(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image'
    CHECK (media_type IN ('image', 'document', 'video', 'other')),
  caption TEXT,
  created_at TEXT NOT NULL,
  CHECK (recipe_id IS NOT NULL OR recipe_version_id IS NOT NULL)
);

CREATE INDEX recipe_media_recipe_id_idx ON recipe_media(recipe_id);
CREATE INDEX recipe_media_version_id_idx ON recipe_media(recipe_version_id);
