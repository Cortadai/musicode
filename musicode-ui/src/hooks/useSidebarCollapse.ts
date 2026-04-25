import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';
const BREAKPOINT = 1024;

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return window.innerWidth < BREAKPOINT;
  });

  useEffect(() => {
    let prev = window.innerWidth;

    function onResize() {
      const width = window.innerWidth;
      const crossedDown = prev >= BREAKPOINT && width < BREAKPOINT;
      const crossedUp = prev < BREAKPOINT && width >= BREAKPOINT;
      prev = width;

      if (crossedDown) {
        setCollapsed(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      } else if (crossedUp) {
        setCollapsed(false);
        localStorage.setItem(STORAGE_KEY, 'false');
      }
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle } as const;
}
