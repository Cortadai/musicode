import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { LyricsSidebarProvider, useLyricsSidebar } from './LyricsSidebarContext';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: () => { store = {}; },
  };
})();

function TestConsumer({ onRender }: { onRender: (s: ReturnType<typeof useLyricsSidebar>) => void }) {
  const state = useLyricsSidebar();
  onRender(state);
  return null;
}

beforeEach(() => {
  mockLocalStorage.clear();
  vi.stubGlobal('localStorage', mockLocalStorage);
});

describe('LyricsSidebarContext', () => {
  it('defaults to closed', () => {
    let captured: ReturnType<typeof useLyricsSidebar> | null = null;
    render(
      <LyricsSidebarProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </LyricsSidebarProvider>,
    );
    expect(captured!.isOpen).toBe(false);
  });

  it('reads stored open state from localStorage', () => {
    mockLocalStorage.setItem('mc-lyrics-sidebar-open', 'true');
    let captured: ReturnType<typeof useLyricsSidebar> | null = null;
    render(
      <LyricsSidebarProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </LyricsSidebarProvider>,
    );
    expect(captured!.isOpen).toBe(true);
  });

  it('toggle opens and persists', () => {
    let captured: ReturnType<typeof useLyricsSidebar> | null = null;
    render(
      <LyricsSidebarProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </LyricsSidebarProvider>,
    );
    act(() => { captured!.toggle(); });
    expect(captured!.isOpen).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mc-lyrics-sidebar-open', 'true');
  });

  it('close sets to false and persists', () => {
    mockLocalStorage.setItem('mc-lyrics-sidebar-open', 'true');
    let captured: ReturnType<typeof useLyricsSidebar> | null = null;
    render(
      <LyricsSidebarProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </LyricsSidebarProvider>,
    );
    act(() => { captured!.close(); });
    expect(captured!.isOpen).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mc-lyrics-sidebar-open', 'false');
  });
});
