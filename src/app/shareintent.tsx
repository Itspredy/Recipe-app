import { Redirect } from 'expo-router';

/**
 * The share-sheet import flow requires a native development build (Expo Go and
 * web can't host the share extension). In the previewable app this route just
 * bounces to the library; wire the expo-share-intent version back in when you
 * cut a dev build. Keeping it import-free avoids loading a native-only module
 * on web/Expo Go startup.
 */
export default function ShareIntentScreen() {
  return <Redirect href="/library" />;
}
