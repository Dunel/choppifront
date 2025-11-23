"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
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

const DEFAULT_LIMIT = 10;

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

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.meta.total / data.meta.limit)), [data.meta.limit, data.meta.total]);

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

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <form onSubmit={onSubmit} className="flex flex-1 gap-3">
          <input
            type="search"
            placeholder="Buscar producto"
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
        <div className="hidden grid-cols-[2fr_1fr_1fr] bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 md:grid">
          <span>Producto</span>
          <span>Precio</span>
          <span>Stock</span>
        </div>
        {data.data.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">No hay productos registrados para esta tienda.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {data.data.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-4 px-6 py-4 text-sm text-zinc-700 md:grid-cols-[2fr_1fr_1fr] md:items-center">
                <div>
                  <p className="text-base font-semibold text-zinc-900">{item.product.name}</p>
                  <p className="text-xs uppercase tracking-wide text-zinc-400">{item.product.description || "Sin descripción"}</p>
                </div>
                <p className="font-semibold text-zinc-900">{formatter.format(item.price)}</p>
                <p className={`font-semibold ${item.stock > 0 ? "text-green-600" : "text-red-500"}`}>{item.stock}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white/90 px-4 py-3 text-sm text-zinc-600">
        <p>
          Página <span className="font-semibold text-zinc-900">{currentPage}</span> de {totalPages} · Mostrando {data.data.length} de {data.meta.total}
          {query ? ` · Filtro: "${query}"` : ""}
          {inStockOnly ? " · Solo stock disponible" : ""}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(currentPage - 1, query, inStockOnly)}
            disabled={!hasPrev || isPending}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-zinc-300"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => navigate(currentPage + 1, query, inStockOnly)}
            disabled={!hasNext || isPending}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-zinc-300"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
