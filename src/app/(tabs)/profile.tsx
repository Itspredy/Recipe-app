import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { PhotoSlot, ScreenBackground } from '../../components/ui';
import { listRecipes } from '../../db/store';
import { checkProEntitlement, ENTITLEMENT_ID } from '../../lib/purchases';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, radius } from '../../lib/theme';
import type { RecipeSummary } from '../../lib/types';
import { useUser } from '../../lib/UserProvider';

const PRIVACY_POLICY_URL = 'https://privacy-policy-rust-two.vercel.app/';
const TERMS_OF_SERVICE_URL = 'https://terms-of-service-omega.vercel.app/';
const SUPPORT_EMAIL = 'khatrikunal457@gmail.com';

export default function ProfileScreen() {
  const { theme, toggle } = useTheme();
  const { name } = useUser();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [isPro, setIsPro] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listRecipes().then(setRecipes);
      checkProEntitlement().then(setIsPro);
    }, []),
  );

  const saved = recipes.length;
  const cooked = recipes.filter((r) => r.cookedCount > 0).length;
  const favourites = recipes.filter((r) => r.isFavorite).length;

  const appVersion = Constants.expoConfig?.version ?? '—';

  const settings = [
    { label: 'Units', value: 'Imperial' },
    { label: 'Appearance', value: theme.isDark ? 'Dark' : 'Light' },
    { label: 'About Keepdish', value: appVersion },
  ];

  const links = [
    { label: 'Contact support', onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`) },
    { label: 'Privacy Policy', onPress: () => Linking.openURL(PRIVACY_POLICY_URL) },
    { label: 'Terms of Service', onPress: () => Linking.openURL(TERMS_OF_SERVICE_URL) },
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
            <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: theme.txt }}>{name || 'Add your name'}</Text>
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
            </View>
          ))}
        </View>

        <View style={{ borderRadius: radius.lg, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
          {links.map((l, i) => (
            <Pressable
              key={l.label}
              onPress={l.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                borderBottomWidth: i < links.length - 1 ? 1 : 0,
                borderBottomColor: theme.line,
              }}
            >
              <Text style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: 16, color: theme.txt }}>{l.label}</Text>
              <Icon name="chevronRight" size={16} color={theme.dim2} />
            </Pressable>
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

        {Platform.OS !== 'web' && !isPro ? (
          <Pressable
            onPress={() =>
              RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: ENTITLEMENT_ID }).then(() =>
                checkProEntitlement().then(setIsPro),
              )
            }
            style={{
              height: 52,
              borderRadius: radius.md,
              backgroundColor: theme.acc,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
            }}
          >
            <Icon name="sparkles" size={17} color={theme.onAccent} />
            <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: theme.onAccent }}>Upgrade to Pro</Text>
          </Pressable>
        ) : null}

        {Platform.OS !== 'web' ? (
          <Pressable
            onPress={() => RevenueCatUI.presentCustomerCenter()}
            style={{
              height: 52,
              borderRadius: radius.md,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
            }}
          >
            <Icon name="star" size={17} color={theme.acc} />
            <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: theme.txt }}>Manage subscription</Text>
          </Pressable>
        ) : null}
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
