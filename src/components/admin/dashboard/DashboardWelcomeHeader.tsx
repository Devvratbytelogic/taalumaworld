import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';
import type { ContentMode } from '../../../types/admin';

interface DashboardWelcomeHeaderProps {
  userName: string;
  contentMode: ContentMode;
}

export function DashboardWelcomeHeader({ userName, contentMode }: DashboardWelcomeHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={cn(adminPanelClass, 'relative overflow-hidden p-6')}>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/[0.07] via-transparent to-slate-50/80" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            {contentMode === 'chapters' ? 'Blueprint mode' : 'Series mode'}
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
}
