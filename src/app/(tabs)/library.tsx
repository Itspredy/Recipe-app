import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { RecipeCard } from '../../components/RecipeCard';
import { Chip, GradientButton, PhotoSlot, ScreenBackground } from '../../components/ui';
import { listRecipes } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, radius } from '../../lib/theme';
import { totalMinutes, type RecipeSummary } from '../../lib/types';
import { useUser } from '../../lib/UserProvider';

const CATEGORIES = ['All', 'Breakfast', 'Dinner', 'Desserts', 'Favorites', 'Quick', 'Vegetarian'];
const ABS = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

function matches(recipe: RecipeSummary, category: string): boolean {
  if (category === 'All') return true;
  if (category === 'Favorites') return recipe.isFavorite;
  if (category === 'Quick') return totalMinutes(recipe) > 0 && totalMinutes(recipe) <= 30;
  return recipe.tags.some((t) => t.toLowerCase() === category.toLowerCase());
}

function greeting(): string {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: 'long' });
  const time = now
    .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    .toLowerCase()
    .replace(' ', '');
  return `${day}, ${time}`;
}

export default function LibraryScreen() {
  const { theme, mode, toggle } = useTheme();
  const { name } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [category, setCategory] = useState('All');

  useFocusEffect(
    useCallback(() => {
      listRecipes().then(setRecipes);
    }, []),
  );

  const filtered = recipes.filter((r) => matches(r, category));
  const featured = [...recipes].sort((a, b) => (b.lastCookedAt ?? 0) - (a.lastCookedAt ?? 0))[0] ?? null;

  const rows: RecipeSummary[][] = [];
  for (let i = 0; i < filtered.length; i += 2) rows.push(filtered.slice(i, i + 2));

  if (recipes.length === 0) return <EmptyLibrary />;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 20, paddingBottom: 132, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 0.7, textTransform: 'uppercase', color: theme.dim2 }}>
              {greeting()}
            </Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.dim }}>Hi{name ? ` ${name}` : ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={toggle}
              style={{
                width: 42,
                height: 42,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: theme.line,
                backgroundColor: theme.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={19} color={theme.txt} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/grocery')}
              style={{
                width: 42,
                height: 42,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: theme.line,
                backgroundColor: theme.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="list" size={19} color={theme.txt} />
            </Pressable>
            <Pressable
              onPress={() => router.navigate('/profile')}
              style={{ width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}
            >
              <PhotoSlot icon="userFilled" />
            </Pressable>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.heading, fontSize: 38, lineHeight: 40, color: theme.txt }}>
          What are we cooking{name ? ', ' : ''}
          {name ? <Text style={{ color: theme.acc }}>{name}?</Text> : '?'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => router.navigate('/search')}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              height: 52,
              paddingHorizontal: 18,
              borderRadius: radius.pill,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
            }}
          >
            <Icon name="search" size={18} color={theme.dim} />
            <Text style={{ fontFamily: fonts.body, fontSize: 15, color: theme.dim }}>Search {recipes.length} recipes</Text>
          </Pressable>
          <Pressable
            onPress={() => router.navigate('/search')}
            style={{
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="filter" size={19} color={theme.txt} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 9, paddingRight: 20 }}
          style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
        >
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        {featured ? (
          <Pressable
            onPress={() => router.push(`/recipe/${featured.id}`)}
            style={[{ height: 196, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: theme.line }, theme.shadow]}
          >
            {featured.imageUrl ? (
              <Image source={featured.imageUrl} style={ABS} contentFit="cover" />
            ) : (
              <PhotoSlot title={featured.title} icon="flame" />
            )}
            <LinearGradient
              colors={['rgba(12,8,6,0.88)', 'rgba(12,8,6,0.35)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={ABS}
            />
            <View style={{ ...ABS, padding: 20, justifyContent: 'flex-end', gap: 8 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  borderWidth: 1,
                  borderColor: 'rgba(255,196,155,0.35)',
                  backgroundColor: 'rgba(232,130,63,0.22)',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: radius.pill,
                }}
              >
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.9, textTransform: 'uppercase', color: '#ffd9bf' }}>
                  {featured.lastCookedAt ? 'Cook it again' : 'Start here'}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.heading, fontSize: 27, lineHeight: 28, color: '#fff', maxWidth: 230 }}>
                {featured.title}
              </Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
                {totalMinutes(featured) ? `${totalMinutes(featured)} min` : 'Ready when you are'}
                {featured.cookedCount ? ` · cooked ${featured.cookedCount}×` : ''}
              </Text>
            </View>
          </Pressable>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 21, color: theme.txt }}>My recipes</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.acc }}>
            {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}
          </Text>
        </View>

        {rows.length === 0 ? (
          <View style={{ paddingVertical: 30, alignItems: 'center', gap: 6 }}>
            <Icon name="search" size={26} color={theme.dim2} />
            <Text style={{ fontFamily: fonts.body, fontSize: 15, color: theme.dim }}>Nothing in “{category}” yet.</Text>
          </View>
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
      </ScrollView>
    </ScreenBackground>
  );
}

function EmptyLibrary() {
  const { theme, mode, toggle } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 20, alignItems: 'flex-end' }}>
        <Pressable
          onPress={toggle}
          style={{
            width: 42,
            height: 42,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={19} color={theme.txt} />
        </Pressable>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 18, marginTop: -60 }}>
        <View
          style={{
            width: 112,
            height: 112,
            borderRadius: radius.pill,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.line,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="book" size={46} color={theme.acc} />
        </View>
        <Text style={{ fontFamily: fonts.heading, fontSize: 26, color: theme.txt, textAlign: 'center' }}>
          Your cookbook is empty
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: theme.dim, textAlign: 'center', maxWidth: 260 }}>
          Paste a link, type one in, and it lives here forever — no ads, no life story.
        </Text>
        <GradientButton label="Add your first recipe" icon="plus" onPress={() => router.push('/add')} style={{ marginTop: 6, minWidth: 240 }} />
      </View>
    </ScreenBackground>
  );
}
