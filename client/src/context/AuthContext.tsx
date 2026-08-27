import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser, logoutRequest, type AuthUser } from "../api/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type AuthContextValue = {
  currentUser: AuthUser | null;
  currentUserId: number | null;
  currentUserRole: AuthUser["role"];
  loading: boolean;
  refreshCurrentUser: () => Promise<AuthUser | null>;
  setAuthenticatedUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function hasAuthToken() {
  return Boolean(
    sessionStorage.getItem("userToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken"),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // currentUser chỉ tồn tại trong React state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(() => hasAuthToken());

  const setAuthenticatedUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!hasAuthToken()) {
      setAuthenticatedUser(null);
      return null;
    }

    try {
      const user = await getCurrentUser();

      setAuthenticatedUser(user);

      return user;
    } catch (error) {
      console.error("Failed to load current user:", error);
      setAuthenticatedUser(null);
      throw error;
    }
  }, [setAuthenticatedUser]);

  const clearLocalAuth = useCallback(() => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAuthenticatedUser(null);
  }, [setAuthenticatedUser]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearLocalAuth();
    }
  }, [clearLocalAuth]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!hasAuthToken()) {
        setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();

        if (!cancelled) {
          setAuthenticatedUser(user);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);

        if (!cancelled) {
          await logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [logout, setAuthenticatedUser]);

  const value = useMemo(
    () => ({
      currentUser,
      currentUserId: currentUser?.id ?? null,
      currentUserRole: currentUser?.role ?? null,
      loading,
      refreshCurrentUser,
      setAuthenticatedUser,
      logout,
    }),
    [currentUser, loading, refreshCurrentUser, setAuthenticatedUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
