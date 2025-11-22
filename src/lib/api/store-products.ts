import apiClient from "@/lib/api-client";
import type {
  CreateStoreProductPayload,
  StoreProduct,
  StoreProductListResponse,
  StoreProductQuery,
  UpdateStoreProductPayload,
} from "@/types/store-product";

export const storeProductsApi = {
  async list(storeId: string, params?: StoreProductQuery) {
    const { data } = await apiClient.get<StoreProductListResponse>(`/stores/${storeId}/products`, { params });
    return data;
  },
  async create(storeId: string, payload: CreateStoreProductPayload) {
    const { data } = await apiClient.post<StoreProduct>(`/stores/${storeId}/products`, payload);
    return data;
  },
  async update(storeId: string, storeProductId: string, payload: UpdateStoreProductPayload) {
    const { data } = await apiClient.put<StoreProduct>(`/stores/${storeId}/products/${storeProductId}`, payload);
    return data;
  },
  async remove(storeId: string, storeProductId: string) {
    await apiClient.delete(`/stores/${storeId}/products/${storeProductId}`);
  },
};
