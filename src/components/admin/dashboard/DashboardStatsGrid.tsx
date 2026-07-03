import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const colorClasses = {
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-amber-50 text-amber-600',
};

interface DashboardStatsGridProps {
  stats: StatCard[];
  isLoading?: boolean;
}

function StatCardSkeleton() {
  return (
    <div className={cn(adminPanelClass, 'animate-pulse p-5')}>
      <div className="mb-4 flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-slate-100" />
        <div className="h-5 w-12 rounded bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-slate-100" />
        <div className="h-7 w-16 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function DashboardStatsGrid({ stats, isLoading }: DashboardStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        const card = (
          <div
            className={cn(
              adminPanelClass,
              'p-5 transition-colors hover:border-slate-300',
              stat.href && 'cursor-pointer',
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClasses[stat.color])}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  isPositive ? 'text-emerald-600' : 'text-red-600',
                )}
              >
                {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">{stat.title}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
          </div>
        );

        return stat.href ? (
          <Link key={stat.title} href={stat.href} className="block">
            {card}
          </Link>
        ) : (
          <div key={stat.title}>{card}</div>
        );
      })}
    </div>
  );
}
