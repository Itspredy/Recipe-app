import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { Icon } from '../../components/Icon';
import { Body, Float, Headline, IconTile, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';

export default function ImportsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <OnboardingScreen step="imports" footer={<PrimaryCTA label="Show me how" onPress={() => router.push('/onboarding/video-demo')} />}>
      <View style={{ height: 340, marginTop: 6 }}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 380 400"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Defs>
            <SvgGradient id="kdArrow" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={theme.acc} stopOpacity={0} />
              <Stop offset="0.55" stopColor={theme.accsTo} stopOpacity={0.65} />
              <Stop offset="1" stopColor={theme.sage} stopOpacity={0.9} />
            </SvgGradient>
          </Defs>
          <Path d="M64 46 C 170 60 214 130 250 190" stroke="url(#kdArrow)" strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
          <Path d="M46 140 C 150 148 210 165 250 195" stroke="url(#kdArrow)" strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
          <Path d="M52 236 C 150 232 212 218 250 202" stroke="url(#kdArrow)" strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
          <Path d="M76 340 C 168 318 220 258 250 208" stroke="url(#kdArrow)" strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
        </Svg>

        <Float distance={7} duration={3000} style={{ position: 'absolute', left: 8, top: 24 }}>
          <IconTile size={46} colors={['#3B2E4F', '#1A1023']}>
            <Icon name="logoTiktok" size={20} color="#fff" />
          </IconTile>
        </Float>
        <Float distance={7} duration={3300} delay={200} style={{ position: 'absolute', left: -4, top: 118 }}>
          <IconTile size={46} colors={['#EFB169', '#B26220']}>
            <Icon name="logoInstagram" size={20} color="#fff" />
          </IconTile>
        </Float>
        <Float distance={7} duration={3600} delay={400} style={{ position: 'absolute', left: 2, top: 214 }}>
          <IconTile size={46} colors={['#D9773C', '#A8481F']}>
            <Icon name="logoYoutube" size={22} color="#fff" />
          </IconTile>
        </Float>
        <Float distance={7} duration={3100} delay={600} style={{ position: 'absolute', left: 26, top: 314 }}>
          <IconTile size={46} colors={['#9AAA78', '#728157']}>
            <Icon name="blog" size={20} color="#fff" />
          </IconTile>
        </Float>

        <Float distance={9} duration={4000} style={{ position: 'absolute', right: 6, top: 100 }}>
          <View
            style={{
              width: 158,
              height: 158,
              borderRadius: 40,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
              alignItems: 'center',
              justifyContent: 'center',
              ...theme.shadow,
            }}
          >
            <Image
              source={require('../../../assets/images/icon.png')}
              style={{ width: 108, height: 108, borderRadius: 26 }}
              contentFit="cover"
            />
          </View>
        </Float>
      </View>

      <Headline size={32} style={{ marginTop: 10 }}>
        We read <Headline size={32} style={{ color: theme.acc }}>and</Headline> listen.
      </Headline>
      <Body style={{ marginTop: 12, maxWidth: 330 }}>
        Images, audio, captions, on-screen text — we catch every ingredient, even the ones only said out loud.
      </Body>
    </OnboardingScreen>
  );
}
