import { Image } from 'expo-image';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { listRecipes } from '../db/recipes';
import type { RecipeSummary } from '../lib/types';
import { colors, radius, spacing } from '../lib/theme';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);

  // Reload on focus so a recipe saved from the share sheet shows up on return.
  useFocusEffect(
    useCallback(() => {
      listRecipes(db).then(setRecipes);
    }, [db]),
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={recipes.length ? styles.list : styles.listEmpty}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <Link href={`/recipe/${item.id}`} asChild>
            <Pressable style={styles.card}>
              {item.imageUrl ? (
                <Image source={item.imageUrl} style={styles.thumb} contentFit="cover" cachePolicy="disk" />
              ) : (
                <View style={[styles.thumb, styles.thumbFallback]}>
                  <Text style={styles.thumbEmoji}>🍽️</Text>
                </View>
              )}

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {[item.sourceAuthor, formatTime(item)].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/add')}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🧑‍🍳</Text>
      <Text style={styles.emptyTitle}>No recipes yet</Text>
      <Text style={styles.emptyText}>
        Find a recipe on Instagram or TikTok, tap Share, and pick this app. It&apos;ll pull out the
        ingredients and steps for you.
      </Text>
    </View>
  );
}

function formatTime({ prepMinutes, cookMinutes }: RecipeSummary) {
  const total = (prepMinutes ?? 0) + (cookMinutes ?? 0);
  if (!total) return null;
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.md },
  listEmpty: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
  },
  thumb: { width: 92, height: 92 },
  thumbFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft },
  thumbEmoji: { fontSize: 28 },
  cardBody: { flex: 1, padding: spacing.md, gap: spacing.xs },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 21 },
  cardMeta: { fontSize: 13, color: colors.textMuted },

  empty: { alignItems: 'center', gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 19, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },

  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabIcon: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '300' },
});
