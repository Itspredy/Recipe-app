import AsyncStorage from '@react-native-async-storage/async-storage';

const USED_MONTH_KEY = 'import.freeMonthUsed';

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

/** Free tier: one link import per calendar month. Manually pasted text/caption imports are always free. */
export async function hasFreeImportRemaining(): Promise<boolean> {
  const used = await AsyncStorage.getItem(USED_MONTH_KEY);
  return used !== currentMonthKey();
}

export async function recordFreeImportUsed(): Promise<void> {
  await AsyncStorage.setItem(USED_MONTH_KEY, currentMonthKey());
}
