import Link from 'next/link';
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
  isLoading?: boolean;
}

export function DashboardTopContent({ items, contentMode, isLoading }: DashboardTopContentProps) {
  const maxRevenue = items.length > 0 ? Math.max(...items.map((i) => i.revenue), 1) : 1;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Top {contentMode === 'chapters' ? 'Chapters' : 'Books'}
        </h3>
        <Link href={contentMode === 'chapters' ? '/admin/chapters' : '/admin/books'}>
          <Button className="global_btn rounded_full outline_primary">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="w-2/3 h-4 rounded bg-muted" />
                    <div className="w-1/3 h-3 rounded bg-muted" />
                  </div>
                  <div className="w-12 h-5 rounded bg-muted" />
                </div>
                <div className="h-2 rounded bg-muted" />
              </div>
            ))
          : items.length === 0
            ? (
                <p className="text-sm text-muted-foreground text-center py-6">No content available</p>
              )
            : items.map((item, index) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Price: ${item.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.trend >= 0 ? 'default' : 'destructive'} className="ml-2">
                      {item.trend >= 0 ? '+' : ''}{item.trend}%
                    </Badge>
                  </div>
                  <Progress value={(item.revenue / maxRevenue) * 100} className="h-2" />
                </div>
              ))}
      </div>
    </Card>
  );
}
