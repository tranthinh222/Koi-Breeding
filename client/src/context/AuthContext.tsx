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
  currentUserRole: AuthUser["role"];
  loading: boolean;
  refreshCurrentUser: () => Promise<AuthUser | null>;
  setAuthenticatedUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Ban đầu phải loading vì chưa biết user đã đăng nhập hay chưa
  const [loading, setLoading] = useState(true);

  const setAuthenticatedUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
  }, []);

  /**
   * Lấy thông tin user hiện tại.
   *
   * Không cần kiểm tra accessToken vì token nằm trong HttpOnly Cookie.
   * Browser sẽ tự động gửi cookie trong request.
   */
  const refreshCurrentUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();

      // ✓ Nếu null (401), đơn giản là không có user
      setAuthenticatedUser(user);

      return user;
    } catch (error) {
      console.error("Failed to load current user:", error);
      setAuthenticatedUser(null);
      return null;
    }
  }, [setAuthenticatedUser]);

  // Bootstrap useEffect
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        // ✓ getCurrentUser() return null nếu 401
        const user = await getCurrentUser();

        if (!cancelled) {
          setAuthenticatedUser(user);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);

        if (!cancelled) {
          setAuthenticatedUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false); // ✓ CRITICAL: luôn set loading = false
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [setAuthenticatedUser]);

  /**
   * Logout:
   * Backend sẽ xóa HttpOnly Cookie.
   */
  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setAuthenticatedUser(null);
    }
  }, [setAuthenticatedUser]);

  /**
   * Khi app được load/reload:
   *
   * React
   *   ↓
   * GET /auth/me
   *   ↓
   * Browser tự gửi accessToken Cookie
   *   ↓
   * Backend kiểm tra JWT
   *   ↓
   * User hoặc 401
   */
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const user = await getCurrentUser();

        if (!cancelled) {
          setAuthenticatedUser(user);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);

        if (!cancelled) {
          setAuthenticatedUser(null);
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
  }, [setAuthenticatedUser]);

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
