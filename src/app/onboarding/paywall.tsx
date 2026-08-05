import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useTheme } from '../../lib/ThemeProvider';

/**
 * The actual pricing/purchase UI (lifetime, yearly, monthly) is designed and
 * priced in the RevenueCat dashboard's Paywalls tool, not here — this screen
 * just presents it and reacts to the outcome. On web (no native purchases
 * SDK) it's skipped entirely.
 */
export default function PaywallScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  if (Platform.OS === 'web') {
    router.replace('/onboarding/signin');
    return null;
  }

  const proceed = () => router.push('/onboarding/signin');

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onPurchaseCompleted={proceed}
        onRestoreCompleted={proceed}
        onDismiss={proceed}
      />
    </View>
  );
}
