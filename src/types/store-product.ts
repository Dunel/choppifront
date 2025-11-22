import type { PaginatedResponse, PaginationQuery } from "@/types/common";
import type { Product } from "@/types/product";

export type StoreProduct = {
  id: string;
  price: number;
  stock: number;
  product: Product;
  storeId: string;
  createdAt: string;
};

export type StoreProductQuery = PaginationQuery & {
  inStock?: boolean;
};

export type StoreProductListResponse = PaginatedResponse<StoreProduct>;

export type CreateStoreProductPayload = {
  productId: string;
  price: number;
  stock: number;
};

export type UpdateStoreProductPayload = Partial<Pick<CreateStoreProductPayload, "price" | "stock">>;
