/**
 * Routes deep links / system paths. The share-extension flow needs a native dev
 * build (not Expo Go or web), so for the previewable app we simply pass paths
 * through untouched — no expo-share-intent import, which keeps web and Expo Go
 * from loading a native-only module at startup.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  return path;
}
