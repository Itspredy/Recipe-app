import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { hasCompletedOnboarding } from '../features/onboarding/state';

export default function Index() {
  const [done, setDone] = useState<boolean | null>(null);

  useEffect(() => {
    hasCompletedOnboarding().then(setDone);
  }, []);

  if (done === null) return null;
  return <Redirect href={done ? '/library' : '/onboarding'} />;
}
