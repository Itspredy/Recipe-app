import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Headline, OnboardingScreen, PrimaryCTA, SelectChip } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const RESTRICTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergy', 'Shellfish', 'Halal'];

export default function DietaryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { answers, toggleDietary } = useOnboarding();
  const hasAny = answers.dietary.length > 0;

  return (
    <OnboardingScreen
      step="dietary"
      footer={<PrimaryCTA label="Continue" disabled={!hasAny} onPress={() => router.push('/onboarding/household')} />}
    >
      <Headline size={30}>Anything you avoid?</Headline>
      <Body style={{ marginTop: 12, maxWidth: 320 }}>
        So we never suggest something you can&apos;t eat — and swap it out automatically.
      </Body>

      <View style={{ marginTop: 22, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {RESTRICTIONS.map((label) => {
          const id = label.toLowerCase().replace(/[^a-z]+/g, '-');
          return (
            <SelectChip key={id} label={label} selected={answers.dietary.includes(id)} onPress={() => toggleDietary(id)} />
          );
        })}
        <SelectChip
          label="Nothing — I eat everything"
          selected={answers.dietary.includes('none')}
          onPress={() => toggleDietary('none')}
          dashed
        />
      </View>

      {answers.dietary.length > 0 && !answers.dietary.includes('none') ? (
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            padding: 14,
            borderRadius: 18,
            backgroundColor: theme.card2,
          }}
        >
          <Icon name="infoCircle" size={18} color={theme.acc} />
          <Text style={{ flex: 1, color: theme.dim, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19 }}>
            Miso pasta will swap to{' '}
            <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold }}>
              {answers.dietary.includes('gluten-free') ? 'gluten-free spaghetti' : 'an ingredient that fits'}
            </Text>
            .
          </Text>
        </View>
      ) : null}
    </OnboardingScreen>
  );
}
