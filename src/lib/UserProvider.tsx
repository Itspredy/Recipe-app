import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'user.name';

type UserContextValue = {
  name: string;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

/** The first name captured during onboarding — shown in greetings and on the profile screen. */
export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setNameState(saved);
    });
  }, []);

  const setName = (next: string) => {
    setNameState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return <UserContext.Provider value={{ name, setName }}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
