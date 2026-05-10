import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PaletteName, ShellConfig, ThemeConfig, ThemeContextValue, ThemeName, ThemeTokens } from './types';
import { evolvedShell } from './tokens/evolved';
import { novaShell } from './tokens/nova';
import { minimalShell } from './tokens/minimal';
import { palettes } from './palettes';

const SHELL_KEY = 'sonance-shell';
const PALETTE_KEY = 'sonance-palette';
const LEGACY_KEY = 'sonance-theme';

const shells: Record<ThemeName, ShellConfig> = {
  evolved: evolvedShell,
  nova: novaShell,
  minimal: minimalShell,
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

function mergeTokens(shell: ShellConfig, palette: PaletteName): ThemeTokens {
  return { ...palettes[palette].tokens, ...shell.tokens };
}

function getStoredPreferences(): { shell: ThemeName; palette: PaletteName } {
  try {
    let shell = localStorage.getItem(SHELL_KEY);
    let palette = localStorage.getItem(PALETTE_KEY);

    if (!shell) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy === 'novatouch' || legacy === 'nova') {
        shell = 'nova';
        palette = palette || 'zinc';
      } else if (legacy && legacy in shells) {
        shell = legacy;
      }
      if (shell) {
        localStorage.setItem(SHELL_KEY, shell);
        localStorage.removeItem(LEGACY_KEY);
      }
    }

    return {
      shell: (shell && shell in shells ? shell : 'evolved') as ThemeName,
      palette: (palette && palette in palettes ? palette : 'zinc') as PaletteName,
    };
  } catch {
    return { shell: 'evolved', palette: 'zinc' };
  }
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState(getStoredPreferences);

  const theme = useMemo<ThemeConfig>(() => {
    const shell = shells[prefs.shell];
    return {
      name: shell.name,
      label: shell.label,
      layout: shell.layout,
      palette: prefs.palette,
      tokens: mergeTokens(shell, prefs.palette),
    };
  }, [prefs]);

  const setTheme = useCallback((name: ThemeName) => {
    setPrefs(prev => {
      try { localStorage.setItem(SHELL_KEY, name); } catch {}
      return { ...prev, shell: name };
    });
  }, []);

  const setPalette = useCallback((name: PaletteName) => {
    setPrefs(prev => {
      try { localStorage.setItem(PALETTE_KEY, name); } catch {}
      return { ...prev, palette: name };
    });
  }, []);

  useEffect(() => {
    applyTokensToRoot(theme.tokens);
    document.documentElement.setAttribute('data-theme', prefs.shell);
    document.documentElement.setAttribute('data-palette', prefs.palette);
    window.dispatchEvent(new Event('sonance-theme-changed'));
  }, [theme, prefs.shell, prefs.palette]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeName: prefs.shell,
      paletteName: prefs.palette,
      setTheme,
      setPalette,
    }),
    [theme, prefs.shell, prefs.palette, setTheme, setPalette],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
