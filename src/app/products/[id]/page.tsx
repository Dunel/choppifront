import { productsApi } from "@/lib/api";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getProduct(id: string): Promise<Product | null> {
  try {
    return await productsApi.get(id);
  } catch (error) {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          No encontramos información para este producto.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Producto
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="text-sm text-zinc-600">{product.description || "Sin descripción registrada"}</p>
        </header>

        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">ID</p>
              <p className="mt-1 truncate text-sm font-medium text-zinc-900">{product.id}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Creación</p>
              <p className="mt-1 text-sm font-medium text-zinc-900">
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Estado</p>
              <p className="mt-1 text-sm font-medium text-zinc-900">Disponible</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Próximamente verás qué tiendas venden este producto, su inventario y métricas clave.
          </p>
        </div>
      </div>
    </div>
  );
}
