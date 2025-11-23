import { StoreProductsList } from "@/components/stores/StoreProductsList";
import { storeProductsApi, storesApi } from "@/lib/api";
import type { Store } from "@/types/store";
import type { StoreProductListResponse } from "@/types/store-product";

export const dynamic = "force-dynamic";

async function getStore(id: string): Promise<Store | null> {
  try {
    return await storesApi.get(id);
  } catch (e) {
    return null;
  }
}

async function getStoreProducts(
  storeId: string,
  params: { page: number; limit: number; q: string; inStock?: boolean }
): Promise<StoreProductListResponse | null> {
  try {
    return await storeProductsApi.list(storeId, params);
  } catch (error) {
    return null;
  }
}

type StoreDetailSearchParams = Record<string, string | string[]>;

const getNumber = (param: string | string[] | undefined): number | undefined => {
  if (!param) return undefined;
  const value = Array.isArray(param) ? param[0] : param;
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

const getString = (param: string | string[] | undefined): string => {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
};

const getBoolean = (param: string | string[] | undefined): boolean => {
  const value = getString(param).toLowerCase();
  if (!value) return false;
  return ["true", "1", "yes", "on"].includes(value);
};

export default async function StoreDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<StoreDetailSearchParams>;
}) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const safeParams = resolvedSearchParams ?? {};
  const page = getNumber(safeParams.page) ?? 1;
  const limit = getNumber(safeParams.limit) ?? 20;
  const q = getString(safeParams.q).trim();
  const inStockOnly = getBoolean(safeParams.inStock);

  const store = await getStore(id);

  if (!store) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          No se encontró la tienda solicitada.
        </div>
      </div>
    );
  }

  const productsData = await getStoreProducts(id, {
    page,
    limit,
    q,
    inStock: inStockOnly ? true : undefined,
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100">
      <header className="w-full border-b border-zinc-100 bg-primary py-4 px-8 flex items-center justify-between">
        <span className="text-xl font-bold text-white tracking-tight">Choppi</span>
        <nav className="flex gap-6">
          <a href="/" className="text-white font-medium hover:underline transition">Inicio</a>
          <a href="/stores" className="text-white font-medium hover:underline transition">Tiendas</a>
          <a href="/login" className="text-white font-medium hover:underline transition">Login</a>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Tienda
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">{store.name}</h1>
          <p className="text-sm text-zinc-600">{store.address || "Sin dirección"}</p>
        </header>

        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">Resumen</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Aquí se mostrará información extendida de la tienda, productos asociados y métricas clave conforme se
            desarrollen más módulos.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">ID</p>
              <p className="mt-1 truncate text-sm font-medium text-zinc-900">{store.id}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">Creación</p>
              <p className="mt-1 text-sm font-medium text-zinc-900">{new Date(store.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">Estado</p>
              <p className="mt-1 text-sm font-medium text-zinc-900">{store.deletedAt ? "Inactiva" : "Activa"}</p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Productos</p>
            <h2 className="text-2xl font-semibold text-zinc-900">Inventario por tienda</h2>
            <p className="text-sm text-zinc-600">Filtra los productos por disponibilidad y busca por nombre.</p>
          </div>

          {!productsData ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              No pudimos cargar los productos de esta tienda. Intenta actualizar la página.
            </div>
          ) : (
            <StoreProductsList
              storeId={store.id}
              data={productsData}
              currentPage={page}
              limit={limit}
              query={q}
              inStockOnly={inStockOnly}
            />
          )}
        </section>
      </div>
    </div>
  );
}
