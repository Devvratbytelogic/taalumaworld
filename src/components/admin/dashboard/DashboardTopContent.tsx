import { ArrowUpRight } from 'lucide-react';
import { Progress } from '@heroui/react';
import Button from '../../ui/Button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { ContentMode } from '../../../types/admin';

export interface TopContentItem {
  id: number;
  title: string;
  sales: number;
  revenue: number;
  trend: number;
}

interface DashboardTopContentProps {
  items: TopContentItem[];
  contentMode: ContentMode;
}

export function DashboardTopContent({ items, contentMode }: DashboardTopContentProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Top {contentMode === 'chapters' ? 'Focus Areas' : 'Books'}
        </h3>
        <Button className="global_btn rounded_full outline_primary">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sales} sales · ${item.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant={item.trend >= 0 ? 'default' : 'destructive'} className="ml-2">
                {item.trend >= 0 ? '+' : ''}{item.trend}%
              </Badge>
            </div>
            <Progress value={(item.sales / 250) * 100} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
