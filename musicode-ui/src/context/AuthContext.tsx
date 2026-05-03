import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserInfo } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const REFRESH_MARGIN_MS = 60_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleRefresh = useCallback((expiresInMs: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const delay = Math.max(expiresInMs - REFRESH_MARGIN_MS, 10_000);
    console.debug(`[auth] Scheduling token refresh in ${Math.round(delay / 1000)}s`);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const { user: refreshedUser, accessTokenExpiresIn } = await authApi.refresh();
        console.debug('[auth] Proactive refresh succeeded');
        setUser(refreshedUser);
        scheduleRefresh(accessTokenExpiresIn);
      } catch {
        console.debug('[auth] Proactive refresh failed — session expired');
        setUser(null);
      }
    }, delay);
  }, []);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    console.debug('[auth] Checking existing session...');
    authApi.getMe({ signal: controller.signal })
      .then((u) => {
        console.debug('[auth] Session restored for:', u.username, u.role);
        setUser(u);
        // We don't know exact expiry from getMe — do an immediate refresh to get it
        authApi.refresh()
          .then(({ accessTokenExpiresIn }) => scheduleRefresh(accessTokenExpiresIn))
          .catch(() => { /* reactive interceptor will handle it */ });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        console.debug('[auth] No existing session');
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      clearRefreshTimer();
    };
  }, [scheduleRefresh, clearRefreshTimer]);

  const login = useCallback(async (username: string, password: string) => {
    queryClient.clear();
    const { user: loggedInUser, accessTokenExpiresIn } = await authApi.login({ username, password });
    console.debug('[auth] Login success:', loggedInUser.username, loggedInUser.role);
    setUser(loggedInUser);
    scheduleRefresh(accessTokenExpiresIn);
  }, [scheduleRefresh, queryClient]);

  const logout = useCallback(async () => {
    console.debug('[auth] Logging out');
    clearRefreshTimer();
    try {
      await authApi.logout();
    } catch {
      // Ignore — clear local state regardless
    }
    queryClient.clear();
    setUser(null);
  }, [clearRefreshTimer, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'ADMIN',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
