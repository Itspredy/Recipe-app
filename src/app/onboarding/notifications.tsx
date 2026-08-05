import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import {
  Body,
  Float,
  GlassCard,
  Headline,
  IconTile,
  OnboardingScreen,
  PrimaryCTA,
  SecondaryCTA,
} from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { update } = useOnboarding();

  const proceed = (optedIn: boolean) => {
    update('notifications', optedIn);
    router.push('/onboarding/paywall');
  };

  return (
    <OnboardingScreen
      step="notifications"
      footer={
        <View style={{ gap: 12 }}>
          <PrimaryCTA label="Yes, remind me" onPress={() => proceed(true)} />
          <SecondaryCTA label="Not now" onPress={() => proceed(false)} />
        </View>
      }
    >
      <View style={{ alignItems: 'center', paddingTop: 12 }}>
        <Float distance={6} duration={3400}>
          <IconTile size={112} colors={[theme.accsFrom, theme.accsTo]}>
            <Icon name="bell" size={46} color="#fff" />
          </IconTile>
        </Float>

        <Text
          style={{
            marginTop: 30,
            textAlign: 'center',
            color: theme.txt,
            fontFamily: fonts.heading,
            fontSize: 28,
            lineHeight: 33,
            maxWidth: 320,
          }}
        >
          Want a nudge when it&apos;s time to cook?
        </Text>
        <Body style={{ marginTop: 10, textAlign: 'center', maxWidth: 300 }}>
          One message a day, at the hour you actually cook. Nothing else, ever.
        </Body>

        <GlassCard style={{ marginTop: 26, width: '100%', flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={{ width: 34, height: 34, borderRadius: 9 }}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.2 }}>
                KEEPDISH
              </Text>
              <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 11 }}>now</Text>
            </View>
            <Text style={{ marginTop: 4, color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 14.5 }}>
              Miso pasta takes 25 minutes
            </Text>
            <Text style={{ marginTop: 2, color: theme.dim, fontFamily: fonts.body, fontSize: 13.5 }}>
              You&apos;ve got everything for it. Start now?
            </Text>
          </View>
        </GlassCard>
      </View>
    </OnboardingScreen>
  );
}
