import type { SQLiteDatabase } from 'expo-sqlite';

const LATEST_VERSION = 1;

/**
 * Runs on app start via SQLiteProvider's onInit. Uses SQLite's own user_version
 * pragma to track migrations so future schema changes can append a new block
 * without touching existing installs.
 */
export async function migrate(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = result?.user_version ?? 0;

  if (version >= LATEST_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE recipes (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        image_url TEXT,
        source_url TEXT,
        source_platform TEXT,
        source_author TEXT,
        servings INTEGER NOT NULL DEFAULT 2,
        prep_minutes INTEGER,
        cook_minutes INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        quantity REAL,
        unit TEXT,
        name TEXT NOT NULL,
        note TEXT,
        category TEXT
      );

      CREATE TABLE steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        text TEXT NOT NULL
      );

      CREATE INDEX idx_ingredients_recipe ON ingredients(recipe_id);
      CREATE INDEX idx_steps_recipe ON steps(recipe_id);
      CREATE UNIQUE INDEX idx_recipes_source ON recipes(source_url);
    `);
    version = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${version}`);
}
