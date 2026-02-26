import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../ui/card';
import { cn } from '../../ui/utils';
import type { ContentMode } from '../../../types/admin';

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

interface DashboardStatsGridProps {
  stats: StatCard[];
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        return (
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
      })}
    </div>
  );
}
