export type Product = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
};

export type CreateProductPayload = {
  name: string;
  description?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;
