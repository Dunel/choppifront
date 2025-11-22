"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { authStorage } from "@/lib/auth-storage";
import type { AuthContextValue, AuthResponse, AuthUser, LoginPayload } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await authApi.profile();
      const profileUser: AuthUser = { id: data.userId, email: data.email };
      const currentToken = authStorage.getToken();
      if (currentToken) {
        authStorage.setAuth({ accessToken: currentToken, user: profileUser });
      }
      setUser(profileUser);
      setToken(currentToken);
    } catch (error) {
      authStorage.clear();
      setUser(null);
      setToken(null);
    }
  }, []);

  const loadFromStorage = useCallback(async () => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
      return;
    }

    await fetchProfile();
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    authStorage.setAuth(response);
    setUser(response.user);
    setToken(response.accessToken);
    return response;
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshProfile: fetchProfile,
    }),
    [fetchProfile, loading, login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
