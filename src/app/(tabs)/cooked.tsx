import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { PhotoSlot, ScreenBackground } from '../../components/ui';
import { listCooked } from '../../db/store';
import { useTheme } from '../../lib/ThemeProvider';
import { relativeTime } from '../../lib/format';
import { fonts, radius } from '../../lib/theme';
import { totalMinutes, type RecipeSummary } from '../../lib/types';

const MONTH = 2_592_000_000;

export default function CookedScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cooked, setCooked] = useState<RecipeSummary[]>([]);

  useFocusEffect(
    useCallback(() => {
      listCooked().then(setCooked);
    }, []),
  );

  const thisMonth = cooked.filter((r) => r.lastCookedAt && Date.now() - r.lastCookedAt < MONTH);
  const totalMins = cooked.reduce((sum, r) => sum + totalMinutes(r) * Math.max(1, r.cookedCount), 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 132, gap: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: theme.txt }}>Cooked</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat value={String(thisMonth.length)} label="this month" color={theme.acc} />
          <Stat value={hours ? `${hours}h ${mins}m` : `${mins}m`} label="at the stove" color={theme.sage} />
        </View>

        {cooked.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center', gap: 8 }}>
            <Icon name="flame" size={30} color={theme.dim2} />
            <Text style={{ fontFamily: fonts.body, fontSize: 15, color: theme.dim, textAlign: 'center' }}>
              Recipes show up here once you finish cooking them.
            </Text>
          </View>
        ) : (
          cooked.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/recipe/${r.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 10,
                borderRadius: radius.lg,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.line,
              }}
            >
              <View style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden' }}>
                {r.imageUrl ? <Image source={r.imageUrl} style={{ flex: 1 }} contentFit="cover" /> : <PhotoSlot title={r.title} />}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: theme.txt }} numberOfLines={1}>
                  {r.title}
                </Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.dim }}>
                  {relativeTime(r.lastCookedAt)} · {totalMinutes(r)} min
                </Text>
              </View>
              <Icon name="chevronRight" size={17} color={theme.dim2} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, padding: 16, borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 28, color }}>{value}</Text>
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: theme.dim }}>{label}</Text>
    </View>
  );
}
