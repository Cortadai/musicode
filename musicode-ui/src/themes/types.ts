export type ThemeName = 'evolved' | 'nova' | 'minimal';

export type PaletteName = 'indigo' | 'zinc' | 'crimson' | 'emerald' | 'amber' | 'cyan' | 'daylight' | 'sunrise' | 'frost';

export type ShellLayout = 'sidebar-expanded' | 'sidebar-icons' | 'horizontal';

// Structural tokens — owned by shell (layout, typography, spacing, effects)
export interface ShellTokens {
  fontBody: string;
  fontMono: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  glassBlur: string;
}

// Color tokens — owned by palette (backgrounds, accents, borders, text, status)
export interface PaletteTokens {
  // Backgrounds
  bgBase: string;
  bgSurface: string;
  bgSurfaceHover: string;
  bgElevated: string;
  bgOverlay: string;

  // Borders
  borderDefault: string;
  borderSubtle: string;
  borderAccent: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Accent
  accentPrimary: string;
  accentPrimaryHover: string;
  accentPrimaryMuted: string;
  accentSecondary: string;

  // Glassmorphism colors (blur amount is shell-owned)
  glassBackground: string;
  glassBorder: string;

  // Player
  playerBackground: string;
  playerBorder: string;
  waveformPlayed: string;
  waveformBuffered: string;
  waveformPending: string;

  // Sidebar
  sidebarBackground: string;
  sidebarBorder: string;
  sidebarActiveBackground: string;
  sidebarActiveText: string;
  sidebarMutedText: string;

  // Status
  textError: string;
  textWarning: string;
  textSuccess: string;
  textInfo: string;

  // Analyzer Deck
  deckBg: string;
  deckBorder: string;
  deckLabel: string;
  scopeGrid: string;
  scopeLine: string;

  // Misc
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  badgeBackground: string;
  badgeText: string;
  deckHandle: string;
}

// Merged tokens — applied to CSS vars, consumed by components
export type ThemeTokens = ShellTokens & PaletteTokens;

export interface ShellConfig {
  name: ThemeName;
  label: string;
  layout: ShellLayout;
  tokens: ShellTokens;
}

export interface PaletteConfig {
  name: PaletteName;
  label: string;
  swatch?: string;
  tokens: PaletteTokens;
}

// Composed config — what consumers see via useTheme()
export interface ThemeConfig {
  name: ThemeName;
  label: string;
  layout: ShellLayout;
  palette: PaletteName;
  tokens: ThemeTokens;
}

export interface ThemeContextValue {
  theme: ThemeConfig;
  themeName: ThemeName;
  paletteName: PaletteName;
  setTheme: (name: ThemeName) => void;
  setPalette: (name: PaletteName) => void;
}
