import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Headline, OnboardingScreen, PrimaryCTA, Pulse, Spinner } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

function SkeletonBar({ width }: { width: `${number}%` }) {
  const { theme } = useTheme();
  return <View style={{ width, height: 9, borderRadius: 5, backgroundColor: theme.line }} />;
}

export default function WatchScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <OnboardingScreen
      step="watch"
      scroll
      footer={<PrimaryCTA label="See the result" onPress={() => router.push('/onboarding/recipe-preview')} />}
    >
      <Headline size={30}>Watch it work.</Headline>
      <Body style={{ marginTop: 10 }}>About eight seconds. Then it&apos;s yours forever.</Body>

      <View style={{ marginTop: 20, flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 128, height: 220, borderRadius: 22, overflow: 'hidden', backgroundColor: '#171018' }}>
          <Image
            source={require('../../../assets/images/Example.png')}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(18,12,22,0.05)', 'rgba(18,12,22,0.55)']}
            locations={[0.55, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: fonts.body }}>&quot;two tablespoons…&quot;</Text>
          </View>
        </View>

        <View style={{ flex: 1, padding: 16, borderRadius: 22, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pulse size={7} />
            <Text style={{ color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Assembling
            </Text>
          </View>
          <Text style={{ marginTop: 6, color: theme.txt, fontFamily: fonts.heading, fontSize: 15 }} numberOfLines={2}>
            Creamy Miso Butter Pasta
          </Text>

          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="checkCircle" size={14} color={theme.sage} />
              <Text style={{ color: theme.txt, fontSize: 12, fontFamily: fonts.bodyMedium }}>200g spaghetti</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="checkCircle" size={14} color={theme.sage} />
              <Text style={{ color: theme.txt, fontSize: 12, fontFamily: fonts.bodyMedium }}>2 tbsp white miso</Text>
            </View>
            <SkeletonBar width="78%" />
            <SkeletonBar width="56%" />
          </View>

          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
            <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: theme.card2 }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: theme.txt }}>4 servings</Text>
            </View>
            <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: theme.card2 }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: theme.txt }}>25 min</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 14, padding: 16, borderRadius: 20, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="checkCircle" size={16} color={theme.sage} />
          <Text style={{ color: theme.txt, fontFamily: fonts.bodyMedium, fontSize: 13 }}>Reading the video</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Spinner size={16} />
          <Text style={{ color: theme.txt, fontFamily: fonts.bodyMedium, fontSize: 13 }}>Listening for measurements…</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.5 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: theme.dim }} />
          <Text style={{ color: theme.dim, fontFamily: fonts.bodyMedium, fontSize: 13 }}>Building your recipe</Text>
        </View>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.line, overflow: 'hidden' }}>
          <LinearGradient colors={[theme.accsFrom, theme.accsTo]} style={{ width: '62%', height: '100%' }} />
        </View>
      </View>

      <Body style={{ marginTop: 14, textAlign: 'center' }}>Keep scrolling TikTok. We&apos;ll finish without you.</Body>
    </OnboardingScreen>
  );
}
