import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Settings } from 'lucide-react';
import { useDeckStore } from './useDeckStore';
import { SCOPE_REGISTRY } from './types';

export default function DeckSettings() {
  const { activeScopes, toggleScope } = useDeckStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  return (
    <div className="analyzer-deck__settings">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="analyzer-deck__settings-btn"
        aria-label="Deck settings"
        aria-expanded={open}
      >
        <Settings size={13} />
      </button>
      {open && createPortal(
        <div
          ref={panelRef}
          className="analyzer-deck__settings-panel"
          style={{
            position: 'fixed',
            top: panelPos.top,
            right: panelPos.right,
            zIndex: 9999,
          }}
        >
          {SCOPE_REGISTRY.map((scope) => {
            const active = activeScopes.includes(scope.id);
            const isLast = active && activeScopes.length === 1;
            return (
              <label
                key={scope.id}
                className={`analyzer-deck__settings-item ${isLast ? 'analyzer-deck__settings-item--disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  disabled={isLast}
                  onChange={() => toggleScope(scope.id)}
                />
                <span>{scope.name}</span>
              </label>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
