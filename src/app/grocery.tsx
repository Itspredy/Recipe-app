import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { ScreenBackground } from '../components/ui';
import { getRecipe, listRecipes } from '../db/store';
import { formatQuantity } from '../lib/format';
import {
  aggregateIngredients,
  getCheckedKeys,
  getSelectedRecipeIds,
  setCheckedKeys,
  setSelectedRecipeIds,
  type GroceryItem,
} from '../lib/grocery';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, radius } from '../lib/theme';
import type { Recipe, RecipeSummary } from '../lib/types';

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
const CATEGORY_ORDER = ['produce', 'meat', 'seafood', 'dairy', 'bakery', 'pantry', 'spices', 'frozen', 'other'];

export default function GroceryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [allRecipes, setAllRecipes] = useState<RecipeSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Promise.all([listRecipes(), getSelectedRecipeIds(), getCheckedKeys()]).then(
        ([recipes, ids, checkedKeys]) => {
          setAllRecipes(recipes);
          setSelectedIds(new Set(ids));
          setChecked(checkedKeys);
        },
      );
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      Promise.all([...selectedIds].map(getRecipe)).then((recipes) =>
        setSelectedRecipes(recipes.filter((r): r is Recipe => r !== null)),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds]),
  );

  const items = useMemo(() => aggregateIngredients(selectedRecipes), [selectedRecipes]);

  const groups = useMemo(() => {
    const map = new Map<string, GroceryItem[]>();
    for (const item of items) {
      const key = item.category ?? 'other';
      (map.get(key) ?? map.set(key, []).get(key)!).push(item);
    }
    return [...map.keys()]
      .sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))
      .map((key) => ({ key, label: CATEGORY_LABEL[key] ?? 'Other', items: map.get(key)! }));
  }, [items]);

  const toggleRecipe = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    setSelectedRecipeIds([...next]);
  };

  const toggleChecked = (key: string) => {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setChecked(next);
    setCheckedKeys(next);
  };

  const doneCount = items.filter((i) => checked.has(i.key)).length;

  return (
    <ScreenBackground>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, height: 44 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="chevronLeft" size={24} color={theme.txt} />
          </Pressable>
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: theme.txt, flex: 1 }}>Grocery list</Text>
          <Pressable
            onPress={() => setPickerOpen((o) => !o)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: radius.pill,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
            }}
          >
            <Icon name="plus" size={14} color={theme.acc} />
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: theme.acc }}>
              {selectedIds.size > 0 ? `${selectedIds.size} recipes` : 'Add recipes'}
            </Text>
          </Pressable>
        </View>

        {pickerOpen ? (
          <View
            style={{
              marginTop: 14,
              borderRadius: radius.lg,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
              overflow: 'hidden',
            }}
          >
            {allRecipes.length === 0 ? (
              <Text style={{ padding: 16, fontFamily: fonts.body, fontSize: 14, color: theme.dim }}>
                No saved recipes yet.
              </Text>
            ) : (
              allRecipes.map((r, i) => {
                const on = selectedIds.has(r.id);
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => toggleRecipe(r.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 14,
                      borderBottomWidth: i < allRecipes.length - 1 ? 1 : 0,
                      borderBottomColor: theme.line,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: on ? theme.acc : theme.line,
                        backgroundColor: on ? theme.acc : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on ? <Icon name="check" size={13} color={theme.onAccent} /> : null}
                    </View>
                    <Text style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.txt }}>
                      {r.title}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        ) : null}

        {selectedIds.size === 0 && !pickerOpen ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 80 }}>
            <Icon name="list" size={32} color={theme.dim2} />
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.dim, textAlign: 'center', maxWidth: 240 }}>
              Add recipes to build one combined shopping list, sorted by aisle.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingTop: 18, paddingBottom: 60, gap: 18 }} showsVerticalScrollIndicator={false}>
            {items.length > 0 ? (
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, color: theme.dim }}>
                {doneCount} of {items.length} · from {selectedRecipes.length} recipe{selectedRecipes.length === 1 ? '' : 's'}
              </Text>
            ) : null}

            {groups.map((group) => (
              <View key={group.key} style={{ gap: 2 }}>
                <Text
                  style={{
                    fontFamily: fonts.bodyBold,
                    fontSize: 12,
                    letterSpacing: 0.9,
                    textTransform: 'uppercase',
                    color: theme.dim2,
                    marginBottom: 6,
                  }}
                >
                  {group.label}
                </Text>
                {group.items.map((item) => {
                  const done = checked.has(item.key);
                  const qtyLabel = item.lines
                    .map((l) => (l.quantity !== null ? `${formatQuantity(l.quantity)}${l.unit ? ` ${l.unit}` : ''}` : ''))
                    .filter(Boolean)
                    .join(' + ');
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => toggleChecked(item.key)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: done ? theme.acc : theme.line,
                          backgroundColor: done ? theme.acc : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {done ? <Icon name="check" size={11} color={theme.onAccent} /> : null}
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: fonts.bodyMedium,
                          fontSize: 14.5,
                          color: done ? theme.dim : theme.txt,
                          textDecorationLine: done ? 'line-through' : 'none',
                        }}
                      >
                        {item.name}
                      </Text>
                      {qtyLabel ? (
                        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: theme.dim }}>{qtyLabel}</Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ScreenBackground>
  );
}
