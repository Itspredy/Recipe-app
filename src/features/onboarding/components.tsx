import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon, type IconName } from '../../components/Icon';
import { useTheme } from '../../lib/ThemeProvider';
import { fonts, gradientProps, radius } from '../../lib/theme';
import { progressFor, type OnboardingStep } from './steps';

/**
 * Full-screen wrapper shared by every onboarding screen: themed background with
 * the design's warm glow wash, safe-area padding, an optional back chevron, and
 * the thin step-progress bar (hidden on the welcome screen, which has none).
 */
export function OnboardingScreen({
  step,
  showBack = true,
  scroll = false,
  footer,
  children,
}: {
  step: OnboardingStep;
  showBack?: boolean;
  scroll?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const progress = progressFor(step);
  const Content = scroll ? ScrollView : View;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <LinearGradient
        colors={[theme.glowTint, 'transparent']}
        start={{ x: 0.85, y: 0 }}
        end={{ x: 0.15, y: 0.6 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={{ flex: 1, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 14 }}>
        <View style={{ paddingHorizontal: 24, gap: 14 }}>
          <View style={{ height: 32, flexDirection: 'row', alignItems: 'center' }}>
            {showBack && router.canGoBack() ? (
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.card,
                  borderWidth: 1,
                  borderColor: theme.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="chevronLeft" size={18} color={theme.txt} />
              </Pressable>
            ) : null}
          </View>
          {step !== 'index' ? <StepProgressBar progress={progress} /> : null}
        </View>
        <Content
          style={{ flex: 1 }}
          contentContainerStyle={scroll ? { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 } : undefined}
        >
          {scroll ? children : <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>{children}</View>}
        </Content>
        {footer ? <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>{footer}</View> : null}
      </View>
    </View>
  );
}

export function StepProgressBar({ progress }: { progress: number }) {
  const { theme } = useTheme();
  return (
    <View style={{ height: 12, borderRadius: 999, backgroundColor: theme.line, overflow: 'hidden' }}>
      <LinearGradient
        colors={[theme.accsFrom, theme.accsTo]}
        {...gradientProps}
        style={{ width: `${Math.max(4, progress * 100)}%`, height: '100%', borderRadius: 999 }}
      />
    </View>
  );
}

/** The 64pt gradient CTA used on nearly every screen, with the top gloss highlight. */
export function PrimaryCTA({
  label,
  onPress,
  disabled,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  if (disabled) {
    return (
      <View
        style={[
          {
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.card2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        <Text style={{ color: theme.dim, fontFamily: fonts.bodyBold, fontSize: 18 }}>{label}</Text>
      </View>
    );
  }
  return (
    <Pressable onPress={onPress} style={[{ borderRadius: 32, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={[theme.accsFrom, theme.accsTo]}
        {...gradientProps}
        style={{
          height: 64,
          borderRadius: 32,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.42)', 'rgba(255,255,255,0)']}
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            height: '44%',
            borderRadius: 26,
          }}
        />
        {icon ? <Icon name={icon} size={19} color={theme.onAccent} /> : null}
        <Text style={{ color: theme.onAccent, fontFamily: fonts.bodyBold, fontSize: 18 }}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Glass "skip"-style pill — used for secondary actions like screen 11's "Not now". */
export function SecondaryCTA({ label, onPress }: { label: string; onPress?: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 58,
        borderRadius: 29,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.line,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: theme.dim, fontFamily: fonts.body, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

/** Selectable pill with a checkmark that appears once chosen. */
export function SelectChip({
  label,
  selected,
  onPress,
  dashed,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  dashed?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: selected ? `${theme.acc}22` : theme.card,
        borderWidth: selected ? 1.5 : 1,
        borderStyle: dashed && !selected ? 'dashed' : 'solid',
        borderColor: selected ? theme.acc : theme.line,
      }}
    >
      <Text
        style={{
          color: selected ? theme.txt : theme.dim,
          fontFamily: selected ? fonts.bodyBold : fonts.bodyMedium,
          fontSize: 15,
        }}
      >
        {label}
      </Text>
      {selected ? <Icon name="check" size={14} color={theme.acc} /> : null}
    </Pressable>
  );
}

/** Glossy 3D icon tile — gradient square with an inner top gloss, no hard outlines. */
export function IconTile({
  size = 48,
  colors,
  children,
}: {
  size?: number;
  colors: [string, string];
  children: ReactNode;
}) {
  const r = Math.round(size / 2.9);
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
        style={{ position: 'absolute', top: 1, left: 1, right: 1, height: '45%', borderRadius: r - 2 }}
      />
      {children}
    </LinearGradient>
  );
}

/** Soft themed surface card — the "glass card" pattern used throughout. */
export function GlassCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: radius.xl,
          padding: 18,
          ...theme.shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Eyebrow({ label, color }: { label: string; color?: string }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        color: color ?? theme.dim,
        fontFamily: fonts.bodyBold,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  );
}

export function Headline({
  children,
  size = 34,
  style,
}: {
  children: ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        { color: theme.txt, fontFamily: fonts.heading, fontSize: size, lineHeight: size * 1.1 },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { theme } = useTheme();
  return (
    <Text style={[{ color: theme.dim, fontFamily: fonts.body, fontSize: 16.5, lineHeight: 24 }, style]}>
      {children}
    </Text>
  );
}

/** Gentle up/down loop used for the icon tiles and cards throughout onboarding. */
export function Float({
  children,
  duration = 3200,
  distance = 8,
  delay = 0,
  style,
}: {
  children: ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const ty = useSharedValue(0);

  useEffect(() => {
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-distance, { duration, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/** Continuously spinning ring — used for in-progress status rows. */
export function Spinner({ size = 18, color, style }: { size?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const { theme } = useTheme();
  const rot = useSharedValue(0);

  useEffect(() => {
    rot.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2.5,
          borderColor: `${color ?? theme.acc}55`,
          borderTopColor: color ?? theme.acc,
        },
        style,
        animStyle,
      ]}
    />
  );
}

/** Expanding opacity/scale pulse — used for live dots and notification rings. */
export function Pulse({
  size = 8,
  color,
  style,
  children,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const { theme } = useTheme();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + t.value * 0.6,
    transform: [{ scale: 0.85 + t.value * 0.3 }],
  }));

  if (children) return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;

  return (
    <Animated.View
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color ?? theme.acc }, style, animStyle]}
    />
  );
}
