import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const ANSWERS_KEY = 'onboarding.answers';
const COMPLETE_KEY = 'onboarding.completed';

export type HouseholdSize = 'solo' | 'plusOne' | 'family' | 'roommates';

export type OnboardingAnswers = {
  name: string;
  sources: string[];
  dietary: string[];
  household: HouseholdSize;
  notifications: boolean | null;
};

const DEFAULT_ANSWERS: OnboardingAnswers = {
  name: '',
  sources: [],
  dietary: [],
  household: 'plusOne',
  notifications: null,
};

type OnboardingContextValue = {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  toggleSource: (id: string) => void;
  toggleDietary: (id: string) => void;
  complete: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(DEFAULT_ANSWERS);

  const update: OnboardingContextValue['update'] = (key, value) =>
    setAnswers((cur) => ({ ...cur, [key]: value }));

  const toggleSource = (id: string) =>
    setAnswers((cur) => ({
      ...cur,
      sources: cur.sources.includes(id) ? cur.sources.filter((s) => s !== id) : [...cur.sources, id],
    }));

  // "Nothing — I eat everything" is an explicit opt-out pick, mutually exclusive with the rest.
  const toggleDietary = (id: string) =>
    setAnswers((cur) => {
      if (id === 'none') return { ...cur, dietary: cur.dietary.includes('none') ? [] : ['none'] };
      const withoutNone = cur.dietary.filter((d) => d !== 'none');
      return {
        ...cur,
        dietary: withoutNone.includes(id) ? withoutNone.filter((d) => d !== id) : [...withoutNone, id],
      };
    });

  const complete = async () => {
    await AsyncStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    await AsyncStorage.setItem(COMPLETE_KEY, '1');
  };

  const value = useMemo(
    () => ({ answers, update, toggleSource, toggleDietary, complete }),
    [answers],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(COMPLETE_KEY)) === '1';
}
