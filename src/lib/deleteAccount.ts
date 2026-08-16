import AsyncStorage from '@react-native-async-storage/async-storage';
import { wipeAllRecipes } from '../db/store';
import { disableDailyReminder } from './reminders';

/**
 * There's no server-side account here — every piece of data this app has
 * ever stored lives on-device. "Delete account" therefore means erasing all
 * of it: every saved recipe, the person's name, their theme choice, their
 * onboarding answers, their grocery list, their device ID (rate-limiting
 * only, but still theirs), and their monthly import quota — then cancelling
 * any scheduled reminder notification before it fires for data that no
 * longer exists.
 */
const KEYS_TO_CLEAR = [
  'user.name',
  'recipe.theme',
  'recipe.deviceId',
  'onboarding.answers',
  'onboarding.completed',
  'grocery.selectedRecipeIds',
  'grocery.checkedKeys',
  'import.freeMonthUsed',
  'reminder.enabled',
];

export async function deleteAllUserData(): Promise<void> {
  await disableDailyReminder();
  await wipeAllRecipes();
  await AsyncStorage.multiRemove(KEYS_TO_CLEAR);
}
