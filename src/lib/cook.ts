import type { Ingredient, Step } from './types';

/** Pulls a timer length (in minutes) out of a step's wording, if any. */
export function parseStepMinutes(text: string): number | null {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)/i);
  if (!m) return null;
  const value = Number(m[1]);
  if (!Number.isFinite(value)) return null;
  const isHours = /^h/i.test(m[2]);
  const minutes = Math.round(isHours ? value * 60 : value);
  return minutes > 0 ? minutes : null;
}

/** Ingredient names mentioned in a step, longest-first so "olive oil" beats "oil". */
export function stepIngredients(text: string, ingredients: Ingredient[]): string[] {
  const lower = text.toLowerCase();
  return ingredients
    .map((i) => i.name)
    .filter((name) => name.length > 2 && lower.includes(name.toLowerCase()))
    .sort((a, b) => b.length - a.length)
    .slice(0, 3);
}

export function stepMinutesList(steps: Step[]): (number | null)[] {
  return steps.map((s) => parseStepMinutes(s.text));
}
