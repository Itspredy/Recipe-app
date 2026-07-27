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

/** A recipe row as stored locally, with its children loaded. */
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
  createdAt: number;
  ingredients: Ingredient[];
  steps: Step[];
};

/** Home-screen list item — no ingredients/steps, so the list query stays cheap. */
export type RecipeSummary = {
  id: string;
  title: string;
  imageUrl: string | null;
  sourcePlatform: string | null;
  sourceAuthor: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  createdAt: number;
};
