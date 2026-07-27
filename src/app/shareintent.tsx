import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useImportRecipe } from '../lib/useImportRecipe';
import { colors, radius, spacing } from '../lib/theme';

/**
 * Landing screen for a link shared from Instagram / TikTok / a browser.
 * Kicks off the import immediately so the user just sees a short spinner.
 */
export default function ShareIntentScreen() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const { run, status, error } = useImportRecipe();
  const started = useRef(false);

  const sharedUrl = shareIntent?.webUrl ?? extractUrl(shareIntent?.text);

  useEffect(() => {
    if (!hasShareIntent || started.current) return;

    if (sharedUrl) {
      started.current = true;
      run(sharedUrl).finally(resetShareIntent);
    }
  }, [hasShareIntent, sharedUrl, run, resetShareIntent]);

  if (status === 'error' || (hasShareIntent && !sharedUrl)) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🍳</Text>
        <Text style={styles.title}>Couldn&apos;t save that</Text>
        <Text style={styles.message}>
          {error ?? "That share didn't include a link we can read."}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            resetShareIntent();
            router.replace('/');
          }}
        >
          <Text style={styles.buttonText}>Back to my recipes</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.title}>Reading the recipe…</Text>
      <Text style={styles.message}>Pulling out the ingredients and steps. Takes a few seconds.</Text>
    </View>
  );
}

/** Shares from some apps arrive as free text with the link embedded. */
function extractUrl(text?: string | null) {
  if (!text) return null;
  return text.match(/https?:\/\/\S+/)?.[0] ?? null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  emoji: { fontSize: 44 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  message: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
