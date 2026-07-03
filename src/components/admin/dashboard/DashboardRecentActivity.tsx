import { Users } from 'lucide-react';
import {
  AdminPanel,
  AdminSectionHeader,
  AdminTextLink,
} from '@/components/admin/layout/AdminContent';

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  item: string;
  time: string;
}

interface DashboardRecentActivityProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

export function DashboardRecentActivity({ items, isLoading }: DashboardRecentActivityProps) {
  return (
    <AdminPanel>
      <AdminSectionHeader title="Recent activity" action={<AdminTextLink href="/admin/users">View all</AdminTextLink>} />

      <div className="space-y-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-start gap-3 rounded-lg px-2 py-3">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
            ))
          : items.length === 0
            ? <p className="py-8 text-center text-sm text-slate-500">No recent activity</p>
            : items.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">{activity.user}</span>
                      {' '}
                      <span>{activity.action}</span>
                      {activity.item ? (
                        <>
                          {' '}
                          <span className="font-medium text-slate-900">{activity.item}</span>
                        </>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
      </div>
    </AdminPanel>
  );
}
