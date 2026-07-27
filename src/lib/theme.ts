/**
 * Design tokens translated from the Organic design system (Recipe App.dc.html).
 * Dark glass is the default surface; light is the cream twin. Every screen reads
 * these through useTheme() so a token change lands everywhere at once.
 */

export type Theme = {
  name: 'dark' | 'light';
  isDark: boolean;
  bg: string;
  glowTint: string; // soft accent wash approximating the CSS radial --glow
  card: string;
  card2: string;
  line: string;
  txt: string;
  dim: string;
  dim2: string;
  acc: string;
  accsFrom: string;
  accsTo: string;
  sage: string;
  sheet: string;
  scrim: string;
  onAccent: string; // text/icon colour that sits on the accent gradient
  shadow: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
};

export const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  bg: '#140f0d',
  glowTint: 'rgba(232,130,63,0.16)',
  card: 'rgba(255,255,255,0.06)',
  card2: 'rgba(255,255,255,0.10)',
  line: 'rgba(247,239,226,0.11)',
  txt: '#f7efe2',
  dim: 'rgba(247,239,226,0.60)',
  dim2: 'rgba(247,239,226,0.36)',
  acc: '#f6a06b',
  accsFrom: '#ea8442',
  accsTo: '#d06f34',
  sage: '#aebf92',
  sheet: '#1c1613',
  scrim: 'rgba(10,7,6,0.62)',
  onAccent: '#ffffff',
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
};

export const lightTheme: Theme = {
  name: 'light',
  isDark: false,
  bg: '#f5ead8',
  glowTint: 'rgba(214,127,72,0.12)',
  card: '#fffaf1',
  card2: '#ebddc5',
  line: 'rgba(32,30,29,0.12)',
  txt: '#201e1d',
  dim: 'rgba(32,30,29,0.62)',
  dim2: 'rgba(32,30,29,0.40)',
  acc: '#b2622d',
  accsFrom: '#c67139',
  accsTo: '#b2622d',
  sage: '#728157',
  sheet: '#fffaf1',
  scrim: 'rgba(32,30,29,0.42)',
  onAccent: '#ffffff',
  shadow: {
    shadowColor: '#2e2b25',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const fonts = {
  heading: 'Caprasimo_400Regular',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
};

/** 135deg accent gradient used on primary buttons, the FAB and active chips. */
export const gradientProps = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/**
 * Flat colour aliases the screens have used since the app was scaffolded.
 * The richer dark/light Theme above is what we're migrating toward, but every
 * screen still reads `colors.background` / `colors.card` etc., so these keep
 * those imports working while we migrate incrementally. Bound to the dark
 * palette — that's what the screens were laid out against.
 */
export const colors = {
  background: darkTheme.bg,
  card: darkTheme.card,
  cardStrong: darkTheme.card2,
  border: darkTheme.line,
  text: darkTheme.txt,
  textMuted: darkTheme.dim,
  textFaint: darkTheme.dim2,
  accent: darkTheme.acc,
  accentSoft: 'rgba(246,160,107,0.14)', // low-opacity accent for chip backgrounds
  onAccent: darkTheme.onAccent,
  danger: '#e5484d',
  sage: darkTheme.sage,
} as const;
