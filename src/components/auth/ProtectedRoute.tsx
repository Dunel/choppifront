"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export function ProtectedRoute({ children, redirectTo = "/login", fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  if (loading) {
    return (
      fallback ?? (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-zinc-500">
          Validando sesión...
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
