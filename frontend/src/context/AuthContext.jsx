/**
 * AuthContext — provides authentication state and actions to the entire app.
 *
 * Exports:
 *  useAuth()  — hook to consume auth state inside any component
 *  AuthProvider — wrap the app with this
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /** On every mount: set the CSRF cookie first, then check session. */
  const bootstrap = useCallback(async () => {
    try {
      await authApi.getCSRF();
      const { data } = await authApi.getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (username, password) => {
    const { data } = await authApi.login({ username, password });
    setUser(data);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await authApi.register({ username, email, password });
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
