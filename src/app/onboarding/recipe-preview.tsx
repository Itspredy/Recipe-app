import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { PhotoSlot } from '../../components/ui';
import { Body, Float, Headline, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const INGREDIENTS = [
  'Spaghetti — 200 g',
  'White miso paste — 2 tbsp',
  'Salted butter — 45 g',
  'Garlic, thinly sliced — 3 cloves',
  'Parmesan, grated — 40 g',
];

export default function RecipePreviewScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <OnboardingScreen
      step="recipe-preview"
      scroll
      footer={<PrimaryCTA label="Let's cook it" onPress={() => router.push('/onboarding/cook-mode')} />}
    >
      <Headline size={30}>
        That&apos;s it. <Headline size={30} style={{ color: theme.acc }}>Saved forever.</Headline>
      </Headline>
      <Body style={{ marginTop: 10 }}>Structured, searchable, and yours offline.</Body>

      <Float distance={5} duration={4200} style={{ marginTop: 22 }}>
        <View style={{ borderRadius: 26, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, overflow: 'hidden', ...theme.shadow }}>
          <View style={{ height: 168 }}>
            <PhotoSlot title="Creamy Miso Butter Pasta" icon="restaurant" />
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <Icon name="check" size={11} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontFamily: fonts.bodyBold }}>From TikTok</Text>
            </View>
          </View>

          <View style={{ padding: 18 }}>
            <Text style={{ color: theme.txt, fontFamily: fonts.heading, fontSize: 22 }}>Creamy Miso Butter Pasta</Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              {['4 servings', '25 min', '7 items'].map((label) => (
                <View key={label} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: theme.card2 }}>
                  <Text style={{ fontSize: 12, fontFamily: fonts.bodyBold, color: theme.txt }}>{label}</Text>
                </View>
              ))}
            </View>

            <Text style={{ marginTop: 18, color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              Ingredients
            </Text>
            <View style={{ marginTop: 10, gap: 10 }}>
              {INGREDIENTS.map((line, i) => (
                <Text
                  key={line}
                  style={{
                    color: theme.txt,
                    fontFamily: fonts.body,
                    fontSize: 14.5,
                    opacity: i === INGREDIENTS.length - 1 ? 0.55 : 1,
                  }}
                >
                  {line}
                </Text>
              ))}
            </View>
            <Text style={{ marginTop: 8, color: theme.acc, fontFamily: fonts.bodyBold, fontSize: 13 }}>+ 2 more</Text>
          </View>
        </View>
      </Float>
    </OnboardingScreen>
  );
}
