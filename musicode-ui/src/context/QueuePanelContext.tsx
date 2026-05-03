import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface QueuePanelState {
  isOpen: boolean;
  toggle: () => void;
}

const QueuePanelContext = createContext<QueuePanelState>({ isOpen: false, toggle: () => {} });

const STORAGE_KEY = 'mc-queue-panel-open';

export function QueuePanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <QueuePanelContext.Provider value={{ isOpen, toggle }}>
      {children}
    </QueuePanelContext.Provider>
  );
}

export function useQueuePanel() {
  return useContext(QueuePanelContext);
}
