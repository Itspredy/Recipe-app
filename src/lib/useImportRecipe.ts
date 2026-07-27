import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { importRecipe } from './api';
import { findBySourceUrl, saveRecipe } from '../db/recipes';

type Status = 'idle' | 'importing' | 'error';

/**
 * The one import path used by both the share sheet and the manual paste screen:
 * reuse an already-saved recipe if we have it, otherwise parse, save, and open it.
 */
export function useImportRecipe() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (url: string) => {
      setStatus('importing');
      setError(null);

      try {
        const existingId = await findBySourceUrl(db, url);
        if (existingId) {
          router.replace(`/recipe/${existingId}`);
          return;
        }

        const imported = await importRecipe(url);
        const id = await saveRecipe(db, imported);
        router.replace(`/recipe/${id}`);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Something went wrong.');
        setStatus('error');
      }
    },
    [db, router],
  );

  return { run, status, error };
}
