import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';
import type { ThemeName, PaletteName } from './types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: () => { store = {}; },
  };
})();

function TestConsumer({ onRender }: { onRender: (ctx: ReturnType<typeof useTheme>) => void }) {
  const ctx = useTheme();
  onRender(ctx);
  return null;
}

beforeEach(() => {
  mockLocalStorage.clear();
  vi.stubGlobal('localStorage', mockLocalStorage);
});

describe('ThemeProvider', () => {
  it('provides default theme (evolved/zinc) when no stored prefs', () => {
    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );
    expect(captured!.themeName).toBe('evolved');
    expect(captured!.paletteName).toBe('zinc');
    expect(captured!.theme.layout).toBe('sidebar-expanded');
  });

  it('reads stored shell and palette from localStorage', () => {
    mockLocalStorage.setItem('sonance-shell', 'nova');
    mockLocalStorage.setItem('sonance-palette', 'crimson');

    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );
    expect(captured!.themeName).toBe('nova');
    expect(captured!.paletteName).toBe('crimson');
  });

  it('migrates legacy "novatouch" theme to nova shell', () => {
    mockLocalStorage.setItem('sonance-theme', 'novatouch');

    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );
    expect(captured!.themeName).toBe('nova');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('sonance-shell', 'nova');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('sonance-theme');
  });

  it('setTheme changes shell and persists', () => {
    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );

    act(() => { captured!.setTheme('minimal' as ThemeName); });
    expect(captured!.themeName).toBe('minimal');
    expect(captured!.theme.layout).toBe('horizontal');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('sonance-shell', 'minimal');
  });

  it('setPalette changes palette and persists', () => {
    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );

    act(() => { captured!.setPalette('emerald' as PaletteName); });
    expect(captured!.paletteName).toBe('emerald');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('sonance-palette', 'emerald');
  });

  it('applies data-theme and data-palette attributes to document', () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('evolved');
    expect(document.documentElement.getAttribute('data-palette')).toBe('zinc');
  });

  it('falls back to defaults for invalid stored values', () => {
    mockLocalStorage.setItem('sonance-shell', 'nonexistent');
    mockLocalStorage.setItem('sonance-palette', 'bogus');

    let captured: ReturnType<typeof useTheme> | null = null;
    render(
      <ThemeProvider>
        <TestConsumer onRender={ctx => { captured = ctx; }} />
      </ThemeProvider>,
    );
    expect(captured!.themeName).toBe('evolved');
    expect(captured!.paletteName).toBe('zinc');
  });
});

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      render(<TestConsumer onRender={() => {}} />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
