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

type AuthContextValue = {
  currentUser: AuthUser | null;
  currentUserId: number | null;
  loading: boolean;
  refreshCurrentUser: () => Promise<AuthUser | null>;
  setAuthenticatedUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AUTH_USER_STORAGE_KEY = "currentUser";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser() {
  const rawUser = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function hasAuthToken() {
  return Boolean(
    sessionStorage.getItem("userToken") ||
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken"),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    readStoredUser(),
  );
  const [loading, setLoading] = useState(() => hasAuthToken());

  const setAuthenticatedUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
    if (user) {
      sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!hasAuthToken()) {
      setAuthenticatedUser(null);
      return null;
    }

    const user = await getCurrentUser();
    setAuthenticatedUser(user);
    return user;
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
        if (!cancelled) setAuthenticatedUser(user);
      } catch (error) {
        console.error("Failed to load authenticated user:", error);
        if (!cancelled) void logout();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [logout, setAuthenticatedUser]);

  const value = useMemo(
    () => ({
      currentUser,
      currentUserId: currentUser?.id ?? null,
      loading,
      refreshCurrentUser,
      setAuthenticatedUser,
      logout,
    }),
    [currentUser, loading, logout, refreshCurrentUser, setAuthenticatedUser],
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
