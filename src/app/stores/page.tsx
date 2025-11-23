import { storesApi } from "@/lib/api";
import { StoresListClient } from "@/components/stores/StoresListClient";
import type { StoreListResponse } from "@/types/store";

function getNumber(param: string | string[] | undefined): number | undefined {
  if (!param) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

function getString(param: string | string[] | undefined): string {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
}

export const dynamic = "force-dynamic";

type StoresSearchParams = Record<string, string | string[]>;

export default async function StoresPage({
  searchParams,
}: {
  searchParams?: Promise<StoresSearchParams>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const page = getNumber(resolvedParams.page) ?? 1;
  const limit = getNumber(resolvedParams.limit) ?? 10;
  const q = getString(resolvedParams.q).trim();

  let data: StoreListResponse | null = null;
  let error: string | null = null;

  try {
    data = await storesApi.list({ page, limit, q });
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Tiendas
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">Listado de tiendas</h1>
          <p className="text-sm text-zinc-600">Explora y busca entre tus tiendas registradas.</p>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Ocurrió un error al cargar las tiendas: {error}
          </div>
        )}

        {!data && !error && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
            Cargando tiendas...
          </div>
        )}

        {data && !error && (
          <StoresListClient data={data} currentPage={page} query={q} limit={limit} />
        )}
      </div>
    </div>
  );
}
