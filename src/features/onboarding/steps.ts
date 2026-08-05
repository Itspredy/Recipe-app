/** Route order for the onboarding stack — drives the step progress bar and back/next wiring. */
export const ONBOARDING_STEPS = [
  'index', // 01 welcome — no progress bar
  'name', // 01B
  'sources', // 02
  'imports', // 03
  'video-demo', // 03B
  'share-sheet', // 04
  'watch', // 05
  'recipe-preview', // 06
  'cook-mode', // 07
  'dietary', // 08
  'household', // 09
  'grocery', // 10
  'notifications', // 11
  'paywall', // 12
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** 0 for the welcome screen (no bar shown), otherwise stepIndex / lastIndex. */
export function progressFor(step: OnboardingStep): number {
  const index = ONBOARDING_STEPS.indexOf(step);
  if (index <= 0) return 0;
  return index / (ONBOARDING_STEPS.length - 1);
}

export function nextStep(step: OnboardingStep): OnboardingStep | null {
  const index = ONBOARDING_STEPS.indexOf(step);
  return index >= 0 && index < ONBOARDING_STEPS.length - 1 ? ONBOARDING_STEPS[index + 1] : null;
}
