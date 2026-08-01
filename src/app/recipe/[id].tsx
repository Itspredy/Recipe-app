import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { GradientButton, PhotoSlot, ScreenBackground, Tag } from '../../components/ui';
import { getRecipe, saveNotes, toggleFavorite } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { stepMinutes } from '../../lib/cook';
import { formatDuration, formatQuantity } from '../../lib/format';
import { fonts, radius } from '../../lib/theme';
import { difficultyLabel, totalMinutes, type Ingredient, type Recipe } from '../../lib/types';

const ABS = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
type Tab = 'ing' | 'steps' | 'notes';

export default function RecipeDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(4);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [fav, setFav] = useState(false);
  const [tab, setTab] = useState<Tab>('ing');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getRecipe(id).then((r) => {
      if (!r) return;
      setRecipe(r);
      setServings(r.servings || 1);
      setFav(r.isFavorite);
      setNotes(r.notes);
    });
  }, [id]);

  if (!recipe) return <ScreenBackground><View style={{ flex: 1 }} /></ScreenBackground>;

  const scale = servings / (recipe.servings || 1);
  const total = totalMinutes(recipe);

  const onFav = async () => {
    setFav((v) => !v);
    await toggleFavorite(recipe.id);
  };

  const iconBtn = {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(14,10,8,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ height: 396, width: '100%' }}>
          {recipe.imageUrl ? <Image source={recipe.imageUrl} style={ABS} contentFit="cover" /> : <PhotoSlot title={recipe.title} icon="flame" />}
          <LinearGradient colors={['rgba(10,7,6,0.5)', 'transparent', 'transparent', theme.bg]} locations={[0, 0.34, 0.58,0.99]} style={ABS} />
          <View style={{ position: 'absolute', top: insets.top + 6, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => router.back()} style={iconBtn}>
              <Icon name="chevronLeft" size={19} color="#fff" />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={onFav} style={iconBtn}>
                <Icon name={fav ? 'heartFilled' : 'heart'} size={19} color={fav ? '#ff8f6a' : '#fff'} />
              </Pressable>
              <Pressable style={iconBtn}>
                <Icon name="share" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Body overlaps hero */}
        <View style={{ paddingHorizontal: 20, marginTop: -58, gap: 20 }}>
          <View style={{ gap: 12 }}>
            {recipe.tags.length ? (
              <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap' }}>
                {recipe.tags.slice(0, 3).map((t, i) => (
                  <Tag key={t} label={t} tone={i === 0 ? 'sage' : 'accent'} />
                ))}
              </View>
            ) : null}
            <Text style={{ fontFamily: fonts.heading, fontSize: 34, lineHeight: 36, color: theme.txt }}>{recipe.title}</Text>
            {recipe.description ? (
              <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: theme.dim }}>{recipe.description}</Text>
            ) : null}
          </View>

          {/* Stat pills */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatPill value={total ? `${total} min` : '—'} label="total" />
            <StatPill value={String(servings)} label="servings" />
            <StatPill value={difficultyLabel(recipe)} label="effort" />
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', padding: 5, borderRadius: radius.pill, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, gap: 4 }}>
            {([['ing', 'Ingredients'], ['steps', 'Instructions'], ['notes', 'Notes']] as [Tab, string][]).map(([key, label]) => {
              const on = tab === key;
              return on ? (
                <Pressable key={key} onPress={() => setTab(key)} style={{ flex: 1, borderRadius: radius.pill, overflow: 'hidden' }}>
                  <LinearGradient colors={[theme.accsFrom, theme.accsTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: theme.onAccent }}>{label}</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <Pressable key={key} onPress={() => setTab(key)} style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: theme.dim }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          {tab === 'ing' ? (
            <View style={{ gap: 14 }}>
              {/* Scale card */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 18, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
                <View style={{ gap: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: theme.txt }}>Scale it</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, color: theme.dim2 }}>quantities update live</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Pressable onPress={() => setServings((n) => Math.max(1, n - 1))} style={{ width: 36, height: 36, borderRadius: radius.pill, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="minus" size={16} color={theme.txt} />
                  </Pressable>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: theme.txt, minWidth: 22, textAlign: 'center' }}>{servings}</Text>
                  <Pressable onPress={() => setServings((n) => Math.min(20, n + 1))} style={{ width: 36, height: 36, borderRadius: radius.pill, overflow: 'hidden' }}>
                    <LinearGradient colors={[theme.accsFrom, theme.accsTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="plus" size={16} color={theme.onAccent} />
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>

              {/* Checklist — grouped by category once an import supplies two or more, flat otherwise */}
              <IngredientChecklist
                ingredients={recipe.ingredients}
                scale={scale}
                checked={checked}
                onToggle={(i) => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              />
            </View>
          ) : null}

          {tab === 'steps' ? (
            <View style={{ gap: 16 }}>
              {recipe.steps.map((s, i) => {
                const mins = stepMinutes(s);
                return (
                  <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
                    <View style={{ width: 32, height: 32, borderRadius: radius.pill, backgroundColor: theme.card2, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: theme.acc }}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 6, paddingTop: 3 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: theme.txt }}>{s.text}</Text>
                      {mins ? (
                        <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card, paddingVertical: 5, paddingHorizontal: 11, borderRadius: radius.pill }}>
                          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: theme.acc }}>{mins} min timer</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {tab === 'notes' ? (
            <View style={{ padding: 18, borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, gap: 8 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2 }}>My notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                onBlur={() => saveNotes(recipe.id, notes)}
                placeholder="Tweaks, timings, what you'd change next time…"
                placeholderTextColor={theme.dim2}
                multiline
                style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: theme.txt, minHeight: 80, textAlignVertical: 'top' }}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      {recipe.steps.length ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingBottom: insets.bottom + 14, paddingTop: 14 }}>
          <LinearGradient colors={['transparent', theme.bg]} style={{ ...ABS, top: -30 }} pointerEvents="none" />
          <GradientButton
            label="Start cooking"
            icon="flame"
            height={60}
            onPress={() => router.push(`/cook/${recipe.id}?servings=${servings}`)}
          />
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  meat: 'Meat',
  seafood: 'Seafood',
  pantry: 'Pantry',
  spices: 'Spices & herbs',
  bakery: 'Bakery',
  frozen: 'Frozen',
  other: 'Other',
};
// Roughly "shop the perimeter first" order — produce/meat/seafood/dairy/bakery
// tend to be fresh sections, pantry/spices/frozen are aisles.
const CATEGORY_ORDER = ['produce', 'meat', 'seafood', 'dairy', 'bakery', 'pantry', 'spices', 'frozen', 'other'];

function IngredientRow({
  ingredient,
  scale,
  done,
  onToggle,
}: {
  ingredient: Ingredient;
  scale: number;
  done: boolean;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const label = [
    ingredient.quantity !== null ? formatQuantity(ingredient.quantity * scale) : '',
    ingredient.unit ?? '',
    ingredient.name,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      onPress={onToggle}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.line }}
    >
      {done ? (
        <View style={{ width: 26, height: 26, borderRadius: radius.pill, backgroundColor: theme.sage, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={15} color="#1a1f14" />
        </View>
      ) : (
        <View style={{ width: 26, height: 26, borderRadius: radius.pill, borderWidth: 2, borderColor: theme.line }} />
      )}
      <Text style={{ flex: 1, fontFamily: done ? fonts.body : fonts.bodyMedium, fontSize: 16, color: done ? theme.dim2 : theme.txt, textDecorationLine: done ? 'line-through' : 'none' }}>
        {label}
        {ingredient.note ? <Text style={{ color: theme.dim2 }}>, {ingredient.note}</Text> : null}
      </Text>
    </Pressable>
  );
}

/**
 * Flat list when there's nothing to group by (manual entries, older imports
 * with no category), otherwise grouped under a small heading per category —
 * this is the payoff for the Groq schema carrying `category` per ingredient.
 */
function IngredientChecklist({
  ingredients,
  scale,
  checked,
  onToggle,
}: {
  ingredients: Ingredient[];
  scale: number;
  checked: Record<number, boolean>;
  onToggle: (index: number) => void;
}) {
  const { theme } = useTheme();
  const categories = new Set(ingredients.map((ing) => ing.category).filter((c): c is string => !!c));

  if (categories.size < 2) {
    return (
      <View>
        {ingredients.map((ing, i) => (
          <IngredientRow key={i} ingredient={ing} scale={scale} done={!!checked[i]} onToggle={() => onToggle(i)} />
        ))}
      </View>
    );
  }

  const groups = new Map<string, number[]>();
  ingredients.forEach((ing, i) => {
    const key = ing.category ?? 'other';
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(i);
  });
  const orderedKeys = [...groups.keys()].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );

  return (
    <View style={{ gap: 20 }}>
      {orderedKeys.map((key) => (
        <View key={key}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.dim2, marginBottom: 2 }}>
            {CATEGORY_LABEL[key] ?? 'Other'}
          </Text>
          {groups.get(key)!.map((i) => (
            <IngredientRow key={i} ingredient={ingredients[i]} scale={scale} done={!!checked[i]} onToggle={() => onToggle(i)} />
          ))}
        </View>
      ))}
    </View>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, paddingVertical: 13, borderRadius: radius.md, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: 'center', gap: 3 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 19, color: theme.txt }}>{value}</Text>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.7, textTransform: 'uppercase', color: theme.dim2 }}>{label}</Text>
    </View>
  );
}
