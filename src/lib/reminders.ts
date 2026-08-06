import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { listRecipes } from '../db/store';

const ENABLED_KEY = 'reminder.enabled';
const SCHEDULED_FOR_KEY = 'reminder.scheduledFor';
const NOTIFICATION_ID_KEY = 'reminder.notificationId';

const REMINDER_HOUR = 18;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Requests OS notification permission. Returns whether it's now granted. */
export async function requestReminderPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Call when the user opts in (e.g. onboarding's "Yes, remind me"). */
export async function enableDailyReminder(): Promise<void> {
  const granted = await requestReminderPermission();
  if (!granted) return;
  await AsyncStorage.setItem(ENABLED_KEY, '1');
  await scheduleNext();
}

export async function disableDailyReminder(): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, '0');
  const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
  await AsyncStorage.multiRemove([SCHEDULED_FOR_KEY, NOTIFICATION_ID_KEY]);
}

function nextReminderDate(): Date {
  const next = new Date();
  next.setHours(REMINDER_HOUR, 0, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  return next;
}

async function scheduleNext(): Promise<void> {
  const recipes = await listRecipes();
  if (recipes.length === 0) return;
  const pick = recipes[Math.floor(Math.random() * recipes.length)];

  const oldId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (oldId) await Notifications.cancelScheduledNotificationAsync(oldId);

  const date = nextReminderDate();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Keepdish',
      body: `${pick.title} — you've got everything for it. Cook it tonight?`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });

  await AsyncStorage.setItem(SCHEDULED_FOR_KEY, date.toISOString());
  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
}

/**
 * Call on every app launch. If the reminder is enabled and the previously
 * scheduled notification's date has already passed, picks a fresh random
 * recipe and schedules the next one — self-heals on every open instead of
 * needing a background task, since a plain repeating trigger can't rotate
 * which recipe gets named each day.
 */
export async function ensureDailyReminderScheduled(): Promise<void> {
  if (Platform.OS === 'web') return;
  const enabled = await AsyncStorage.getItem(ENABLED_KEY);
  if (enabled !== '1') return;

  const scheduledFor = await AsyncStorage.getItem(SCHEDULED_FOR_KEY);
  if (scheduledFor && new Date(scheduledFor) > new Date()) return;

  await scheduleNext();
}
