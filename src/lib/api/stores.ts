import apiClient from "@/lib/api-client";
import type {
  CreateStorePayload,
  DeleteStoreResponse,
  Store,
  StoreListResponse,
  StoreQueryParams,
  UpdateStorePayload,
} from "@/types/store";

export const storesApi = {
  async list(params?: StoreQueryParams) {
    const { data } = await apiClient.get<StoreListResponse>("/stores", { params });
    return data;
  },
  async create(payload: CreateStorePayload) {
    const { data } = await apiClient.post<Store>("/stores", payload);
    return data;
  },
  async get(id: string) {
    const { data } = await apiClient.get<Store>(`/stores/${id}`);
    return data;
  },
  async update(id: string, payload: UpdateStorePayload) {
    const { data } = await apiClient.put<Store>(`/stores/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<DeleteStoreResponse>(`/stores/${id}`);
    return data;
  },
};
