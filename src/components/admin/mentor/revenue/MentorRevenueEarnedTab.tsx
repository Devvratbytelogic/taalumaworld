'use client';

import { CalendarDays, TrendingUp, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import {
  formatKes,
  MENTOR_OVERVIEW,
  REVENUE_BY_MONTH,
} from '@/components/admin/mentor/data/mentorPerformanceData';

const thisMonth = REVENUE_BY_MONTH[0];
const totalPlatformShare = REVENUE_BY_MONTH.reduce((sum, row) => sum + row.platformShare, 0);

export function MentorRevenueEarnedTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Revenue Earned"
        description="Total earnings from blueprint sales after platform share."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Total earned"
          value={formatKes(MENTOR_OVERVIEW.revenueEarned)}
          icon={TrendingUp}
          tone="green"
        />
        <AdminStatCard
          label="This month"
          value={formatKes(thisMonth.earned)}
          icon={CalendarDays}
          tone="blue"
        />
        <AdminStatCard
          label="Platform share (total)"
          value={formatKes(totalPlatformShare)}
          icon={Wallet}
          tone="slate"
        />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Gross</th>
                <th className="px-5 py-3 font-medium">Platform share</th>
                <th className="px-5 py-3 font-medium text-right">Your share</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_BY_MONTH.map((row) => (
                <tr key={row.month} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.month}</td>
                  <td className="px-5 py-4 text-slate-600">{formatKes(row.gross)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatKes(row.platformShare)}</td>
                  <td className="px-5 py-4 text-right font-medium text-slate-900">{formatKes(row.earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
