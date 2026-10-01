import { Progress } from '@heroui/react';
import {
  AdminPanel,
  AdminSectionHeader,
  AdminTextLink,
} from '@/components/admin/layout/AdminContent';
import { getAdminSectionRoutePath } from '@/routes/routes';

export interface TopContentItem {
  id: string;
  title: string;
  sales: number;
}

interface DashboardTopContentProps {
  items: TopContentItem[];
  isLoading?: boolean;
}

export function DashboardTopContent({ items, isLoading }: DashboardTopContentProps) {
  const maxSales = items.length > 0 ? Math.max(...items.map((i) => i.sales), 1) : 1;
  const listHref = getAdminSectionRoutePath('chapters');

  return (
    <AdminPanel>
      <AdminSectionHeader
        title="Top blueprints"
        action={<AdminTextLink href={listHref}>View all</AdminTextLink>}
      />

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2 rounded-lg px-2 py-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-1.5 rounded bg-slate-100" />
              </div>
            ))
          : items.length === 0
            ? <p className="py-8 text-center text-sm text-slate-500">No content available</p>
            : items.map((item, index) => (
                <div key={item.id} className="space-y-2 rounded-lg px-2 py-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.sales.toLocaleString()} sales</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={(item.sales / maxSales) * 100} className="h-1.5" />
                </div>
              ))}
      </div>
    </AdminPanel>
  );
}
