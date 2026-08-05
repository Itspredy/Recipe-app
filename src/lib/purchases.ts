import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
} from 'react-native-purchases';

/**
 * RevenueCat Test Store key — safe to ship as-is, it only ever creates
 * sandbox transactions, never real ones. Swap for the real Apple/Google
 * API keys (via EXPO_PUBLIC_REVENUECAT_IOS_API_KEY /
 * EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY, same pattern as eas.json's
 * EXPO_PUBLIC_API_URL) once App Store Connect products exist.
 */
const TEST_KEY = 'test_QgprTJctVVhPguaFUCSeHydSPeN';
const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? TEST_KEY;
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? TEST_KEY;

/** Must match the entitlement identifier created in the RevenueCat dashboard. */
export const ENTITLEMENT_ID = 'Keepdish Pro';

let configured = false;

/**
 * Must run once, early, before any other Purchases/RevenueCatUI call.
 * No-ops on web (native-only SDK).
 */
export function configurePurchases(): void {
  if (configured || Platform.OS === 'web') return;

  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: IOS_API_KEY });
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: ANDROID_API_KEY });
  } else {
    return;
  }
  configured = true;
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

/** The dashboard's current default offering (lifetime/yearly/monthly packages), or null. */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export function hasProEntitlement(info: CustomerInfo): boolean {
  return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

/** Current entitlement state for the signed-in device, without presenting anything. */
export async function checkProEntitlement(): Promise<boolean> {
  if (!configured) return false;
  const info = await Purchases.getCustomerInfo();
  return hasProEntitlement(info);
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}
