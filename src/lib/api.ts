import type { ImportedRecipe } from './types';

/**
 * Base URL of the import backend.
 *
 * On a physical iPhone "localhost" points at the phone itself, so this must be
 * your computer's LAN IP (e.g. http://192.168.1.20:8787) while developing.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

export async function importRecipe(url: string): Promise<ImportedRecipe> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error(
      "Can't reach the import server. Check it's running and that EXPO_PUBLIC_API_URL points at your computer's IP.",
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Couldn't read a recipe from that link.");
  }

  return payload as ImportedRecipe;
}
