export type ThemeName = 'evolved' | 'novatouch' | 'minimal';

export type ShellLayout = 'sidebar-expanded' | 'sidebar-icons' | 'horizontal';

export interface ThemeTokens {
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

  // Glassmorphism
  glassBackground: string;
  glassBorder: string;
  glassBlur: string;

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

  // Typography
  fontBody: string;
  fontMono: string;

  // Spacing / Radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
}

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  layout: ShellLayout;
  tokens: ThemeTokens;
}

export interface ThemeContextValue {
  theme: ThemeConfig;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}
