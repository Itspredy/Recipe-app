import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JobResponse, JobStage } from './serverTypes';

/**
 * Base URL of the import backend (Server 2 / Recipe-rapidapi-backend).
 *
 * On a physical iPhone "localhost" points at the phone itself, so this must be
 * your computer's LAN IP (e.g. http://192.168.1.20:3000) or the Railway
 * public domain while developing off this machine.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const DEVICE_KEY = 'recipe.deviceId';
let deviceIdPromise: Promise<string> | null = null;

/**
 * Stable per-install id, sent as X-Device-Id so the backend can rate limit per
 * device. Without it every user behind the same carrier NAT shares one bucket
 * and a handful of heavy users would lock everyone else out.
 */
function getDeviceId(): Promise<string> {
  deviceIdPromise ??= (async () => {
    try {
      const existing = await AsyncStorage.getItem(DEVICE_KEY);
      if (existing) return existing;
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      await AsyncStorage.setItem(DEVICE_KEY, id);
      return id;
    } catch {
      return 'anonymous';
    }
  })();
  return deviceIdPromise;
}

async function headers() {
  return { 'Content-Type': 'application/json', 'X-Device-Id': await getDeviceId() };
}

const UNREACHABLE_MESSAGE =
  "Can't reach the import server. Check it's running and that EXPO_PUBLIC_API_URL points at your computer's IP.";

async function post(path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: await headers(),
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }
}

async function get(path: string): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, { headers: { 'X-Device-Id': await getDeviceId() } });
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }
}

/** Maps the server's short error codes to copy a user can act on. */
function friendlyError(payload: { error?: string } | null, fallback: string): string {
  switch (payload?.error) {
    case 'rate_limited':
      return "You've hit today's import limit. Try again tomorrow.";
    case 'invalid_url':
      return "That doesn't look like a link.";
    case 'quota_exceeded':
      return 'Import capacity is exhausted right now — try again later.';
    default:
      return fallback;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const POLL_INTERVAL_MS = 1500;
// A 20-minute video can genuinely take a couple of minutes to download +
// transcribe + structure. 150s comfortably covers that without leaving the
// user staring at a spinner forever if something upstream is actually stuck.
const POLL_TIMEOUT_MS = 150_000;

async function pollJob(jobId: string, onStage?: (stage: JobStage) => void): Promise<JobResponse> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const response = await get(`/api/v1/jobs/${jobId}`);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(friendlyError(payload, "Lost track of that import — try again."));
    }

    const job = payload as JobResponse;
    onStage?.(job.stage ?? null);

    if (job.status === 'queued' || job.status === 'running') continue;
    return job; // completed | failed | not_a_recipe
  }

  throw new Error('That took too long — try the caption instead.');
}

/**
 * Kicks off a URL import. Resolves once the job leaves queued/running —
 * `job.status` distinguishes a real result (`completed`), a content miss
 * (`not_a_recipe`, with `job.message`), and a pipeline error (`failed`, with
 * `job.error`). Callers should NOT treat every non-throw resolution as
 * success. `onStage` fires as the job's stage advances (downloading ->
 * transcribing -> structuring), for progress copy.
 */
export async function parseRecipe(url: string, onStage?: (stage: JobStage) => void): Promise<JobResponse> {
  const response = await post('/api/v1/parse', { url });
  const payload = await response.json().catch(() => null);

  if (response.status === 200) {
    return payload as JobResponse; // cache hit — already resolved
  }
  if (response.status === 202) {
    const jobId = (payload as { jobId?: string } | null)?.jobId;
    if (!jobId) throw new Error("The import server didn't return a job id.");
    return pollJob(jobId, onStage);
  }
  throw new Error(friendlyError(payload, "Couldn't read a recipe from that link."));
}

/**
 * Manual fallback for when a link is blocked or unscrapeable (common for
 * Instagram): the user pastes the caption / recipe text and Groq structures
 * it directly, synchronously — no importer, no polling.
 */
export async function structureText(text: string): Promise<JobResponse> {
  const response = await post('/api/v1/structure', { text });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(friendlyError(payload, "Couldn't read a recipe from that text."));
  }
  return payload as JobResponse;
}
