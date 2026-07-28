import { useCallback, useState } from 'react';
import { importRecipe } from './api';
import { findBySourceUrl, saveImported } from '../db/store';
import type { ImportedRecipe } from './types';

type Status = 'idle' | 'importing' | 'error';

/**
 * Parse a link into a recipe and hand back the imported data for a preview step.
 * Reuses an already-saved recipe if the same link was imported before.
 */
export function useImportRecipe() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (url: string): Promise<{ existingId: string } | { imported: ImportedRecipe } | null> => {
      setStatus('importing');
      setError(null);

      try {
        const existingId = await findBySourceUrl(url);
        if (existingId) {
          setStatus('idle');
          return { existingId };
        }

        const imported = await importRecipe(url);
        setStatus('idle');
        return { imported };
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Something went wrong.');
        setStatus('error');
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { run, reset, status, error };
}

export { saveImported };
