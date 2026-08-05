import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { darkTheme, lightTheme, type Theme } from './theme';

const STORAGE_KEY = 'recipe.theme';

type ThemeContextValue = {
  theme: Theme;
  mode: 'dark' | 'light';
  toggle: () => void;
  setMode: (mode: 'dark' | 'light') => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Dark glass is the design's default surface.
  const [mode, setModeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    });
  }, []);

  const setMode = (next: 'dark' | 'light') => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const value: ThemeContextValue = {
    theme: mode === 'light' ? lightTheme : darkTheme,
    mode,
    toggle: () => setMode(mode === 'light' ? 'dark' : 'light'),
    setMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
