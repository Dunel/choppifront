import apiClient from "@/lib/api-client";
import type { CreateProductPayload, Product } from "@/types/product";

export const productsApi = {
  async get(id: string) {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },
  async create(payload: CreateProductPayload) {
    const { data } = await apiClient.post<Product>("/products", payload);
    return data;
  },
};
