import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
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

/**
 * Authentication context provider — manages the current user session.
 *
 * SESSION RESTORATION: On mount, calls GET /api/auth/me to check if the browser
 * already has valid auth cookies (e.g. user refreshed the page or reopened the tab).
 * If the cookies are valid, the user is restored without requiring re-login.
 * If they're expired, the axios interceptor will attempt a refresh automatically.
 *
 * WHY CONTEXT, NOT ZUSTAND/REDUX: Auth state is simple (one user object + loading flag)
 * and changes infrequently (login/logout). Context avoids an external dependency for
 * something that doesn't need optimized re-renders or middleware.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount — cancel if unmounted before response
  useEffect(() => {
    const controller = new AbortController();
    console.debug('[auth] Checking existing session...');
    authApi.getMe({ signal: controller.signal })
      .then((u) => {
        console.debug('[auth] Session restored for:', u.username, u.role);
        setUser(u);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        console.debug('[auth] No existing session');
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const userInfo = await authApi.login({ username, password });
    console.debug('[auth] Login success:', userInfo.username, userInfo.role);
    setUser(userInfo);
  }, []);

  const logout = useCallback(async () => {
    console.debug('[auth] Logging out');
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors — clear local state regardless.
      // The server may be down or the token already expired — either way,
      // the user wants to be logged out locally.
    }
    setUser(null);
  }, []);

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
