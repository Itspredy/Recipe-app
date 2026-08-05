import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useOnboarding } from '../../features/onboarding/state';
import { useTheme } from '../../lib/ThemeProvider';

/**
 * The actual pricing/purchase UI (lifetime, yearly, monthly) is designed and
 * priced in the RevenueCat dashboard's Paywalls tool, not here — this screen
 * just presents it and reacts to the outcome. This is the last onboarding
 * screen, so any outcome (purchase, restore, or dismiss) finishes onboarding
 * and drops the user straight into the app.
 */
export default function PaywallScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { complete } = useOnboarding();

  const finish = async () => {
    await complete();
    router.replace('/(tabs)/library');
  };

  // No native purchases SDK on web — skip straight to finishing onboarding.
  useEffect(() => {
    if (Platform.OS === 'web') finish();
  }, []);

  if (Platform.OS === 'web') return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onPurchaseCompleted={finish}
        onRestoreCompleted={finish}
        onDismiss={finish}
      />
    </View>
  );
}
