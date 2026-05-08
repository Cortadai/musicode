import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ThemeConfig, ThemeContextValue, ThemeName, ThemeTokens } from './types';
import { evolvedTheme } from './tokens/evolved';
import { novaTheme } from './tokens/nova';
import { minimalTheme } from './tokens/minimal';

const STORAGE_KEY = 'musicode-theme';

const themes: Record<ThemeName, ThemeConfig> = {
  evolved: evolvedTheme,
  nova: novaTheme,
  minimal: minimalTheme,
};

function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    const cssVar = `--mc-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    vars[cssVar] = value;
  }
  return vars;
}

function applyTokensToRoot(tokens: ThemeTokens): void {
  const vars = tokensToCssVars(tokens);
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value);
  }
}

function getStoredTheme(): ThemeName {
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'novatouch') { stored = 'nova'; localStorage.setItem(STORAGE_KEY, stored); }
    if (stored && stored in themes) return stored as ThemeName;
  } catch {
    // localStorage unavailable
  }
  return 'evolved';
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(getStoredTheme);

  const theme = useMemo(() => themes[themeName], [themeName]);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    applyTokensToRoot(theme.tokens);
    document.documentElement.setAttribute('data-theme', themeName);
  }, [theme, themeName]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeName, setTheme }),
    [theme, themeName, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
