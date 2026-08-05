import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '../../components/Icon';
import { Body, Headline, IconTile, OnboardingScreen, PrimaryCTA } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const SOURCES: { id: string; label: string; icon: IconName; colors: [string, string] }[] = [
  { id: 'tiktok', label: 'TikTok', icon: 'logoTiktok', colors: ['#3B2E4F', '#1A1023'] },
  { id: 'instagram', label: 'Instagram', icon: 'logoInstagram', colors: ['#EFB169', '#B26220'] },
  { id: 'youtube', label: 'YouTube', icon: 'logoYoutube', colors: ['#D9773C', '#A8481F'] },
  { id: 'pinterest', label: 'Pinterest', icon: 'logoPinterest', colors: ['#DFA06A', '#9C4A1E'] },
  { id: 'blogs', label: 'Food blogs', icon: 'blog', colors: ['#9AAA78', '#728157'] },
  { id: 'screenshots', label: 'Screenshots', icon: 'screenshot', colors: ['#DCD3C4', '#8C7A62'] },
];

export default function SourcesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { answers, toggleSource } = useOnboarding();
  const count = answers.sources.length;

  return (
    <OnboardingScreen
      step="sources"
      footer={
        <PrimaryCTA
          label={count > 0 ? `Continue · ${count} selected` : 'Continue'}
          disabled={count === 0}
          onPress={() => router.push('/onboarding/imports')}
        />
      }
    >
      <Headline size={30}>Where do you find recipes?</Headline>
      <Body style={{ marginTop: 12, maxWidth: 300 }}>
        Pick all that apply — we&apos;ll show you the fastest way to save from each.
      </Body>

      <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {SOURCES.map((source) => {
          const selected = answers.sources.includes(source.id);
          return (
            <Pressable
              key={source.id}
              onPress={() => toggleSource(source.id)}
              style={{
                width: '46.5%',
                padding: 16,
                borderRadius: 22,
                backgroundColor: selected ? `${theme.acc}1A` : theme.card,
                borderWidth: selected ? 1.5 : 1,
                borderColor: selected ? theme.acc : theme.line,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <IconTile size={46} colors={source.colors}>
                  <Icon name={source.icon} size={20} color="#fff" />
                </IconTile>
                {selected ? (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: theme.acc,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="check" size={13} color={theme.onAccent} />
                  </View>
                ) : null}
              </View>
              <Text style={{ marginTop: 12, color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 15.5 }}>
                {source.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}
