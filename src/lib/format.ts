const FRACTIONS: [number, string][] = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.5, '½'],
  [0.667, '⅔'],
  [0.75, '¾'],
];

/**
 * Cooks read "1½" far more easily than "1.5". Snaps to the nearest common
 * fraction when the value is close enough, otherwise trims trailing zeroes.
 */
export function formatQuantity(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '';

  const whole = Math.floor(value);
  const remainder = value - whole;

  const match = FRACTIONS.find(([decimal]) => Math.abs(remainder - decimal) < 0.02);
  if (match) return whole > 0 ? `${whole}${match[1]}` : match[1];

  if (remainder < 0.02) return String(whole);

  return String(Math.round(value * 100) / 100);
}

export function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/** "Cooked 2 days ago" style relative label for the history list. */
export function relativeTime(timestamp: number | null): string {
  if (!timestamp) return 'Not cooked yet';
  const diff = Date.now() - timestamp;
  const day = 86_400_000;
  if (diff < day) return 'Cooked today';
  const days = Math.floor(diff / day);
  if (days === 1) return 'Cooked yesterday';
  if (days < 7) return `Cooked ${days} days ago`;
  if (days < 14) return 'Cooked last week';
  if (days < 60) return `Cooked ${Math.floor(days / 7)} weeks ago`;
  return `Cooked ${Math.floor(days / 30)} months ago`;
}
