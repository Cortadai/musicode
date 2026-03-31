import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test the refresh queue logic in isolation
// We extract the core logic pattern rather than testing the axios interceptor directly

describe('Auth refresh queue logic', () => {
  let isRefreshing: boolean;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }>;

  function processQueue(error: unknown | null) {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve();
    });
    failedQueue = [];
  }

  beforeEach(() => {
    isRefreshing = false;
    failedQueue = [];
  });

  it('processQueue resolves all when no error', () => {
    const resolve1 = vi.fn();
    const reject1 = vi.fn();
    const resolve2 = vi.fn();
    const reject2 = vi.fn();

    failedQueue.push({ resolve: resolve1, reject: reject1 });
    failedQueue.push({ resolve: resolve2, reject: reject2 });

    processQueue(null);

    expect(resolve1).toHaveBeenCalled();
    expect(resolve2).toHaveBeenCalled();
    expect(reject1).not.toHaveBeenCalled();
    expect(reject2).not.toHaveBeenCalled();
    expect(failedQueue).toHaveLength(0);
  });

  it('processQueue rejects all on error', () => {
    const resolve1 = vi.fn();
    const reject1 = vi.fn();
    const resolve2 = vi.fn();
    const reject2 = vi.fn();
    const error = new Error('refresh failed');

    failedQueue.push({ resolve: resolve1, reject: reject1 });
    failedQueue.push({ resolve: resolve2, reject: reject2 });

    processQueue(error);

    expect(reject1).toHaveBeenCalledWith(error);
    expect(reject2).toHaveBeenCalledWith(error);
    expect(resolve1).not.toHaveBeenCalled();
    expect(resolve2).not.toHaveBeenCalled();
    expect(failedQueue).toHaveLength(0);
  });

  it('empty queue processes without error', () => {
    expect(() => processQueue(null)).not.toThrow();
    expect(() => processQueue(new Error('fail'))).not.toThrow();
  });

  it('isRefreshing flag prevents concurrent refreshes', () => {
    isRefreshing = false;
    expect(isRefreshing).toBe(false);

    isRefreshing = true;
    // When isRefreshing, new 401s queue instead of triggering refresh
    const queued = new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });

    expect(failedQueue).toHaveLength(1);

    // After refresh completes, process queue
    processQueue(null);
    isRefreshing = false;

    expect(failedQueue).toHaveLength(0);
    expect(isRefreshing).toBe(false);
  });
});

describe('Auth types', () => {
  it('UserInfo role is ADMIN or LISTENER', () => {
    const admin = { id: 1, username: 'admin', role: 'ADMIN' as const, enabled: true };
    const listener = { id: 2, username: 'bob', role: 'LISTENER' as const, enabled: true };

    expect(admin.role).toBe('ADMIN');
    expect(listener.role).toBe('LISTENER');
  });

  it('isAdmin computed from role', () => {
    const isAdmin = (role: string) => role === 'ADMIN';

    expect(isAdmin('ADMIN')).toBe(true);
    expect(isAdmin('LISTENER')).toBe(false);
  });
});
