import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../ui/card';
import { cn } from '../../ui/utils';

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

interface DashboardStatsGridProps {
  stats: StatCard[];
  isLoading?: boolean;
}

export function DashboardStatsGrid({ stats, isLoading }: DashboardStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 border-2 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-muted" />
              <div className="w-14 h-5 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 rounded bg-muted" />
              <div className="w-16 h-7 rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        const card = (
          <Card key={stat.title} className="p-6 hover-lift cursor-pointer border-2">
            <div className="flex items-start justify-between mb-4">
              <div className={cn('p-3 rounded-2xl', colorClasses[stat.color])}>
                <Icon className="h-6 w-6" />
              </div>
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        );
        return stat.href
          ? <Link key={stat.title} href={stat.href} className="block">{card}</Link>
          : card;
      })}
    </div>
  );
}
