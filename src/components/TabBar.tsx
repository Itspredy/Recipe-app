import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, gradientProps, radius } from '../lib/theme';
import { Icon, type IconName } from './Icon';

/**
 * The raised-centre tab bar from the design: a floating pill with a gradient +
 * lifted above its middle that opens the Add sheet.
 */

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'library', label: 'Library', icon: 'book' },
  { name: 'cooked', label: 'Cooked', icon: 'clock' },
  { name: 'search', label: 'Search', icon: 'search' },
  { name: 'profile', label: 'You', icon: 'user' },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeRoute = state.routes[state.index]?.name;

  const renderTab = (tab: (typeof TABS)[number], extraStyle?: object) => {
    const focused = activeRoute === tab.name;
    const color = focused ? theme.acc : theme.dim2;
    return (
      <Pressable
        key={tab.name}
        onPress={() => navigation.navigate(tab.name)}
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }, extraStyle]}
      >
        <Icon name={tab.icon} size={22} color={color} />
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, color }}>{tab.label}</Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, 14),
      }}
      pointerEvents="box-none"
    >
      <View
        style={[
          {
            height: 68,
            borderRadius: radius.pill,
            backgroundColor: theme.card2,
            borderWidth: 1,
            borderColor: theme.line,
            flexDirection: 'row',
            alignItems: 'center',
          },
          theme.shadow,
        ]}
      >
        {renderTab(TABS[0])}
        {renderTab(TABS[1], { marginRight: 52 })}
        {renderTab(TABS[2], { marginLeft: 52 })}
        {renderTab(TABS[3])}

        <Pressable
          onPress={() => router.push('/add')}
          style={{
            position: 'absolute',
            left: '50%',
            top: -16,
            marginLeft: -32,
            width: 64,
            height: 64,
            borderRadius: radius.pill,
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: theme.bg,
          }}
        >
          <LinearGradient
            colors={[theme.accsFrom, theme.accsTo]}
            {...gradientProps}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="plus" size={26} color={theme.onAccent} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
