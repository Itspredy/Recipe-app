import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, gradientProps, radius } from '../lib/theme';
import { Icon, type IconName } from './Icon';

/** Full-bleed themed background with the soft accent glow from the design. */
export function ScreenBackground({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <LinearGradient
        colors={[theme.glowTint, 'transparent']}
        start={{ x: 0.9, y: 0 }}
        end={{ x: 0.2, y: 0.55 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

/** Primary action — the 135° accent gradient used across the app. */
export function GradientButton({
  label,
  onPress,
  icon,
  iconRight,
  loading,
  disabled,
  height = 58,
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={[{ borderRadius: radius.md, overflow: 'hidden', opacity: disabled ? 0.45 : 1 }, style]}
    >
      <LinearGradient
        colors={[theme.accsFrom, theme.accsTo]}
        {...gradientProps}
        style={{ height, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}
      >
        {loading ? (
          <ActivityIndicator color={theme.onAccent} />
        ) : (
          <>
            {icon ? <Icon name={icon} size={20} color={theme.onAccent} /> : null}
            <Text style={{ color: theme.onAccent, fontFamily: fonts.heading, fontSize: 18 }}>{label}</Text>
            {iconRight ? <Icon name={iconRight} size={20} color={theme.onAccent} /> : null}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

/** Selectable pill (category chips, detail tabs, multi-select tags). */
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { theme } = useTheme();
  if (active) {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: radius.pill, overflow: 'hidden' }}>
        <LinearGradient colors={[theme.accsFrom, theme.accsTo]} {...gradientProps} style={styles.chip}>
          <Text style={{ color: theme.onAccent, fontFamily: fonts.bodyBold, fontSize: 14 }}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line }]}
    >
      <Text style={{ color: theme.dim, fontFamily: fonts.bodyMedium, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

/** Small uppercase tag used on the detail hero and cards. */
export function Tag({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'sage' }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.card,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
      }}
    >
      <Text
        style={{
          color: tone === 'sage' ? theme.sage : theme.acc,
          fontFamily: fonts.bodyBold,
          fontSize: 11,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/** Themed gradient tile shown wherever a recipe has no photo — the design's drop-slot. */
export function PhotoSlot({
  title,
  radius: r = 0,
  height,
  icon = 'restaurant',
}: {
  title?: string;
  radius?: number;
  height?: number;
  icon?: IconName;
}) {
  const { theme } = useTheme();
  const shift = title ? (title.charCodeAt(0) % 3) - 1 : 0;
  const from = shift < 0 ? theme.accsFrom : theme.accsTo;
  const to = shift > 0 ? theme.sage : theme.accsTo;
  return (
    <LinearGradient
      colors={[from, to]}
      {...gradientProps}
      style={{ width: '100%', height: height ?? '100%', borderRadius: r, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name={icon} size={30} color="rgba(255,255,255,0.85)" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
