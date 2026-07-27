import { Stack, useRouter } from 'expo-router';
import { ShareIntentProvider } from 'expo-share-intent';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Suspense } from 'react';
import { migrate } from '../db/schema';
import { colors } from '../lib/theme';

export default function RootLayout() {
  const router = useRouter();

  return (
    <ShareIntentProvider
      options={{
        resetOnBackground: true,
        onResetShareIntent: () => router.replace('/'),
      }}
    >
      <Suspense fallback={<Loading />}>
        <SQLiteProvider databaseName="recipes.db" onInit={migrate} useSuspense>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'My Recipes' }} />
            <Stack.Screen name="add" options={{ title: 'Add a recipe', presentation: 'modal' }} />
            <Stack.Screen name="shareintent" options={{ headerShown: false }} />
            <Stack.Screen name="recipe/[id]" options={{ title: '' }} />
            <Stack.Screen name="cook/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </ShareIntentProvider>
  );
}

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}
