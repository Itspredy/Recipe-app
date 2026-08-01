/**
 * Mirrors `Server 2/server/src/shared-types.ts`. The server's own
 * `npm run sync-types` script targets a path that doesn't exist in this
 * workspace (`Rv1/src/types/recipe.ts`, left over from an older layout), so
 * this file is hand-kept in sync instead — it is the ONLY place in the app
 * that describes the server's response shape. Everything downstream
 * (mapImported.ts) consumes this, never the server's raw JSON directly.
 */

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'pantry'
  | 'spices'
  | 'bakery'
  | 'frozen'
  | 'other';

export interface ServerIngredient {
  quantity: number | null;
  unit: string | null;
  item: string;
  note: string | null;
  rawText: string;
  category: IngredientCategory | null;
}

export interface ServerStep {
  text: string;
  minutes: number | null;
}

export interface StructuredRecipe {
  isRecipe: boolean;
  confidence: number;
  title: string | null;
  description: string | null;
  servings: number | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  totalMinutes: number | null;
  ingredients: ServerIngredient[];
  steps: ServerStep[];
  tags: string[];
}

export type ServerPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'website' | 'text';

export type JobStage = 'downloading' | 'transcribing' | 'structuring' | null;

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'not_a_recipe';

/** POST /api/v1/parse (cache-hit path), GET /api/v1/jobs/:id, and POST /api/v1/structure all resolve to this shape. */
export interface JobResponse {
  jobId?: string;
  status: JobStatus;
  stage?: JobStage;
  recipe?: StructuredRecipe | null;
  message?: string | null;
  error?: string | null;
  thumbnail?: string | null;
  sourceUrl?: string | null;
  platform?: ServerPlatform | null;
  author?: string | null;
}
