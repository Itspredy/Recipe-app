import type { JobResponse } from './serverTypes';
import type { ImportedRecipe } from './types';

/**
 * The one place the server's field names/nullability meet the app's
 * ImportedRecipe contract. Keeping this as a single function means every
 * caller (URL import, paste-text import) gets identical, guaranteed-non-null
 * fallbacks instead of each screen inventing its own.
 */
export function toImportedRecipe(job: JobResponse): ImportedRecipe {
  const recipe = job.recipe;

  return {
    title: recipe?.title?.trim() || 'Untitled recipe',
    description: recipe?.description?.trim() ?? '',
    servings: recipe?.servings ?? 2,
    prepMinutes: recipe?.prepMinutes ?? null,
    cookMinutes: recipe?.cookMinutes ?? null,
    ingredients: (recipe?.ingredients ?? []).map((ing) => ({
      quantity: ing.quantity,
      unit: ing.unit,
      name: ing.item.trim() || ing.rawText.trim(),
      note: ing.note,
      category: ing.category,
    })),
    steps: (recipe?.steps ?? []).map((s) => ({ text: s.text, minutes: s.minutes })),
    tags: recipe?.tags ?? [],
    imageUrl: job.thumbnail ?? null,
    sourceUrl: job.sourceUrl ?? null,
    sourcePlatform: job.platform ?? 'website',
    sourceAuthor: job.author ?? null,
  };
}
