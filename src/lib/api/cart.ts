import apiClient from "@/lib/api-client";
import type { CartQuoteItem, CartQuotePayload, CartQuoteResponse } from "@/types/cart";

export const cartApi = {
  async quote(items: CartQuoteItem[]) {
    const payload: CartQuotePayload = { items };
    const { data } = await apiClient.post<CartQuoteResponse>("/cart/quote", payload);
    return data;
  },
};
