"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productsApi } from "@/lib/api";
import type { Product } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  description: z.string().optional(),
});

type ProductValues = z.infer<typeof productSchema>;
type Toast = { type: "success" | "error"; message: string } | null;

export function ProductManager() {
  const [toast, setToast] = useState<Toast>(null);
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null);
  const [productIdInput, setProductIdInput] = useState("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isPending, startTransition] = useTransition();

  const createForm = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "" },
  });

  const editForm = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (loadedProduct) {
      editForm.reset({
        name: loadedProduct.name,
        description: loadedProduct.description ?? "",
      });
      setProductIdInput(loadedProduct.id);
    }
  }, [editForm, loadedProduct]);

  const handleCreateProduct = createForm.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const product = await productsApi.create(values);
        setLoadedProduct(product);
        setToast({ type: "success", message: "Producto creado" });
        createForm.reset({ name: "", description: "" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo crear el producto" });
      }
    });
  });

  const loadProduct = async () => {
    if (!productIdInput) return;
    setIsLoadingProduct(true);
    try {
      const product = await productsApi.get(productIdInput);
      setLoadedProduct(product);
      setToast({ type: "success", message: "Producto cargado" });
    } catch (error) {
      setLoadedProduct(null);
      setToast({ type: "error", message: "No se encontró ese producto" });
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleUpdateProduct = editForm.handleSubmit((values) => {
    if (!loadedProduct) return;
    startTransition(async () => {
      try {
        const updated = await productsApi.update(loadedProduct.id, values);
        setLoadedProduct(updated);
        setToast({ type: "success", message: "Producto actualizado" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo actualizar" });
      }
    });
  });

  const handleDeleteProduct = () => {
    if (!loadedProduct) return;
    startTransition(async () => {
      try {
        await productsApi.remove(loadedProduct.id);
        setLoadedProduct(null);
        editForm.reset({ name: "", description: "" });
        setToast({ type: "success", message: "Producto eliminado" });
      } catch (error) {
        setToast({ type: "error", message: "No se pudo eliminar" });
      }
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-zinc-100 bg-white/90 p-8 shadow-sm">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Productos</p>
        <h2 className="text-3xl font-semibold text-zinc-900">Gestión de productos</h2>
        <p className="text-sm text-zinc-500">Administra el catálogo global de productos.</p>
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
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Crear producto</h3>
            <p className="text-sm text-zinc-500">Registra un nuevo producto en el catálogo global.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Nombre</label>
            <input
              type="text"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Cerveza 620 ml"
              {...createForm.register("name")}
            />
            {createForm.formState.errors.name && (
              <p className="text-sm text-red-500">{createForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Descripción</label>
            <textarea
              className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Notas adicionales"
              {...createForm.register("description")}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {isPending ? "Guardando..." : "Crear producto"}
          </button>
        </form>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Editar producto</h3>
            <p className="text-sm text-zinc-500">Ingresa el ID del producto para editarlo o eliminarlo.</p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ID del producto"
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary"
              value={productIdInput}
              onChange={(event) => setProductIdInput(event.target.value)}
            />
            <button
              type="button"
              onClick={loadProduct}
              className="rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
              disabled={isLoadingProduct}
            >
              {isLoadingProduct ? "Buscando..." : "Cargar"}
            </button>
          </div>

          {loadedProduct ? (
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Nombre</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...editForm.register("name")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Descripción</label>
                <textarea
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  {...editForm.register("description")}
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
                  onClick={handleDeleteProduct}
                  className="flex-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:text-red-700 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-zinc-500">Cargá un producto para editarlo.</p>
          )}
        </div>
      </div>
    </section>
  );
}
