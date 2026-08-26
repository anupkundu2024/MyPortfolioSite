import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, apiRequest, clearAccessToken, setAccessToken } from "@/lib/apiClient";

/**
 * Session state for the authenticated CV gate.
 *
 * This context only mirrors what the backend reports. It is never the
 * authorization decision — GET /api/cv independently verifies the session on
 * every request, so flipping any value here grants nothing.
 */
const AuthContext = createContext(null);

const STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  ANONYMOUS: "anonymous",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);

  // Restore an existing session on load so a signed-in visitor is never asked again.
  useEffect(() => {
    const controller = new AbortController();

    apiRequest("/auth/me", { signal: controller.signal })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
          setStatus(STATUS.AUTHENTICATED);
        } else {
          setUser(null);
          setStatus(STATUS.ANONYMOUS);
        }
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        // Offline, cold backend, or blocked cookie — treat as a visitor.
        setUser(null);
        setStatus(STATUS.ANONYMOUS);
      });

    return () => controller.abort();
  }, []);

  const adoptSession = useCallback((data) => {
    setAccessToken(data?.accessToken);
    setUser(data?.user ?? null);
    setStatus(data?.user ? STATUS.AUTHENTICATED : STATUS.ANONYMOUS);
    return data?.user ?? null;
  }, []);

  const register = useCallback(
    async ({ name, email, password, consent }) =>
      adoptSession(await apiRequest("/auth/register", {
        method: "POST",
        body: { name, email, password, consent },
      })),
    [adoptSession]
  );

  const login = useCallback(
    async ({ email, password }) =>
      adoptSession(await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      })),
    [adoptSession]
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Even if the call fails, drop local state so the UI reflects sign-out.
    }
    clearAccessToken();
    setUser(null);
    setStatus(STATUS.ANONYMOUS);
  }, []);

  /** Exchanges the active session for a short-lived CV ticket. */
  const requestCvTicket = useCallback(async () => {
    try {
      return await apiRequest("/cv/ticket", { method: "POST" });
    } catch (error) {
      // A rejected session here means the cookie expired between page load and click.
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearAccessToken();
        setUser(null);
        setStatus(STATUS.ANONYMOUS);
      }
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === STATUS.AUTHENTICATED,
      isResolving: status === STATUS.LOADING,
      register,
      login,
      logout,
      requestCvTicket,
    }),
    [user, status, register, login, logout, requestCvTicket]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}
