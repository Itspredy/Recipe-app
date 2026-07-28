import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { PhotoSlot, ScreenBackground } from '../../components/ui';
import { listRecipes } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, radius } from '../../lib/theme';
import type { RecipeSummary } from '../../lib/types';

export default function ProfileScreen() {
  const { theme, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      listRecipes().then(setRecipes);
    }, []),
  );

  const saved = recipes.length;
  const cooked = recipes.filter((r) => r.cookedCount > 0).length;
  const favourites = recipes.filter((r) => r.isFavorite).length;

  const settings = [
    { label: 'Units', value: 'Imperial' },
    { label: 'Appearance', value: theme.isDark ? 'Dark' : 'Light' },
    { label: 'iCloud sync', value: 'On' },
    { label: 'About Recipe', value: '2.1' },
  ];

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 132, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 74, height: 74, borderRadius: radius.pill, overflow: 'hidden', borderWidth: 1, borderColor: theme.line }}>
            <PhotoSlot icon="userFilled" />
          </View>
          <View style={{ gap: 3 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: theme.txt }}>Alex Mercer</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: theme.dim }}>alex@mercer.co</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat value={String(saved)} label="saved" color={theme.acc} />
          <Stat value={String(cooked)} label="cooked" color={theme.sage} />
          <Stat value={String(favourites)} label="favourites" color={theme.txt} />
        </View>

        <View style={{ borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
          {settings.map((s, i) => (
            <View
              key={s.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                borderBottomWidth: i < settings.length - 1 ? 1 : 0,
                borderBottomColor: theme.line,
              }}
            >
              <Text style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: 16, color: theme.txt }}>{s.label}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: theme.dim }}>{s.value}</Text>
              <Icon name="chevronRight" size={16} color={theme.dim2} />
            </View>
          ))}
        </View>

        <Pressable
          onPress={toggle}
          style={{
            height: 52,
            borderRadius: radius.md,
            backgroundColor: theme.card2,
            borderWidth: 1,
            borderColor: theme.line,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
          }}
        >
          <Icon name={theme.isDark ? 'sun' : 'moon'} size={19} color={theme.txt} />
          <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: theme.txt }}>Switch appearance</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 26, color }}>{value}</Text>
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.dim }}>{label}</Text>
    </View>
  );
}
