"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { storesApi } from "@/lib/api";
import type { Store } from "@/types/store";

const createStoreSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  address: z.string().optional(),
});

const editStoreSchema = createStoreSchema;

type CreateStoreValues = z.infer<typeof createStoreSchema>;

type Toast = { type: "success" | "error"; message: string } | null;

export function StoreManager() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [toast, setToast] = useState<Toast>(null);
  const [isFetchingStores, setIsFetchingStores] = useState(true);
  const [isPending, startTransition] = useTransition();

  const createForm = useForm<CreateStoreValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: "", address: "" },
  });

  const editForm = useForm<CreateStoreValues>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: { name: "", address: "" },
  });

  const selectedStore = useMemo(() => stores.find((store) => store.id === selectedStoreId), [selectedStoreId, stores]);

  useEffect(() => {
    setIsFetchingStores(true);
    storesApi
      .list({ limit: 50 })
      .then((response) => {
        setStores(response.data);
        if (response.data[0]) {
          setSelectedStoreId(response.data[0].id);
        }
      })
      .catch(() => {
        setToast({ type: "error", message: "No pudimos cargar las tiendas" });
      })
      .finally(() => setIsFetchingStores(false));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      editForm.reset({
        name: selectedStore.name,
        address: selectedStore.address ?? "",
      });
    }
  }, [editForm, selectedStore]);

  const handleCreateStore = createForm.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const newStore = await storesApi.create(values);
        setStores((prev) => [newStore, ...prev]);
        setSelectedStoreId(newStore.id);
        createForm.reset({ name: "", address: "" });
        setToast({ type: "success", message: "Tienda creada correctamente" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo crear la tienda" });
      }
    });
  });

  const handleUpdateStore = editForm.handleSubmit((values) => {
    if (!selectedStoreId) return;
    startTransition(async () => {
      try {
        const updated = await storesApi.update(selectedStoreId, values);
        setStores((prev) => prev.map((store) => (store.id === updated.id ? updated : store)));
        setToast({ type: "success", message: "Tienda actualizada" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo actualizar la tienda" });
      }
    });
  });

  const handleDeleteStore = () => {
    if (!selectedStoreId) return;
    startTransition(async () => {
      try {
        await storesApi.remove(selectedStoreId);
        setStores((prev) => {
          const next = prev.filter((store) => store.id !== selectedStoreId);
          const nextId = next[0]?.id ?? "";
          setSelectedStoreId(nextId);
          if (!nextId) {
            editForm.reset({ name: "", address: "" });
          }
          return next;
        });
        setToast({ type: "success", message: "Tienda eliminada" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo eliminar la tienda" });
      }
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-zinc-100 bg-white/90 p-8 shadow-sm">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tiendas</p>
        <h2 className="text-3xl font-semibold text-zinc-900">Gestión de tiendas</h2>
        <p className="text-sm text-zinc-500">Crea, actualiza o elimina tiendas del catálogo.</p>
      </header>

      {toast && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleCreateStore} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Crear tienda</h3>
            <p className="text-sm text-zinc-500">Ingresa la información básica y guarda para agregar una nueva tienda.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Nombre</label>
            <input
              type="text"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Bodega Central"
              {...createForm.register("name")}
            />
            {createForm.formState.errors.name && (
              <p className="text-sm text-red-500">{createForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Dirección</label>
            <input
              type="text"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Av. Siempre Viva 123"
              {...createForm.register("address")}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {isPending ? "Guardando..." : "Crear tienda"}
          </button>
        </form>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Editar tienda</h3>
            <p className="text-sm text-zinc-500">Selecciona una tienda para actualizar o eliminar sus datos.</p>
          </div>
          {isFetchingStores ? (
            <p className="text-sm text-zinc-500">Cargando tiendas...</p>
          ) : stores.length === 0 ? (
            <p className="text-sm text-zinc-500">Aún no hay tiendas registradas.</p>
          ) : (
            <>
              <select
                className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary"
                value={selectedStoreId}
                onChange={(event) => setSelectedStoreId(event.target.value)}
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>

              <form onSubmit={handleUpdateStore} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Nombre</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...editForm.register("name")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Dirección</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...editForm.register("address")}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    {isPending ? "Actualizando..." : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDeleteStore}
                    className="flex-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:text-red-700 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
                  >
                    Eliminar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
