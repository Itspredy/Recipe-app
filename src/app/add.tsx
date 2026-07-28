import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../components/Icon';
import { useTheme } from '../lib/ThemeProvider';
import { fonts, radius } from '../lib/theme';

/** Transparent-modal bottom sheet: the app's single entry point for adding recipes. */
export default function AddSheet() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.scrim }}
        onPress={() => router.back()}
      />

      <View
        style={{
          backgroundColor: theme.sheet,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          borderTopWidth: 1,
          borderColor: theme.line,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
          gap: 14,
        }}
      >
        <View style={{ width: 40, height: 5, borderRadius: radius.pill, backgroundColor: theme.line, alignSelf: 'center', marginBottom: 6 }} />
        <Text style={{ fontFamily: fonts.heading, fontSize: 26, color: theme.txt }}>Add a recipe</Text>

        <Option icon="link" tone={theme.acc} title="Paste a link" subtitle="Any blog or video — we strip the story" onPress={() => router.replace('/import')} />
        <Option icon="edit" tone={theme.sage} title="Type it in" subtitle="Grandma's card, your own head" onPress={() => router.replace('/manual')} />
        <Option icon="camera" tone={theme.dim} title="Scan from photo" subtitle="Cookbook pages, handwriting" soon />
      </View>
    </View>
  );
}

function Option({
  icon,
  tone,
  title,
  subtitle,
  onPress,
  soon,
}: {
  icon: IconName;
  tone: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  soon?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={soon ? undefined : onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        borderRadius: radius.lg,
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.line,
        opacity: soon ? 0.5 : 1,
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} color={tone} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: theme.txt }}>{title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: theme.dim }}>{subtitle}</Text>
      </View>
      {soon ? (
        <View style={{ borderWidth: 1, borderColor: theme.line, paddingVertical: 5, paddingHorizontal: 9, borderRadius: radius.pill }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: theme.dim2 }}>Soon</Text>
        </View>
      ) : (
        <Icon name="chevronRight" size={18} color={theme.dim2} />
      )}
    </Pressable>
  );
}
