import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { IconTile, OnboardingScreen } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

export default function VideoDemoScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const goShareSheet = () => router.push('/onboarding/share-sheet');

  return (
    <OnboardingScreen step="video-demo" scroll={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <IconTile size={58} colors={['#3B2E4F', '#1A1023']}>
          <Icon name="logoTiktok" size={26} color="#fff" />
        </IconTile>
        <IconTile size={72} colors={['#EFB169', '#B26220']}>
          <Icon name="logoInstagram" size={32} color="#fff" />
        </IconTile>
        <IconTile size={58} colors={['#D9773C', '#A8481F']}>
          <Icon name="logoYoutube" size={28} color="#fff" />
        </IconTile>
      </View>

      <Text
        style={{
          marginTop: 22,
          textAlign: 'center',
          color: theme.txt,
          fontFamily: fonts.heading,
          fontSize: 29,
          lineHeight: 32,
        }}
      >
        Smart video imports
      </Text>
      <Text
        style={{
          marginTop: 10,
          textAlign: 'center',
          color: theme.dim,
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          maxWidth: 320,
          alignSelf: 'center',
        }}
      >
        We <Text style={{ color: theme.acc, fontFamily: fonts.bodyBold }}>read</Text> and{' '}
        <Text style={{ color: theme.sage, fontFamily: fonts.bodyBold }}>listen</Text> to accurately save recipes
        from social media or websites.
      </Text>

      <View
        style={{
          marginTop: 20,
          flex: 1,
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: '#171018',
        }}
      >
        <LinearGradient
          colors={['#3B2E4F', '#1A1023']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <LinearGradient
          colors={['rgba(18,12,22,0.55)', 'rgba(18,12,22,0.05)', 'rgba(18,12,22,0.6)', 'rgba(18,12,22,0.92)']}
          locations={[0, 0.3, 0.72, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <View style={{ position: 'absolute', top: 16, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff', fontFamily: fonts.bodyBold, fontSize: 19 }}>Recipes</Text>
          <Icon name="camera" size={20} color="#fff" />
        </View>

        <View style={{ position: 'absolute', right: 14, bottom: 96, alignItems: 'center', gap: 16 }}>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Icon name="heart" size={25} color="#fff" />
            <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: '#fff' }}>225k</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Icon name="mail" size={25} color="#fff" />
            <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: '#fff' }}>818</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <Icon name="bag" size={25} color="#fff" />
            <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: '#fff' }}>25</Text>
          </View>

          <Pressable onPress={goShareSheet} hitSlop={16} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                position: 'absolute',
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.55)',
              }}
            />
            <LinearGradient
              colors={[theme.accsFrom, theme.accsTo]}
              style={{ width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="share" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ position: 'absolute', right: 78, bottom: 100 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: '#fff' }}>Tap here</Text>
        </View>

        <View style={{ position: 'absolute', left: 18, right: 86, bottom: 20, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Text style={{ fontSize: 14, fontFamily: fonts.bodyBold, color: '#fff' }}>Honeydew Cook</Text>
            <LinearGradient
              colors={[theme.accsFrom, theme.accsTo]}
              style={{ paddingVertical: 4, paddingHorizontal: 11, borderRadius: 999 }}
            >
              <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: '#fff' }}>Follow</Text>
            </LinearGradient>
          </View>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>Today&apos;s delicious miso butter pasta</Text>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)' }}>hot_stuff_cookin · Original Audio</Text>
        </View>
      </View>

      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <Icon name="home" size={22} color={theme.acc} />
        <Icon name="search" size={22} color={theme.dim} />
        <Icon name="globe" size={22} color={theme.dim} />
        <Icon name="bag" size={22} color={theme.dim} />
        <Icon name="userFilled" size={22} color={theme.dim} />
      </View>
    </OnboardingScreen>
  );
}
