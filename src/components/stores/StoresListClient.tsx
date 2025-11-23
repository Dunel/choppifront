"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Store, StoreListResponse } from "@/types/store";
import { Pagination } from "@/components/common/Pagination";

const formatAddress = (address?: string | null) => address?.trim() || "Sin dirección";

const buildQuery = (page: number, q: string) => {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (q) params.set("q", q);
  const search = params.toString();
  return search ? `/stores?${search}` : "/stores";
};

type Props = {
  data: StoreListResponse;
  currentPage: number;
  query: string;
  limit: number;
};

export function StoresListClient({ data, currentPage, query, limit }: Props) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(query);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      router.push(buildQuery(1, localQuery.trim()));
    });
  };

  const changePage = (page: number) => {
    startTransition(() => {
      router.push(buildQuery(page, query));
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/90 p-4 shadow-sm md:flex-row">
        <input
          type="search"
          placeholder="Buscar tienda por nombre o dirección..."
          className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={localQuery}
          onChange={(event) => setLocalQuery(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
          disabled={isPending}
        >
          {isPending ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <div className="space-y-3">
        {isPending && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Actualizando resultados...
          </div>
        )}
        {data.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
            No encontramos tiendas con ese criterio.
          </div>
        ) : (
          data.data.map((store: Store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="group block rounded-2xl border border-zinc-100 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Tienda</p>
                  <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-primary">{store.name}</h3>
                  <p className="text-sm text-zinc-500">{formatAddress(store.address)}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Ver detalle</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={data.meta.total}
        pageSize={data.meta.limit}
        isPending={isPending}
        onChange={(page) => changePage(page)}
        label="Tiendas"
      />
    </div>
  );
}
