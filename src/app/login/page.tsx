"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values);
      router.push("/");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message ??
        "No se pudo iniciar sesión";
      setSubmitError(Array.isArray(message) ? message.join(", ") : message);
    }
  });

  const disabled = useMemo(() => loading || isSubmitting, [isSubmitting, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Choppi Admin
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-zinc-500">Ingresa con tu cuenta para administrar tus tiendas.</p>

        <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:bg-[#e6952a] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-white"
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
