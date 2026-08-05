import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Headline, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

type Item = { id: string; name: string; qty: string };

function useCategories() {
  const { answers } = useOnboarding();
  const spaghetti = answers.dietary.includes('gluten-free') ? 'Gluten-free spaghetti' : 'Spaghetti';

  const produce: Item[] = [
    { id: 'garlic', name: 'Garlic', qty: '1 bulb' },
    { id: 'onions', name: 'Spring onions', qty: '1 bunch' },
    { id: 'lemons', name: 'Lemons', qty: '2' },
    { id: 'spinach', name: 'Baby spinach', qty: '200 g' },
  ];
  const pantry: Item[] = [
    { id: 'spaghetti', name: spaghetti, qty: '400 g' },
    { id: 'miso', name: 'White miso paste', qty: '1 tub' },
    { id: 'sesame', name: 'Sesame oil', qty: '1 bottle' },
  ];
  const dairy: Item[] = [
    { id: 'butter', name: 'Salted butter', qty: '90 g' },
    { id: 'parmesan', name: 'Parmesan', qty: '80 g' },
  ];

  return [
    { id: 'produce', label: 'Produce', color: '#728157', items: produce },
    { id: 'pantry', label: 'Pantry', color: '#B26220', items: pantry },
    { id: 'dairy', label: 'Dairy', color: '#C67139', items: dairy },
  ];
}

export default function GroceryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const categories = useCategories();
  const [checked, setChecked] = useState<Set<string>>(new Set(['garlic', 'onions']));

  const toggle = (id: string) =>
    setChecked((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <OnboardingScreen
      step="grocery"
      scroll
      footer={<PrimaryCTA label="Looks good" onPress={() => router.push('/onboarding/notifications')} />}
    >
      <Headline size={28}>
        Every recipe you planned, <Headline size={28} style={{ color: theme.acc }}>one list.</Headline>
      </Headline>
      <Text style={{ marginTop: 10, color: theme.dim, fontFamily: fonts.body, fontSize: 15.5, lineHeight: 22 }}>
        Sorted by aisle, scaled for two. 4 recipes this week.
      </Text>

      <View style={{ marginTop: 20, gap: 14 }}>
        {categories.map((cat) => {
          const doneCount = cat.items.filter((i) => checked.has(i.id)).length;
          return (
            <View key={cat.id} style={{ padding: 16, borderRadius: 22, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cat.color }} />
                <Text style={{ flex: 1, color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {cat.label}
                </Text>
                <Text style={{ color: theme.dim, fontFamily: fonts.bodyMedium, fontSize: 12 }}>
                  {doneCount} of {cat.items.length}
                </Text>
              </View>

              <View style={{ marginTop: 10, gap: 2 }}>
                {cat.items.map((item) => {
                  const done = checked.has(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => toggle(item.id)}
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
                          color: done ? theme.dim : theme.txt,
                          fontFamily: fonts.bodyMedium,
                          fontSize: 14.5,
                          textDecorationLine: done ? 'line-through' : 'none',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 13 }}>{item.qty}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}
