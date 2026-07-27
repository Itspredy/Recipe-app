import { getShareExtensionKey } from 'expo-share-intent';

/**
 * When iOS hands a shared link to the app, expo-router asks us where to send it.
 * Anything carrying the share-extension payload goes to the import screen.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (path.includes(`dataUrl=${getShareExtensionKey()}`)) {
      return '/shareintent';
    }
    return path;
  } catch {
    return '/';
  }
}
