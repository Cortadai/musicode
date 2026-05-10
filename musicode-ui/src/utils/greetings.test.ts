import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chooseGreeting, getTimeGreeting } from './greetings';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  mockLocalStorage.clear();
  vi.stubGlobal('localStorage', mockLocalStorage);
  vi.restoreAllMocks();
});

describe('chooseGreeting', () => {
  it('returns a greeting with id and text', () => {
    const g = chooseGreeting();
    expect(g).toHaveProperty('id');
    expect(g).toHaveProperty('text');
    expect(typeof g.text).toBe('string');
    expect(g.text.length).toBeGreaterThan(0);
  });

  it('stores last greeting id in localStorage', () => {
    const g = chooseGreeting();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'musicode-last-greeting',
      g.id,
    );
  });

  it('avoids repeating the last greeting when possible', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const g = chooseGreeting();
      ids.add(g.id);
    }
    expect(ids.size).toBeGreaterThan(1);
  });

  it('returns quotes with subtitle', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const g = chooseGreeting();
    expect(g.subtitle).toBeDefined();
  });

  it('handles time-aware pool at different hours', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const dateSpy = vi.spyOn(Date.prototype, 'getHours').mockReturnValue(2);
    const g = chooseGreeting();
    expect(g.id).toMatch(/^t-/);
    dateSpy.mockRestore();
  });
});

describe('getTimeGreeting', () => {
  it('returns Good morning before noon', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    expect(getTimeGreeting()).toBe('Good morning');
  });

  it('returns Good afternoon from 12-17', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(getTimeGreeting()).toBe('Good afternoon');
  });

  it('returns Good evening from 18+', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(getTimeGreeting()).toBe('Good evening');
  });

  it('returns Good morning at hour 0', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(0);
    expect(getTimeGreeting()).toBe('Good morning');
  });

  it('returns Good afternoon at hour 12', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    expect(getTimeGreeting()).toBe('Good afternoon');
  });

  it('returns Good evening at hour 18', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(18);
    expect(getTimeGreeting()).toBe('Good evening');
  });
});
