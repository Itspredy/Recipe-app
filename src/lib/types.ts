export type Ingredient = {
  quantity: number | null;
  unit: string | null;
  name: string;
  note: string | null;
  category: string | null;
};

export type Step = {
  text: string;
};

/** Shape returned by the import backend. */
export type ImportedRecipe = {
  title: string;
  description: string;
  servings: number;
  prepMinutes: number | null;
  cookMinutes: number | null;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  imageUrl: string | null;
  sourceUrl: string;
  sourcePlatform: string;
  sourceAuthor: string | null;
};

/** A recipe as stored locally, with its children. */
export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourcePlatform: string | null;
  sourceAuthor: string | null;
  servings: number;
  prepMinutes: number | null;
  cookMinutes: number | null;
  tags: string[];
  isFavorite: boolean;
  notes: string;
  rating: number; // 0–5, 0 means unrated
  cookedCount: number;
  lastCookedAt: number | null;
  createdAt: number;
  ingredients: Ingredient[];
  steps: Step[];
};

/** Home-list item — omits ingredients/steps so lists stay light. */
export type RecipeSummary = {
  id: string;
  title: string;
  imageUrl: string | null;
  sourcePlatform: string | null;
  sourceAuthor: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  tags: string[];
  isFavorite: boolean;
  cookedCount: number;
  lastCookedAt: number | null;
  createdAt: number;
};

export function totalMinutes(r: {
  prepMinutes: number | null;
  cookMinutes: number | null;
}): number {
  return (r.prepMinutes ?? 0) + (r.cookMinutes ?? 0);
}

export function difficultyLabel(r: {
  prepMinutes: number | null;
  cookMinutes: number | null;
}): string {
  const t = totalMinutes(r);
  if (t === 0) return 'Easy';
  if (t <= 30) return 'Easy';
  if (t <= 75) return 'Medium';
  return 'Patient';
}
