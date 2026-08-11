import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Body, Headline, OnboardingScreen, PrimaryCTA, SelectChip } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';

const RESTRICTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergy', 'Shellfish', 'Halal'];

export default function DietaryScreen() {
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
        So we know what matters to you as Keepdish grows.
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
    </OnboardingScreen>
  );
}
