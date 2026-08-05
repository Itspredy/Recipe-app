import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Headline, IconTile, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useOnboarding, type HouseholdSize } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const OPTIONS: { id: HouseholdSize; title: string; subtitle: string; icon: 'userFilled' | 'people' }[] = [
  { id: 'solo', title: 'Just me', subtitle: '1 serving · leftovers optional', icon: 'userFilled' },
  { id: 'plusOne', title: 'Me + 1', subtitle: '2 servings · scaled for two', icon: 'people' },
  { id: 'family', title: 'A family', subtitle: '4+ servings · kid-friendly first', icon: 'people' },
  { id: 'roommates', title: 'Roommates & friends', subtitle: 'Shared lists · split the shop', icon: 'people' },
];

export default function HouseholdScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { answers, update } = useOnboarding();

  return (
    <OnboardingScreen
      step="household"
      footer={<PrimaryCTA label="Continue" onPress={() => router.push('/onboarding/grocery')} />}
    >
      <Headline size={30}>Who are you cooking for?</Headline>
      <Body style={{ marginTop: 12 }}>We&apos;ll scale every recipe automatically.</Body>

      <View style={{ marginTop: 22, gap: 12 }}>
        {OPTIONS.map((option) => {
          const selected = answers.household === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => update('household', option.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 14,
                borderRadius: 22,
                backgroundColor: selected ? `${theme.acc}1A` : theme.card,
                borderWidth: selected ? 1.5 : 1,
                borderColor: selected ? theme.acc : theme.line,
              }}
            >
              <IconTile size={48} colors={selected ? [theme.accsFrom, theme.accsTo] : [theme.dim2, theme.dim]}>
                <Icon name={option.icon} size={20} color="#fff" />
              </IconTile>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 16 }}>{option.title}</Text>
                <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 13, marginTop: 2 }}>{option.subtitle}</Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selected ? theme.acc : theme.line,
                  backgroundColor: selected ? theme.acc : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected ? <Icon name="check" size={13} color={theme.onAccent} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}
