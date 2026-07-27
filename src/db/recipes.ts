import type { SQLiteDatabase } from 'expo-sqlite';
import type { ImportedRecipe, Ingredient, Recipe, RecipeSummary, Step } from '../lib/types';

type RecipeRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  source_url: string | null;
  source_platform: string | null;
  source_author: string | null;
  servings: number;
  prep_minutes: number | null;
  cook_minutes: number | null;
  created_at: number;
};

type IngredientRow = {
  quantity: number | null;
  unit: string | null;
  name: string;
  note: string | null;
  category: string | null;
};

export async function saveRecipe(db: SQLiteDatabase, imported: ImportedRecipe): Promise<string> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // One transaction so a partial write can never leave a recipe without its
  // ingredients or steps.
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO recipes
         (id, title, description, image_url, source_url, source_platform, source_author,
          servings, prep_minutes, cook_minutes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      imported.title,
      imported.description ?? '',
      imported.imageUrl,
      imported.sourceUrl,
      imported.sourcePlatform,
      imported.sourceAuthor,
      imported.servings ?? 2,
      imported.prepMinutes,
      imported.cookMinutes,
      Date.now(),
    );

    for (const [index, ingredient] of imported.ingredients.entries()) {
      await db.runAsync(
        `INSERT INTO ingredients (recipe_id, position, quantity, unit, name, note, category)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        id,
        index,
        ingredient.quantity,
        ingredient.unit,
        ingredient.name,
        ingredient.note,
        ingredient.category ?? null,
      );
    }

    for (const [index, step] of imported.steps.entries()) {
      await db.runAsync(
        'INSERT INTO steps (recipe_id, position, text) VALUES (?, ?, ?)',
        id,
        index,
        step.text,
      );
    }
  });

  return id;
}

export async function listRecipes(db: SQLiteDatabase): Promise<RecipeSummary[]> {
  const rows = await db.getAllAsync<RecipeRow>(
    `SELECT id, title, image_url, source_platform, source_author, prep_minutes, cook_minutes, created_at
     FROM recipes ORDER BY created_at DESC`,
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    sourcePlatform: row.source_platform,
    sourceAuthor: row.source_author,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    createdAt: row.created_at,
  }));
}

export async function getRecipe(db: SQLiteDatabase, id: string): Promise<Recipe | null> {
  const row = await db.getFirstAsync<RecipeRow>('SELECT * FROM recipes WHERE id = ?', id);
  if (!row) return null;

  const ingredients = await db.getAllAsync<IngredientRow>(
    'SELECT quantity, unit, name, note, category FROM ingredients WHERE recipe_id = ? ORDER BY position',
    id,
  );
  const steps = await db.getAllAsync<Step>(
    'SELECT text FROM steps WHERE recipe_id = ? ORDER BY position',
    id,
  );

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    sourceUrl: row.source_url,
    sourcePlatform: row.source_platform,
    sourceAuthor: row.source_author,
    servings: row.servings,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    createdAt: row.created_at,
    ingredients: ingredients as Ingredient[],
    steps,
  };
}

/** Lets the import flow skip re-processing a link the user already saved. */
export async function findBySourceUrl(db: SQLiteDatabase, sourceUrl: string): Promise<string | null> {
  const row = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM recipes WHERE source_url = ?',
    sourceUrl,
  );
  return row?.id ?? null;
}

export async function deleteRecipe(db: SQLiteDatabase, id: string) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM ingredients WHERE recipe_id = ?', id);
    await db.runAsync('DELETE FROM steps WHERE recipe_id = ?', id);
    await db.runAsync('DELETE FROM recipes WHERE id = ?', id);
  });
}
