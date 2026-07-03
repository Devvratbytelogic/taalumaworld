'use client';

import { FileText, TrendingUp, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import {
  formatKes,
  MENTOR_OVERVIEW,
  REVENUE_BY_BLUEPRINT,
} from '@/components/admin/mentor/data/mentorPerformanceData';

const totalEarned = REVENUE_BY_BLUEPRINT.reduce((sum, row) => sum + row.earned, 0);

export function MentorRevenueByBlueprintTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Revenue by Blueprint"
        description="Earned and pending revenue broken down per blueprint."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="Blueprints" value={REVENUE_BY_BLUEPRINT.length} icon={FileText} tone="purple" />
        <AdminStatCard label="Total earned" value={formatKes(totalEarned)} icon={TrendingUp} tone="green" />
        <AdminStatCard
          label="Total pending"
          value={formatKes(MENTOR_OVERVIEW.revenuePending)}
          icon={Wallet}
          tone="orange"
        />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Blueprint</th>
                <th className="px-5 py-3 font-medium">Sales</th>
                <th className="px-5 py-3 font-medium">Earned</th>
                <th className="px-5 py-3 font-medium text-right">Pending</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_BY_BLUEPRINT.map((row) => (
                <tr key={row.title} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.title}</td>
                  <td className="px-5 py-4 text-slate-600">{row.sales}</td>
                  <td className="px-5 py-4 text-slate-900">{formatKes(row.earned)}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{formatKes(row.pending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
