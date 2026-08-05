import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { PhotoSlot } from '../../components/ui';
import { Float, OnboardingScreen } from '../../features/onboarding/components';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, radius } from '../../lib/theme';

function MiniCard({ title, meta, rotate }: { title: string; meta: string; rotate: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 128,
        borderRadius: 20,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.line,
        overflow: 'hidden',
        transform: [{ rotate: `${rotate}deg` }],
        ...theme.shadow,
      }}
    >
      <View style={{ height: 78 }}>
        <PhotoSlot icon="restaurant" title={title} />
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 12.5 }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 10.5, marginTop: 2 }}>{meta}</Text>
      </View>
    </View>
  );
}

function AuthButton({
  label,
  icon,
  tone,
  onPress,
}: {
  label: string;
  icon: 'logoApple' | 'logoGoogle' | 'mail';
  tone: 'dark' | 'light' | 'glass';
  onPress: () => void;
}) {
  const { theme } = useTheme();
  // Apple/Google brand buttons keep their fixed brand colors regardless of app theme;
  // only the "glass" email button follows dark/light mode.
  const bg = tone === 'dark' ? '#1A1310' : tone === 'light' ? '#fff' : theme.card;
  const fg = tone === 'dark' ? '#fff' : tone === 'light' ? '#3C4043' : theme.txt;
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 58,
        borderRadius: radius.xl,
        backgroundColor: bg,
        borderWidth: tone === 'glass' ? 1 : tone === 'light' ? 1 : 0,
        borderColor: theme.line,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <Icon name={icon} size={19} color={fg} />
      <Text style={{ color: fg, fontFamily: fonts.bodyBold, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

export default function SignInScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { complete } = useOnboarding();

  const finish = async () => {
    await complete();
    router.replace('/(tabs)/library');
  };

  return (
    <OnboardingScreen step="signin" scroll footer={
      <Text style={{ textAlign: 'center', color: theme.dim, fontFamily: fonts.body, fontSize: 12, lineHeight: 17 }}>
        By continuing you agree to our Terms and Privacy Policy.
      </Text>
    }>
      <View style={{ height: 158, marginTop: 8 }}>
        <View style={{ position: 'absolute', left: 14, top: 18 }}>
          <MiniCard title="Garlic Butter Steak" meta="2 servings · 20 min" rotate={-9} />
        </View>
        <View style={{ position: 'absolute', right: 14, top: 18 }}>
          <MiniCard title="Honey Glazed Salmon" meta="2 servings · 18 min" rotate={9} />
        </View>
        <Float
          distance={5}
          duration={3800}
          style={{ position: 'absolute', left: '50%', marginLeft: -64, top: 0, zIndex: 2 }}
        >
          <MiniCard title="Spaghetti Bolognese" meta="4 servings · 35 min" rotate={0} />
        </Float>
      </View>

      <Text
        style={{
          marginTop: 26,
          textAlign: 'center',
          color: theme.txt,
          fontFamily: fonts.heading,
          fontSize: 26,
          lineHeight: 31,
        }}
      >
        Save your library so you never lose it.
      </Text>
      <Text
        style={{
          marginTop: 10,
          textAlign: 'center',
          color: theme.dim,
          fontFamily: fonts.body,
          fontSize: 15.5,
          lineHeight: 22,
        }}
      >
        One tap. Your recipes follow you to any device.
      </Text>

      <View style={{ marginTop: 26, gap: 12 }}>
        <AuthButton label="Sign in with Apple" icon="logoApple" tone="dark" onPress={finish} />
        <AuthButton label="Continue with Google" icon="logoGoogle" tone="light" onPress={finish} />
        <AuthButton label="Continue with email" icon="mail" tone="glass" onPress={finish} />
      </View>
    </OnboardingScreen>
  );
}
