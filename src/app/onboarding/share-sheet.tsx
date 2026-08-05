import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Body, Float, OnboardingScreen } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

function AppIcon({ label, colors, children }: { label: string; colors: [string, string]; children: React.ReactNode }) {
  return (
    <View style={{ alignItems: 'center', gap: 6, width: 66 }}>
      <LinearGradient colors={colors} style={{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </LinearGradient>
      <Text style={{ fontSize: 11, color: '#fff', fontFamily: fonts.body }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function ShareSheetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const goNext = () => router.push('/onboarding/watch');

  return (
    <OnboardingScreen step="share-sheet" scroll={false}>
      <View style={{ flex: 1, borderRadius: 28, overflow: 'hidden', backgroundColor: '#120C16' }}>
        <LinearGradient colors={['#3B2E4F', '#171018']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <LinearGradient
          colors={['rgba(18,12,22,0.35)', 'rgba(18,12,22,0.72)', 'rgba(18,12,22,0.94)']}
          locations={[0, 0.55, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <View style={{ position: 'absolute', top: 24, left: 20, right: 20, padding: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <Text style={{ color: '#fff', fontFamily: fonts.heading, fontSize: 22, lineHeight: 26 }}>
            Share → KeepDish.{'\n'}That&apos;s the whole flow.
          </Text>
          <Text style={{ marginTop: 8, color: 'rgba(255,255,255,0.75)', fontFamily: fonts.body, fontSize: 14 }}>
            From any app. Two taps, no copy-paste.
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(251,243,230,0.96)',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 10,
            paddingBottom: 26,
            paddingHorizontal: 18,
          }}
        >
          <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: 'rgba(32,30,29,0.2)' }} />

          <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#2A1A12', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="playCircle" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#201E1D', fontFamily: fonts.bodyBold, fontSize: 15 }} numberOfLines={1}>
                Creamy Miso Butter Pasta
              </Text>
              <Text style={{ color: '#6B5F52', fontFamily: fonts.body, fontSize: 12, marginTop: 2 }}>tiktok.com · Video</Text>
            </View>
            <Text style={{ color: '#3E7BEE', fontFamily: fonts.bodyMedium, fontSize: 13 }}>Options ›</Text>
          </View>

          <View style={{ marginTop: 20, flexDirection: 'row', gap: 12 }}>
            <AppIcon label="AirDrop" colors={['#5CA8FF', '#0A62D6']}>
              <Icon name="share" size={20} color="#fff" />
            </AppIcon>
            <AppIcon label="Messages" colors={['#6FE87A', '#12B31F']}>
              <Icon name="mail" size={20} color="#fff" />
            </AppIcon>

            <Pressable onPress={goNext} style={{ alignItems: 'center', gap: 6, width: 66 }}>
              <Float distance={2} duration={1200}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.bg,
                    borderWidth: 2.5,
                    borderColor: theme.acc,
                  }}
                >
                  <Image source={require('../../../assets/images/icon.png')} style={{ width: 40, height: 40, borderRadius: 9 }} contentFit="cover" />
                </View>
              </Float>
              <Text style={{ fontSize: 11, color: '#201E1D', fontFamily: fonts.bodyBold }}>KeepDish</Text>
            </Pressable>

            <AppIcon label="Mail" colors={['#8ED0FF', '#1E7BE8']}>
              <Icon name="mail" size={20} color="#fff" />
            </AppIcon>
          </View>

          <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(32,30,29,0.1)', paddingTop: 8, gap: 2 }}>
            {['Copy', 'Add to Reading List', 'Save to Files'].map((label) => (
              <Text key={label} style={{ paddingVertical: 10, color: '#201E1D', fontFamily: fonts.body, fontSize: 15 }}>
                {label}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <Body style={{ marginTop: 12, textAlign: 'center', color: theme.dim }}>Tap the KeepDish icon to continue.</Body>
    </OnboardingScreen>
  );
}
