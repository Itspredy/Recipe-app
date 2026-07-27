import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useImportRecipe } from '../lib/useImportRecipe';
import { colors, radius, spacing } from '../lib/theme';

/** Manual fallback for when you already have the link on your clipboard. */
export default function AddScreen() {
  const [url, setUrl] = useState('');
  const { run, status, error } = useImportRecipe();
  const busy = status === 'importing';

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.label}>Paste a link</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="https://instagram.com/reel/..."
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        editable={!busy}
        autoFocus
      />
      <Text style={styles.hint}>
        Works with Instagram, TikTok, YouTube and most recipe websites.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, (!url.trim() || busy) && styles.buttonDisabled]}
        disabled={!url.trim() || busy}
        onPress={() => run(url.trim())}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save recipe</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.lg, backgroundColor: colors.background, gap: spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  error: { fontSize: 14, color: colors.danger, lineHeight: 20, marginTop: spacing.sm },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
