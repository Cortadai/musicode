import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface LyricsSidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const LyricsSidebarContext = createContext<LyricsSidebarState>({ isOpen: false, toggle: () => {}, close: () => {} });

const STORAGE_KEY = 'mc-lyrics-sidebar-open';

export function LyricsSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  }, []);

  return (
    <LyricsSidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </LyricsSidebarContext.Provider>
  );
}

export function useLyricsSidebar() {
  return useContext(LyricsSidebarContext);
}
