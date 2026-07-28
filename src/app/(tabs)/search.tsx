import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { RecipeCard } from '../../components/RecipeCard';
import { ScreenBackground } from '../../components/ui';
import { listRecipes } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, radius } from '../../lib/theme';
import { totalMinutes, type RecipeSummary } from '../../lib/types';

const RECENTS = ['salmon', 'one pot dinner', 'lemon cake', 'under 20 minutes'];
const FILTERS: { label: string; test: (r: RecipeSummary) => boolean }[] = [
  { label: 'Under 15 min', test: (r) => totalMinutes(r) > 0 && totalMinutes(r) <= 15 },
  { label: 'Under 30 min', test: (r) => totalMinutes(r) > 0 && totalMinutes(r) <= 30 },
  { label: 'Vegetarian', test: (r) => r.tags.some((t) => t.toLowerCase() === 'vegetarian') },
  { label: 'Breakfast', test: (r) => r.tags.some((t) => t.toLowerCase() === 'breakfast') },
  { label: 'Desserts', test: (r) => r.tags.some((t) => t.toLowerCase() === 'desserts') },
  { label: 'Favorites', test: (r) => r.isFavorite },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      listRecipes().then(setRecipes);
    }, []),
  );

  const activeFilter = FILTERS.find((f) => f.label === filter);
  const q = query.trim().toLowerCase();
  const results = recipes.filter((r) => {
    const textOk = !q || r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q));
    const filterOk = !activeFilter || activeFilter.test(r);
    return textOk && filterOk;
  });

  const searching = q.length > 0 || filter !== null;
  const rows: RecipeSummary[][] = [];
  for (let i = 0; i < results.length; i += 2) rows.push(results.slice(i, i + 2));

  return (
    <ScreenBackground>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 132, gap: 22 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              height: 50,
              paddingHorizontal: 16,
              borderRadius: radius.pill,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.acc,
            }}
          >
            <Icon name="search" size={18} color={theme.acc} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search recipes"
              placeholderTextColor={theme.dim2}
              autoCorrect={false}
              style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: theme.txt }}
            />
            {searching ? (
              <Pressable onPress={() => { setQuery(''); setFilter(null); }} hitSlop={8}>
                <Icon name="close" size={18} color={theme.dim2} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {searching ? (
          <View style={{ gap: 14 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2 }}>
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {filter ? ` · ${filter}` : ''}
            </Text>
            {rows.length === 0 ? (
              <Text style={{ fontFamily: fonts.body, fontSize: 15, color: theme.dim }}>
                No recipes match that. Try another word or filter.
              </Text>
            ) : (
              rows.map((row, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
                  {row.map((r) => (
                    <RecipeCard key={r.id} recipe={r} onPress={() => router.push(`/recipe/${r.id}`)} />
                  ))}
                  {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
                </View>
              ))
            )}
          </View>
        ) : (
          <>
            <View style={{ gap: 12 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2 }}>
                Recent
              </Text>
              {RECENTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setQuery(s)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.line }}
                >
                  <Icon name="clock" size={16} color={theme.dim2} />
                  <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: theme.txt }}>{s}</Text>
                  <Icon name="close" size={15} color={theme.dim2} />
                </Pressable>
              ))}
            </View>

            <View style={{ gap: 12 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2 }}>
                Quick filters
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
                {FILTERS.map((f) => (
                  <Pressable
                    key={f.label}
                    onPress={() => setFilter(f.label)}
                    style={{
                      height: 38,
                      justifyContent: 'center',
                      paddingHorizontal: 15,
                      borderRadius: radius.pill,
                      borderWidth: 1,
                      borderColor: theme.line,
                      backgroundColor: theme.card,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.dim }}>{f.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
