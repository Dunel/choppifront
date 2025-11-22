export type AuthUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  displayName?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};
