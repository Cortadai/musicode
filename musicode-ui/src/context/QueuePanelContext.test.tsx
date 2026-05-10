import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { QueuePanelProvider, useQueuePanel } from './QueuePanelContext';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: () => { store = {}; },
  };
})();

function TestConsumer({ onRender }: { onRender: (s: ReturnType<typeof useQueuePanel>) => void }) {
  const state = useQueuePanel();
  onRender(state);
  return null;
}

beforeEach(() => {
  mockLocalStorage.clear();
  vi.stubGlobal('localStorage', mockLocalStorage);
});

describe('QueuePanelContext', () => {
  it('defaults to closed', () => {
    let captured: ReturnType<typeof useQueuePanel> | null = null;
    render(
      <QueuePanelProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </QueuePanelProvider>,
    );
    expect(captured!.isOpen).toBe(false);
  });

  it('reads stored open state from localStorage', () => {
    mockLocalStorage.setItem('mc-queue-panel-open', 'true');
    let captured: ReturnType<typeof useQueuePanel> | null = null;
    render(
      <QueuePanelProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </QueuePanelProvider>,
    );
    expect(captured!.isOpen).toBe(true);
  });

  it('toggle opens and persists', () => {
    let captured: ReturnType<typeof useQueuePanel> | null = null;
    render(
      <QueuePanelProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </QueuePanelProvider>,
    );
    act(() => { captured!.toggle(); });
    expect(captured!.isOpen).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mc-queue-panel-open', 'true');
  });

  it('close sets to false and persists', () => {
    mockLocalStorage.setItem('mc-queue-panel-open', 'true');
    let captured: ReturnType<typeof useQueuePanel> | null = null;
    render(
      <QueuePanelProvider>
        <TestConsumer onRender={s => { captured = s; }} />
      </QueuePanelProvider>,
    );
    act(() => { captured!.close(); });
    expect(captured!.isOpen).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mc-queue-panel-open', 'false');
  });
});
