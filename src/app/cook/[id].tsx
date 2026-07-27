import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRecipe } from '../../db/recipes';
import { formatQuantity } from '../../lib/format';
import type { Recipe } from '../../lib/types';
import { colors, radius, spacing } from '../../lib/theme';

/** Full-screen, one-step-at-a-time cooking view. */
export default function CookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  useEffect(() => {
    getRecipe(db, id).then(setRecipe);
  }, [db, id]);

  const ingredientNames = useMemo(
    () => recipe?.ingredients.map((i) => i.name) ?? [],
    [recipe],
  );

  if (!recipe) return <View style={styles.screen} />;

  const step = recipe.steps[index];
  const isLast = index === recipe.steps.length - 1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.topBar}>
        <View style={styles.progress}>
          {recipe.steps.map((_, i) => (
            <View key={i} style={[styles.progressBar, i <= index && styles.progressBarDone]} />
          ))}
        </View>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.stepLabel}>
          Step {index + 1} <Text style={styles.stepLabelMuted}>of {recipe.steps.length}</Text>
        </Text>

        <Text style={styles.stepText}>
          {highlightIngredients(step.text, ingredientNames)}
        </Text>

        {showIngredients ? (
          <View style={styles.ingredientPanel}>
            {recipe.ingredients.map((ingredient, i) => (
              <Text key={i} style={styles.ingredientLine}>
                {ingredient.quantity !== null ? (
                  <Text style={styles.ingredientAmount}>
                    {formatQuantity(ingredient.quantity)}
                    {ingredient.unit ? ` ${ingredient.unit}` : ''}{' '}
                  </Text>
                ) : null}
                {ingredient.name}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          style={styles.listButton}
          onPress={() => setShowIngredients((visible) => !visible)}
        >
          <Text style={styles.listButtonIcon}>☰</Text>
        </Pressable>

        {index > 0 ? (
          <Pressable style={styles.backButton} onPress={() => setIndex((i) => i - 1)}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.nextButton}
          onPress={() => (isLast ? router.back() : setIndex((i) => i + 1))}
        >
          <Text style={styles.nextButtonText}>{isLast ? 'Done' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Tints ingredient mentions inside the instruction so they're scannable while
 * cooking. Longest names first, so "olive oil" wins over "oil".
 */
function highlightIngredients(text: string, names: string[]) {
  const candidates = names
    .filter((name) => name.length > 2)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);

  if (!candidates.length) return text;

  const pattern = new RegExp(`(${candidates.join('|')})`, 'gi');

  // split() with a capture group puts the matches at the odd indices, so the
  // position alone tells us what to tint — no second (stateful) regex test.
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={styles.highlight}>
        {part}
      </Text>
    ) : (
      part
    ),
  );
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  progress: { flex: 1, flexDirection: 'row', gap: spacing.xs },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  progressBarDone: { backgroundColor: colors.accent },
  close: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 18, color: colors.textMuted },

  body: { padding: spacing.xl, gap: spacing.lg },
  stepLabel: { fontSize: 26, fontWeight: '700', color: colors.text },
  stepLabelMuted: { color: colors.textFaint, fontWeight: '400' },
  stepText: { fontSize: 22, lineHeight: 33, color: colors.text },
  highlight: { color: colors.accent, fontWeight: '600' },

  ingredientPanel: {
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  ingredientLine: { fontSize: 15, color: colors.text, lineHeight: 21 },
  ingredientAmount: { fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  listButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listButtonIcon: { fontSize: 18, color: colors.accent },
  backButton: {
    paddingHorizontal: spacing.lg,
    height: 52,
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 16, color: colors.textMuted, fontWeight: '500' },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
