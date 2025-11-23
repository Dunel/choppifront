"use client";

import { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  isPending?: boolean;
  onChange: (page: number) => void;
  label?: string;
};

export function Pagination({ currentPage, totalItems, pageSize, isPending = false, onChange, label }: PaginationProps) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize))), [pageSize, totalItems]);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white/90 px-4 py-3 text-sm text-zinc-600">
      <p>
        {label && <span className="text-xs uppercase tracking-widest text-primary/70">{label}</span>}
        <span className="ml-2">
          Página <span className="font-semibold text-zinc-900">{currentPage}</span> de {totalPages}
        </span>
        <span className="ml-1">· Total: {totalItems}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(currentPage - 1)}
          disabled={!canGoPrev || isPending}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-zinc-300"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onChange(currentPage + 1)}
          disabled={!canGoNext || isPending}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-zinc-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
