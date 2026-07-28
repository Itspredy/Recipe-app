import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_RECIPES } from '../lib/seed';
import type { ImportedRecipe, Recipe, RecipeSummary } from '../lib/types';

/**
 * On-device storage. Recipes live under a single AsyncStorage key as a JSON map,
 * which is plenty for a personal cookbook and — unlike SQLite — runs unchanged in
 * Expo Go and in the browser preview with no native build.
 */

const KEY = 'recipe.recipes.v1';
const SEED_FLAG = 'recipe.seeded.v1';

type RecipeMap = Record<string, Recipe>;

let cache: RecipeMap | null = null;

async function readAll(): Promise<RecipeMap> {
  if (cache) return cache;

  const seeded = await AsyncStorage.getItem(SEED_FLAG);
  const raw = await AsyncStorage.getItem(KEY);

  if (!seeded && !raw) {
    const map: RecipeMap = {};
    for (const r of SEED_RECIPES) map[r.id] = r;
    await AsyncStorage.multiSet([
      [KEY, JSON.stringify(map)],
      [SEED_FLAG, '1'],
    ]);
    cache = map;
    return map;
  }

  cache = raw ? (JSON.parse(raw) as RecipeMap) : {};
  return cache;
}

async function writeAll(map: RecipeMap): Promise<void> {
  cache = map;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

function toSummary(r: Recipe): RecipeSummary {
  return {
    id: r.id,
    title: r.title,
    imageUrl: r.imageUrl,
    sourcePlatform: r.sourcePlatform,
    sourceAuthor: r.sourceAuthor,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    tags: r.tags,
    isFavorite: r.isFavorite,
    cookedCount: r.cookedCount,
    lastCookedAt: r.lastCookedAt,
    createdAt: r.createdAt,
  };
}

export async function listRecipes(): Promise<RecipeSummary[]> {
  const map = await readAll();
  return Object.values(map)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(toSummary);
}

export async function listCooked(): Promise<RecipeSummary[]> {
  const map = await readAll();
  return Object.values(map)
    .filter((r) => r.lastCookedAt !== null)
    .sort((a, b) => (b.lastCookedAt ?? 0) - (a.lastCookedAt ?? 0))
    .map(toSummary);
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const map = await readAll();
  return map[id] ?? null;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Save an imported recipe; reuses an existing row for the same source link. */
export async function saveImported(imported: ImportedRecipe): Promise<string> {
  const map = await readAll();

  if (imported.sourceUrl) {
    const existing = Object.values(map).find((r) => r.sourceUrl === imported.sourceUrl);
    if (existing) return existing.id;
  }

  const id = newId();
  map[id] = {
    id,
    title: imported.title,
    description: imported.description ?? '',
    imageUrl: imported.imageUrl,
    sourceUrl: imported.sourceUrl,
    sourcePlatform: imported.sourcePlatform,
    sourceAuthor: imported.sourceAuthor,
    servings: imported.servings ?? 2,
    prepMinutes: imported.prepMinutes,
    cookMinutes: imported.cookMinutes,
    tags: imported.tags ?? [],
    isFavorite: false,
    notes: '',
    rating: 0,
    cookedCount: 0,
    lastCookedAt: null,
    createdAt: Date.now(),
    ingredients: imported.ingredients ?? [],
    steps: imported.steps ?? [],
  };
  await writeAll(map);
  return id;
}

/** Save a recipe the user typed in by hand. */
export async function saveManual(
  input: Pick<
    Recipe,
    'title' | 'description' | 'servings' | 'prepMinutes' | 'cookMinutes' | 'tags' | 'ingredients' | 'steps'
  >,
): Promise<string> {
  const map = await readAll();
  const id = newId();
  map[id] = {
    id,
    imageUrl: null,
    sourceUrl: null,
    sourcePlatform: 'manual',
    sourceAuthor: null,
    isFavorite: false,
    notes: '',
    rating: 0,
    cookedCount: 0,
    lastCookedAt: null,
    createdAt: Date.now(),
    ...input,
  };
  await writeAll(map);
  return id;
}

export async function findBySourceUrl(sourceUrl: string): Promise<string | null> {
  const map = await readAll();
  return Object.values(map).find((r) => r.sourceUrl === sourceUrl)?.id ?? null;
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const map = await readAll();
  const r = map[id];
  if (!r) return false;
  r.isFavorite = !r.isFavorite;
  await writeAll(map);
  return r.isFavorite;
}

export async function saveNotes(id: string, notes: string): Promise<void> {
  const map = await readAll();
  if (!map[id]) return;
  map[id].notes = notes;
  await writeAll(map);
}

export async function markCooked(id: string, rating: number): Promise<void> {
  const map = await readAll();
  const r = map[id];
  if (!r) return;
  r.cookedCount += 1;
  r.lastCookedAt = Date.now();
  if (rating > 0) r.rating = rating;
  await writeAll(map);
}

export async function deleteRecipe(id: string): Promise<void> {
  const map = await readAll();
  delete map[id];
  await writeAll(map);
}
