import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';
import { Input } from '@/components/ui/input';
import type { ContentMode } from '../../../types/admin';

interface DashboardWelcomeHeaderProps {
  userName: string;
  contentMode: ContentMode;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onClearDateFilter: () => void;
}

export function DashboardWelcomeHeader({
  userName,
  contentMode,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClearDateFilter,
}: DashboardWelcomeHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const hasDateFilter = !!fromDate || !!toDate;

  return (
    <div className={cn(adminPanelClass, 'relative overflow-hidden p-6')}>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/[0.07] via-transparent to-slate-50/80" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              {contentMode === 'chapters' ? 'Blueprint mode' : 'Series mode'}
            </span>
            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
              {today}
            </span>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-0 flex-col gap-1 sm:w-40">
              <label className="text-xs font-medium text-slate-500">From</label>
              <Input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="h-9 w-full bg-white text-sm"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:w-40">
              <label className="text-xs font-medium text-slate-500">To</label>
              <Input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => onToDateChange(e.target.value)}
                className="h-9 w-full bg-white text-sm"
              />
            </div>
            {hasDateFilter ? (
              <button
                type="button"
                onClick={onClearDateFilter}
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! bg-white px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
