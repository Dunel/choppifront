import type { AuthResponse, AuthUser } from "@/types/auth";

const TOKEN_KEY = "choppi.accessToken";
const USER_KEY = "choppi.user";
const TOKEN_COOKIE = "choppiAccessToken";

const isBrowser = () => typeof window !== "undefined";

const persistCookie = (token: string) => {
  if (!isBrowser()) return;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${maxAge}`;
};

const clearCookie = () => {
  if (!isBrowser()) return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
};

export const authStorage = {
  getToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch (error) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  setAuth(payload: AuthResponse) {
    if (!isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, payload.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    persistCookie(payload.accessToken);
  },
  clear() {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearCookie();
  },
};
