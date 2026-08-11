import { useCallback, useState } from 'react';
import { parseRecipe } from './api';
import { findBySourceUrl, saveImported } from '../db/store';
import { hasFreeImportRemaining, recordFreeImportUsed } from './importLimit';
import { toImportedRecipe } from './mapImported';
import { checkProEntitlement } from './purchases';
import type { JobStage } from './serverTypes';
import type { ImportedRecipe } from './types';

type Status = 'idle' | 'importing' | 'error';

/**
 * Parse a link into a recipe and hand back the imported data for a preview step.
 * Reuses an already-saved recipe if the same link was imported before. Free tier
 * is capped at one new link import per calendar month — pasted-text/caption
 * imports (the `/structure` fallback) are never gated here.
 */
export function useImportRecipe() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<JobStage>(null);

  const run = useCallback(
    async (
      url: string,
    ): Promise<{ existingId: string } | { imported: ImportedRecipe } | { limitReached: true } | null> => {
      setStatus('importing');
      setError(null);
      setStage(null);

      try {
        const existingId = await findBySourceUrl(url);
        if (existingId) {
          setStatus('idle');
          return { existingId };
        }

        const isPro = await checkProEntitlement();
        if (!isPro && !(await hasFreeImportRemaining())) {
          setStatus('idle');
          return { limitReached: true };
        }

        const job = await parseRecipe(url, setStage);

        if (job.status === 'completed') {
          if (!isPro) await recordFreeImportUsed();
          setStatus('idle');
          return { imported: toImportedRecipe(job) };
        }

        // 'not_a_recipe' and 'failed' both resolved without throwing — the
        // server successfully ran the pipeline but has no recipe to show.
        setError(
          job.status === 'not_a_recipe'
            ? job.message ?? "We couldn't find a recipe in this content."
            : job.error ?? 'Something went wrong.',
        );
        setStatus('error');
        return null;
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
    setStage(null);
  }, []);

  return { run, reset, status, error, stage };
}

export { saveImported };
