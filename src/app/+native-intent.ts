/**
 * Routes deep links / system paths. The iOS share extension hands off to the
 * main app via `<scheme>://dataUrl=...` — expo-share-intent's own hook
 * (useLinkingURL) picks that URL up and calls the native module for us the
 * moment /shareintent mounts, so all this needs to do is make sure that deep
 * link actually lands on /shareintent instead of falling through to
 * whatever expo-router would otherwise make of a bare "dataUrl=..." path.
 * Android instead cold-starts the app directly into /shareintent via the
 * share intent filter (no system path involved), so it never reaches here.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (path.includes('dataUrl=')) {
      return '/shareintent';
    }
    return path;
  } catch {
    return '/shareintent';
  }
}
