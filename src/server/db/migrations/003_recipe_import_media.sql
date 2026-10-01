CREATE TABLE recipe_import_media (
  id TEXT PRIMARY KEY,
  import_id TEXT NOT NULL
    REFERENCES recipe_imports(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  original_filename TEXT,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX recipe_import_media_import_id_idx
  ON recipe_import_media(import_id);