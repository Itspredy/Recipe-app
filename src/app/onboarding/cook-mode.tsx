import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Icon } from '../../components/Icon';
import { Body, GlassCard, IconTile, OnboardingScreen, Pulse, PrimaryCTA } from '../../features/onboarding/components';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts } from '../../lib/theme';

const RING_SIZE = 216;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.33;

export default function CookModeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <OnboardingScreen
      step="cook-mode"
      showBack={false}
      footer={<PrimaryCTA label="Next step" icon="chevronRight" onPress={() => router.push('/onboarding/dietary')} />}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="chevronLeft" size={18} color={theme.txt} />
        </Pressable>
        <Text style={{ color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 13 }}>Step 2 of 6</Text>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="grid" size={16} color={theme.txt} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 18 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < 2 ? theme.acc : theme.line }}
          />
        ))}
      </View>

      <View style={{ alignItems: 'center', marginTop: 28 }}>
        <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
            <Defs>
              <SvgGradient id="kdRing" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={theme.acc} />
                <Stop offset="1" stopColor={theme.sage} />
              </SvgGradient>
            </Defs>
            <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} stroke={theme.line} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="url(#kdRing)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE * (1 - PROGRESS)}
              fill="none"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>
          <Text style={{ color: theme.txt, fontFamily: fonts.heading, fontSize: 44 }}>6:12</Text>
          <Text style={{ color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 2 }}>
            Simmer
          </Text>
        </View>
      </View>

      <Text style={{ marginTop: 26, color: theme.txt, fontFamily: fonts.heading, fontSize: 26, lineHeight: 31 }}>
        Melt the butter, add garlic, and cook until it smells sweet.
      </Text>
      <Body style={{ marginTop: 10 }}>Low heat. Don&apos;t let it brown — miso goes in next.</Body>

      <View style={{ flex: 1 }} />

      <GlassCard style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 8 }}>
        <IconTile size={48} colors={[theme.sage, theme.accsTo]}>
          <Icon name="clock" size={20} color="#fff" />
        </IconTile>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.txt, fontFamily: fonts.bodyBold, fontSize: 14.5 }}>Every step keeps its own timer.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Pulse size={6} color={theme.sage} />
            <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 12.5 }}>Only the ingredients you need, highlighted</Text>
          </View>
        </View>
      </GlassCard>
    </OnboardingScreen>
  );
}
