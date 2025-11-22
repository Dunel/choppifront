import apiClient from "@/lib/api-client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export type ProfileResponse = {
  userId: string;
  email: string;
};

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  async profile() {
    const { data } = await apiClient.get<ProfileResponse>("/auth/profile");
    return data;
  },
};
