import axios from "axios";
import { authStorage } from "@/lib/auth-storage";

const getRemoteBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const isBrowser = () => typeof window !== "undefined";
const baseURL = isBrowser() ? "/api/choppi" : getRemoteBaseUrl();

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "*/*",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
