"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProductManager } from "@/components/admin/ProductManager";
import { StoreManager } from "@/components/admin/StoreManager";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
        <section className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-white/90 p-10 shadow-xl shadow-primary/10">
          <header className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Panel Choppi
            </p>
            <div>
              <p className="text-sm font-semibold text-primary">Administración central</p>
              <h1 className="text-4xl font-bold text-zinc-900">Vista general del negocio</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-zinc-500">
                Sesión iniciada como <span className="font-semibold text-zinc-900">{user?.email}</span>
              </p>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-primary/30 bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e6952a]"
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              Herramientas activas
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900">Gestión de tiendas y catálogo</h2>
            <p className="mt-2 text-base text-zinc-600">
              Usa las secciones inferiores para crear, editar o eliminar tiendas y productos. Los cambios impactan
              directamente en el backend de Choppi.
            </p>
          </div>
        </section>

        <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-8">
          <StoreManager />
          <ProductManager />
        </div>
      </div>
    </ProtectedRoute>
  );
}
