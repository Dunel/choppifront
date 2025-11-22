"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 px-4 py-12">
        <section className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl bg-white/80 p-10 shadow-xl shadow-primary/10">
          <header className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Panel Choppi
            </p>
            <div>
              <p className="text-sm font-semibold text-primary">Administración central</p>
              <h1 className="text-4xl font-bold text-zinc-900">Vista general del negocio</h1>
            </div>
            <p className="text-sm text-zinc-500">
              Sesión iniciada como <span className="font-semibold text-zinc-900">{user?.email}</span>
            </p>
          </header>

          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
              Próximamente
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900">Gestión de tiendas y catálogo</h2>
            <p className="mt-2 text-base text-zinc-600">
              Aquí podrás controlar tiendas, productos y stock en tiempo real. Estamos preparando los tableros y
              reportes para ofrecerte una experiencia completa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a]">
                Ver tiendas
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10">
                Explorar catálogo
              </button>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
