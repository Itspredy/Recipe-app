import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, IconTile, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const TIMELINE = [
  {
    date: 'Today',
    colors: ['#EFB169', '#C67139'] as [string, string],
    icon: 'checkCircle' as const,
    body: 'Every recipe you’ve saved becomes cookable — with zero charge to start.',
  },
  {
    date: 'In 5 days',
    colors: ['#FF9E86', '#B26220'] as [string, string],
    icon: 'bell' as const,
    body: 'We’ll remind you two days before the trial ends. Cancel anytime.',
  },
  {
    date: 'In 7 days',
    colors: ['#9AAA78', '#728157'] as [string, string],
    icon: 'star' as const,
    body: 'Your plan begins. Cancel any time before this day and you pay nothing.',
  },
];

export default function PaywallScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');

  return (
    <OnboardingScreen
      step="paywall"
      scroll
      footer={
        <View style={{ gap: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: theme.card2, marginBottom: -14, zIndex: 1 }}>
              <Text style={{ fontSize: 12, fontFamily: fonts.bodyBold, color: theme.txt }}>7 days free trial</Text>
            </View>
          </View>
          <PrimaryCTA label="Continue" onPress={() => router.push('/onboarding/signin')} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="check" size={13} color={theme.sage} />
            <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 12.5 }}>No payment required now</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
            <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 12 }}>Privacy Policy</Text>
            <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 12 }}>Restore</Text>
            <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 12 }}>Terms of Service</Text>
          </View>
        </View>
      }
    >
      <Text style={{ color: theme.txt, fontFamily: fonts.heading, fontSize: 28, lineHeight: 33 }}>
        Cook everything you save.{'\n'}
        <Text style={{ color: theme.acc }}>Free for 7 days.</Text>
      </Text>

      <View style={{ marginTop: 22, gap: 16 }}>
        {TIMELINE.map((step, i) => (
          <View key={step.date} style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ alignItems: 'center' }}>
              <IconTile size={38} colors={step.colors}>
                <Icon name={step.icon} size={17} color="#fff" />
              </IconTile>
              {i < TIMELINE.length - 1 ? <View style={{ width: 2, flex: 1, backgroundColor: theme.line, marginTop: 4 }} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: 6 }}>
              <Text style={{ color: theme.txt, fontFamily: fonts.heading, fontSize: 17 }}>{step.date}</Text>
              <Body style={{ marginTop: 4, fontSize: 14 }}>{step.body}</Body>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 8, gap: 12 }}>
        <Pressable
          onPress={() => setPlan('annual')}
          style={{
            padding: 16,
            borderRadius: 22,
            backgroundColor: plan === 'annual' ? `${theme.acc}1A` : theme.card,
            borderWidth: plan === 'annual' ? 1.5 : 1,
            borderColor: plan === 'annual' ? theme.acc : theme.line,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 16 }}>1 Year</Text>
              <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 13, marginTop: 2 }}>$4.17 / month</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999, backgroundColor: theme.acc, marginBottom: 6 }}>
                <Text style={{ fontSize: 10.5, fontFamily: fonts.bodyBold, color: theme.onAccent }}>SAVE 85%</Text>
              </View>
              <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 16 }}>$49.99</Text>
            </View>
          </View>
          {plan === 'annual' ? (
            <View style={{ marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.line }}>
              <Text style={{ color: theme.acc, fontFamily: fonts.bodyBold, fontSize: 12, textAlign: 'center' }}>Most Popular</Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable
          onPress={() => setPlan('monthly')}
          style={{
            padding: 16,
            borderRadius: 22,
            backgroundColor: plan === 'monthly' ? `${theme.acc}1A` : theme.card,
            borderWidth: plan === 'monthly' ? 1.5 : 1,
            borderColor: plan === 'monthly' ? theme.acc : theme.line,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 16 }}>1 Month</Text>
          <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 16 }}>$19.99 / month</Text>
        </Pressable>
      </View>
    </OnboardingScreen>
  );
}
