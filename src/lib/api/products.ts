import apiClient from "@/lib/api-client";
import type { CreateProductPayload, Product, UpdateProductPayload } from "@/types/product";

export const productsApi = {
  async get(id: string) {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },
  async create(payload: CreateProductPayload) {
    const { data } = await apiClient.post<Product>("/products", payload);
    return data;
  },
  async update(id: string, payload: UpdateProductPayload) {
    const { data } = await apiClient.put<Product>(`/products/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    await apiClient.delete(`/products/${id}`);
  },
};
