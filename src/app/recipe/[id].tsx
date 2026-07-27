import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteRecipe, getRecipe } from '../../db/recipes';
import { formatDuration, formatQuantity } from '../../lib/format';
import type { Recipe } from '../../lib/types';
import { colors, radius, spacing } from '../../lib/theme';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const navigation = useNavigation();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState<number | null>(null);

  useEffect(() => {
    getRecipe(db, id).then((found) => {
      setRecipe(found);
      setServings(found?.servings ?? null);
    });
  }, [db, id]);

  const confirmDelete = useCallback(() => {
    Alert.alert('Delete recipe?', 'This removes it from your saved recipes.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(db, id);
          router.replace('/');
        },
      },
    ]);
  }, [db, id, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={confirmDelete} hitSlop={12}>
          <Text style={styles.headerAction}>Delete</Text>
        </Pressable>
      ),
    });
  }, [navigation, confirmDelete]);

  if (!recipe || servings === null) return <View style={styles.screen} />;

  // Everything was captured at the recipe's original serving count, so scaling
  // is just a ratio applied at render time — the stored values never change.
  const scale = servings / (recipe.servings || 1);
  const prep = formatDuration(recipe.prepMinutes);
  const cook = formatDuration(recipe.cookMinutes);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {recipe.imageUrl ? (
          <Image source={recipe.imageUrl} style={styles.hero} contentFit="cover" cachePolicy="disk" />
        ) : null}

        <View style={styles.section}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            {prep ? <Text style={styles.meta}>{prep} prep</Text> : null}
            {cook ? <Text style={styles.meta}>{cook} cook</Text> : null}
            {recipe.sourceAuthor ? <Text style={styles.meta}>{recipe.sourceAuthor}</Text> : null}
          </View>

          {recipe.description ? <Text style={styles.description}>{recipe.description}</Text> : null}

          {recipe.sourceUrl ? (
            <Pressable onPress={() => WebBrowser.openBrowserAsync(recipe.sourceUrl!)}>
              <Text style={styles.link}>View original ↗</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperButton}
                onPress={() => setServings((n) => Math.max(1, (n ?? 1) - 1))}
              >
                <Text style={styles.stepperIcon}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>
                {servings} {servings === 1 ? 'serve' : 'serves'}
              </Text>
              <Pressable style={styles.stepperButton} onPress={() => setServings((n) => (n ?? 1) + 1)}>
                <Text style={styles.stepperIcon}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={`${ingredient.name}-${index}`}
                style={[styles.ingredient, index > 0 && styles.divider]}
              >
                <Text style={styles.ingredientText}>
                  {ingredient.quantity !== null ? (
                    <Text style={styles.ingredientAmount}>
                      {formatQuantity(ingredient.quantity * scale)}
                      {ingredient.unit ? ` ${ingredient.unit}` : ''}{' '}
                    </Text>
                  ) : null}
                  {ingredient.name}
                  {ingredient.note ? <Text style={styles.note}>, {ingredient.note}</Text> : null}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <View style={styles.card}>
            {recipe.steps.map((step, index) => (
              <View key={index} style={[styles.step, index > 0 && styles.divider]}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {recipe.steps.length > 0 ? (
        <View style={styles.footer}>
          <Pressable style={styles.cookButton} onPress={() => router.push(`/cook/${id}`)}>
            <Text style={styles.cookButtonText}>Start cooking</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl * 3 },
  headerAction: { color: colors.danger, fontSize: 15, fontWeight: '500' },

  hero: { width: '100%', height: 240, backgroundColor: colors.accentSoft },

  section: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },

  title: { fontSize: 26, fontWeight: '700', color: colors.text, lineHeight: 32 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  meta: { fontSize: 14, color: colors.textMuted },
  description: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  link: { fontSize: 14, color: colors.accent, fontWeight: '500' },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperIcon: { fontSize: 18, color: colors.accent, fontWeight: '600', lineHeight: 22 },
  stepperValue: { fontSize: 14, color: colors.text, fontWeight: '600', minWidth: 68, textAlign: 'center' },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden' },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },

  ingredient: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  ingredientText: { fontSize: 16, color: colors.text, lineHeight: 22 },
  ingredientAmount: { fontWeight: '700' },
  note: { color: colors.textMuted },

  step: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 23 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cookButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  cookButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
