export type PaginationQuery = {
  page?: number;
  limit?: number;
  q?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
