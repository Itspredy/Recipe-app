import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../lib/ThemeProvider';

// Covers web/Expo Go (no share extension possible, so nothing will ever
// redirect this screen away) and the edge case of a share intent that turns
// out empty. On a real share, Root's effect in _layout.tsx reads the intent
// and replaces this screen almost immediately — this fallback essentially
// never fires in that path.
const FALLBACK_MS = 4000;

/**
 * Transient landing screen for the iOS share-extension handoff — see
 * +native-intent.ts, which redirects the extension's `dataUrl=` deep link
 * here. The actual work (reading the shared URL and pushing /import) happens
 * in the always-mounted Root layout's effect, since that's what the
 * expo-share-intent hook's `useLinkingURL` reacts to regardless of the
 * current route; this screen only needs to not be a dead end while that
 * effect runs.
 */
export default function ShareIntentScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/library'), FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
      <ActivityIndicator color={theme.acc} />
    </View>
  );
}
