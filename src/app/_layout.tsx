import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import {
  Figtree_400Regular,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider, useTheme } from '../lib/ThemeProvider';
import { UserProvider } from '../lib/UserProvider';
import { configurePurchases } from '../lib/purchases';

configurePurchases();

// The share-extension native module isn't present in Expo Go (it needs a
// custom dev client build) — the library's own FAQ recommends disabling it
// there rather than letting it try and fail. On web it self-disables
// already (Platform.OS === 'web' is its own default). On a dev/production
// build this is a no-op false, i.e. fully enabled.
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Caprasimo_400Regular,
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  return (
    <ShareIntentProvider options={{ disabled: IS_EXPO_GO, resetOnBackground: true }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <Root ready={fontsLoaded} />
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ShareIntentProvider>
  );
}

function Root({ ready }: { ready: boolean }) {
  const { theme } = useTheme();
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  // Mounted for the whole app's lifetime, so this catches a share regardless
  // of which route the OS actually cold-started (iOS lands on /shareintent
  // via +native-intent's redirect; Android's native side hands the intent to
  // this same provider without going through a system-path redirect at all).
  // `webUrl` is the library's own "link extracted from raw text" field, which
  // already covers both "share a link directly" and "share a caption with a
  // link buried in it" — no need to re-parse `shareIntent.text` ourselves.
  useEffect(() => {
    if (!ready || !hasShareIntent) return;
    const url = shareIntent.webUrl ?? undefined;
    resetShareIntent();
    router.replace(url ? { pathname: '/import', params: { url } } : '/import');
  }, [ready, hasShareIntent]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.acc} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        <Stack.Screen name="import" options={{ presentation: 'modal' }} />
        <Stack.Screen name="manual" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="cook/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
      </Stack>
    </>
  );
}
