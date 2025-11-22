import type { PaginatedResponse, PaginationQuery } from "@/types/common";

export type Store = {
  id: string;
  name: string;
  address?: string | null;
  ownerId: string;
  createdAt: string;
  deletedAt?: string | null;
};

export type StoreListResponse = PaginatedResponse<Store>;

export type StoreQueryParams = PaginationQuery;

export type CreateStorePayload = {
  name: string;
  address?: string;
};

export type UpdateStorePayload = Partial<CreateStorePayload>;

export type DeleteStoreResponse = {
  success: boolean;
};
