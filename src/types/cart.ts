export type CartQuoteItem = {
  storeProductId: string;
  quantity: number;
};

export type CartQuoteProduct = {
  id: string;
  name: string;
};

export type CartQuoteStore = {
  id: string;
  name: string;
};

export type CartQuoteLine = CartQuoteItem & {
  unitPrice: number;
  subtotal: number;
  product: CartQuoteProduct;
  store: CartQuoteStore;
};

export type CartQuoteResponse = {
  items: CartQuoteLine[];
  total: number;
};

export type CartQuotePayload = {
  items: CartQuoteItem[];
};
