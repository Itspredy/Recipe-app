import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Body, GlassCard, Headline, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';
import { useUser } from '../../lib/UserProvider';

function timeLabel(): string {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: 'long' });
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day}, ${time}`;
}

export default function NameScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { answers, update } = useOnboarding();
  const { setName } = useUser();
  const [focused, setFocused] = useState(false);
  const canContinue = answers.name.trim().length > 0;
  const displayName = answers.name.trim() || 'Alex';

  return (
    <OnboardingScreen
      step="name"
      footer={<PrimaryCTA label="Nice to meet you" disabled={!canContinue} onPress={() => router.push('/onboarding/sources')} />}
    >
      <Headline size={32}>What should we call you?</Headline>
      <Body style={{ marginTop: 12, maxWidth: 320 }}>
        Just a first name — it goes on your greeting and nowhere else.
      </Body>

      <View
        style={{
          marginTop: 28,
          padding: 20,
          borderRadius: 24,
          backgroundColor: theme.card,
          borderWidth: 1.5,
          borderColor: focused ? theme.acc : theme.line,
        }}
      >
        <Text
          style={{
            color: theme.dim,
            fontFamily: fonts.bodyBold,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          First name
        </Text>
        <TextInput
          value={answers.name}
          onChangeText={(t) => {
            update('name', t);
            setName(t.trim());
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Alex"
          placeholderTextColor={theme.dim2}
          autoFocus
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => canContinue && router.push('/onboarding/sources')}
          style={{
            marginTop: 8,
            color: theme.txt,
            fontFamily: fonts.bodyMedium,
            fontSize: 24,
            padding: 0,
          }}
        />
      </View>

      <GlassCard style={{ marginTop: 18, flexDirection: 'row', gap: 13, alignItems: 'center' }}>
        <Image
          source={require('../../../assets/images/Icon-Real.png')}
          style={{ width: 40, height: 40, borderRadius: 11 }}
          contentFit="cover"
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.dim,
              fontFamily: fonts.bodyBold,
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            {timeLabel()}
          </Text>
          <Text style={{ marginTop: 4, color: theme.txt, fontFamily: fonts.heading, fontSize: 19 }}>
            What are we cooking, <Text style={{ color: theme.acc }}>{displayName}?</Text>
          </Text>
        </View>
      </GlassCard>

      <Body style={{ marginTop: 16, fontSize: 14 }}>No account yet — this stays on your phone.</Body>
    </OnboardingScreen>
  );
}
