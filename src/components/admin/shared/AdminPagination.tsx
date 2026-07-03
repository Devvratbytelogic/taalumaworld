'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type AdminPaginationProps = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    disabled?: boolean;
    itemLabel?: string;
};

export function AdminPagination({
    page,
    limit,
    total,
    totalPages,
    onPageChange,
    onLimitChange,
    disabled = false,
    itemLabel = 'items',
}: AdminPaginationProps) {
    if (total <= 0) return null;

    const rangeStart = (page - 1) * limit + 1;
    const rangeEnd = Math.min(page * limit, total);

    return (
        <div className="admin-surface flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <p>
                    Showing{' '}
                    <span className="font-medium text-foreground">{rangeStart}–{rangeEnd}</span>
                    {' '}of{' '}
                    <span className="font-medium text-foreground">{total}</span> {itemLabel}
                </p>

                <span className="hidden sm:inline text-slate-300">|</span>

                <label className="flex items-center gap-1.5">
                    <span>Rows</span>
                    <select
                        value={limit}
                        disabled={disabled}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="min-h-8! h-8! max-h-8! rounded-sm! border border-slate-200 bg-white px-1.5 text-sm leading-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </label>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        disabled={page <= 1 || disabled}
                        onClick={() => onPageChange(page - 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full! border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-16 text-center text-sm text-muted-foreground">
                        {page} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= totalPages || disabled}
                        onClick={() => onPageChange(page + 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full! border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
