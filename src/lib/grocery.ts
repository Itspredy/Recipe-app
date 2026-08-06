import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Recipe } from './types';

const SELECTED_KEY = 'grocery.selectedRecipeIds';
const CHECKED_KEY = 'grocery.checkedKeys';

export async function getSelectedRecipeIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SELECTED_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function setSelectedRecipeIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(SELECTED_KEY, JSON.stringify(ids));
}

export async function getCheckedKeys(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(CHECKED_KEY);
  return new Set(raw ? (JSON.parse(raw) as string[]) : []);
}

export async function setCheckedKeys(keys: Set<string>): Promise<void> {
  await AsyncStorage.setItem(CHECKED_KEY, JSON.stringify([...keys]));
}

export type GroceryLine = { quantity: number | null; unit: string | null; recipeTitle: string };

export type GroceryItem = {
  key: string;
  name: string;
  category: string | null;
  lines: GroceryLine[];
};

/**
 * Aggregates ingredients across every selected recipe, grouped by normalized
 * name. Quantities are summed only when both the ingredient name and unit
 * match exactly across recipes (e.g. "2 cups flour" + "1 cup flour" -> "3
 * cups flour"); anything else — no quantity, mismatched units — is kept as a
 * separate line under the same ingredient so nothing is silently lost to bad
 * unit-conversion guesses.
 */
export function aggregateIngredients(recipes: Recipe[]): GroceryItem[] {
  const items = new Map<string, GroceryItem>();

  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const key = ing.name.trim().toLowerCase();
      const existing = items.get(key);
      const item = existing ?? { key, name: ing.name.trim(), category: ing.category, lines: [] };

      const sameUnitLine = item.lines.find(
        (l) => l.unit === ing.unit && ing.quantity !== null && l.quantity !== null,
      );
      if (sameUnitLine && ing.quantity !== null) {
        sameUnitLine.quantity = (sameUnitLine.quantity ?? 0) + ing.quantity;
      } else {
        item.lines.push({ quantity: ing.quantity, unit: ing.unit, recipeTitle: recipe.title });
      }

      if (!existing) items.set(key, item);
    }
  }

  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name));
}
