import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Float, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <OnboardingScreen
      step="index"
      showBack={false}
      footer={
        <View style={{ gap: 18 }}>
          <PrimaryCTA label="Get started" onPress={() => router.push('/onboarding/name')} />
          <Text
            style={{
              textAlign: 'center',
              color: theme.dim,
              fontFamily: fonts.bodyBold,
              fontSize: 12,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            Save recipes. Keep what you love.
          </Text>
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 60 }}>
        <Float distance={7} duration={3500} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <LinearGradient
            colors={[theme.accsFrom, theme.sage]}
            style={{
              position: 'absolute',
              width: 210,
              height: 210,
              borderRadius: 60,
              opacity: 0.45,
            }}
          />
          <Image
            source={require('../../../assets/images/Icon-Real.png')}
            style={{ width: 168, height: 168, borderRadius: 40 }}
            contentFit="cover"
          />
        </Float>

        <Text
          style={{
            marginTop: 44,
            textAlign: 'center',
            color: theme.txt,
            fontFamily: fonts.heading,
            fontSize: 38,
            lineHeight: 42,
          }}
        >
          Every recipe you save.{'\n'}
          <Text
            style={{
              color: theme.acc,
            }}
          >
            Finally cookable.
          </Text>
        </Text>

        <Text
          style={{
            marginTop: 18,
            maxWidth: 300,
            textAlign: 'center',
            color: theme.dim,
            fontFamily: fonts.body,
            fontSize: 16.5,
            lineHeight: 24,
          }}
        >
          TikTok, Reels, Shorts, blogs — we turn them into real recipes.
        </Text>
      </View>
    </OnboardingScreen>
  );
}
