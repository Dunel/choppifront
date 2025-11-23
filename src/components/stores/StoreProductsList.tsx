"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Pagination } from "@/components/common/Pagination";
import { cartApi } from "@/lib/api/cart";
import type { CartQuoteItem, CartQuoteResponse } from "@/types/cart";
import type { StoreProductListResponse } from "@/types/store-product";

const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

type Props = {
  storeId: string;
  data: StoreProductListResponse;
  currentPage: number;
  limit: number;
  query: string;
  inStockOnly: boolean;
};

const DEFAULT_LIMIT = 20;

const buildQuery = (pathname: string, page: number, limit: number, query: string, inStock: boolean) => {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (limit !== DEFAULT_LIMIT) params.set("limit", String(limit));
  if (query) params.set("q", query);
  if (inStock) params.set("inStock", "true");
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
};

export function StoreProductsList({ storeId, data, currentPage, limit, query, inStockOnly }: Props) {
  const router = useRouter();
  const pathname = usePathname() || `/stores/${storeId}`;
  const [localQuery, setLocalQuery] = useState(query);
  const [isPending, startTransition] = useTransition();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteSummary, setQuoteSummary] = useState<CartQuoteResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const productIds = new Set(data.data.map((item) => item.id));
    setQuantities((prev) => {
      let changed = false;
      const next: Record<string, number> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (productIds.has(key) && value > 0) {
          next[key] = value;
        } else if (productIds.has(key) === false) {
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [data.data]);

  useEffect(() => {
    setQuoteSummary(null);
    setQuoteError(null);
  }, [storeId, currentPage, query, inStockOnly]);

  const navigate = (page: number, nextQuery: string, nextInStock: boolean) => {
    startTransition(() => {
      router.push(buildQuery(pathname, page, limit, nextQuery, nextInStock));
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(1, localQuery.trim(), inStockOnly);
  };

  const toggleStock = () => {
    navigate(1, query, !inStockOnly);
  };

  const selectedItems: CartQuoteItem[] = Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([storeProductId, quantity]) => ({ storeProductId, quantity }));

  const selectedCount = selectedItems.length;
  const quoteDisabled = selectedCount === 0 || isQuoting;

  const handleQuantityChange = (storeProductId: string, value: string) => {
    if (value === "") {
      setQuantities((prev) => {
        if (!(storeProductId in prev)) return prev;
        const next = { ...prev };
        delete next[storeProductId];
        return next;
      });
      return;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    const quantityValue = Math.max(0, Math.floor(parsed));

    setQuantities((prev) => {
      if (quantityValue === 0) {
        if (!(storeProductId in prev)) return prev;
        const next = { ...prev };
        delete next[storeProductId];
        return next;
      }
      if (prev[storeProductId] === quantityValue) return prev;
      return { ...prev, [storeProductId]: quantityValue };
    });
  };

  const handleQuote = async () => {
    if (!selectedItems.length) return;
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const response = await cartApi.quote(selectedItems);
      setQuoteSummary(response);
    } catch (error) {
      setQuoteError("No pudimos calcular el subtotal. Intenta nuevamente.");
    } finally {
      setIsQuoting(false);
    }
  };

  const clearSelections = () => {
    setQuantities({});
    setQuoteSummary(null);
    setQuoteError(null);
  };

  useEffect(() => {
    if (selectedCount === 0) {
      setQuoteSummary(null);
      setQuoteError(null);
    }
  }, [selectedCount]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <form onSubmit={onSubmit} className="flex flex-1 gap-3">
          <input
            type="search"
            placeholder="Buscar producto"
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
            disabled={isPending}
          >
            {isPending ? "Buscando..." : "Buscar"}
          </button>
        </form>
        <button
          type="button"
          onClick={toggleStock}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${inStockOnly ? "bg-primary text-primary-foreground" : "border border-zinc-200 text-zinc-600 hover:border-primary/50 hover:text-primary"}`}
          disabled={isPending}
        >
          {inStockOnly ? "Filtrando stock" : "Ver solo con stock"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 md:grid">
          <span>Producto</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Cantidad</span>
        </div>
        {isPending && (
          <div className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Actualizando inventario...</div>
        )}
        {data.data.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">No hay productos registrados para esta tienda.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {data.data.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-4 px-6 py-4 text-sm text-zinc-700 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center">
                <div>
                  <p className="text-base font-semibold text-zinc-900">{item.product.name}</p>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">{item.product.description || "Sin descripción"}</p>
                </div>
                <p className="font-semibold text-zinc-900">{formatter.format(item.price)}</p>
                <p className={`font-semibold ${item.stock > 0 ? "text-green-600" : "text-red-500"}`}>{item.stock}</p>
                <div className="flex flex-col gap-1 md:items-end">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 md:hidden">Cantidad</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 md:w-24"
                    value={quantities[item.id]?.toString() ?? ""}
                    onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                  />
                  {quantities[item.id] ? (
                    <p className="text-xs font-medium text-primary md:text-[11px]">
                      {quantities[item.id]} uds
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-400 md:text-[11px]">Sin seleccionar</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white/90 px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              {selectedCount > 0
                ? `${selectedCount} producto${selectedCount === 1 ? "" : "s"} listos para cotizar`
                : "Selecciona cantidades para cotizar tu carrito."}
            </p>
            {quoteSummary && (
              <p className="text-sm font-semibold text-primary">Total estimado: {formatter.format(quoteSummary.total)}</p>
            )}
            {quoteError && <p className="text-sm text-red-600">{quoteError}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleQuote}
              disabled={quoteDisabled}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isQuoting ? "Calculando..." : "Calcular subtotal"}
            </button>
            {(selectedCount > 0 || quoteSummary !== null) && (
              <button
                type="button"
                onClick={clearSelections}
                disabled={isQuoting}
                className="rounded-xl border border-zinc-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-zinc-300"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
        {quoteSummary && (
          <div className="mt-4 rounded-xl border border-zinc-100 bg-white px-4 py-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <span>Producto</span>
              <span className="hidden md:block">Detalles</span>
            </div>
            <div className="mt-2 divide-y divide-zinc-100 text-sm text-zinc-700">
              {quoteSummary.items.map((item) => (
                <div key={item.storeProductId} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">{item.product.name}</p>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">{item.store.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500 md:text-sm">
                    <span>Cant: <strong className="text-zinc-900">{item.quantity}</strong></span>
                    <span>Unit: <strong className="text-zinc-900">{formatter.format(item.unitPrice)}</strong></span>
                    <span>Subtotal: <strong className="text-primary">{formatter.format(item.subtotal)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={data.meta.total}
        pageSize={data.meta.limit}
        isPending={isPending}
        onChange={(page: number) => navigate(page, query, inStockOnly)}
        label={inStockOnly ? "Productos con stock" : "Productos"}
      />
    </div>
  );
}
