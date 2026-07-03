'use client';

import { CalendarDays, ShoppingCart, TrendingUp } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { formatKes, SALES_BY_MONTH } from '@/components/admin/mentor/data/mentorPerformanceData';

const thisMonth = SALES_BY_MONTH[0];
const lastMonth = SALES_BY_MONTH[1];
const totalSales = SALES_BY_MONTH.reduce((sum, row) => sum + row.sales, 0);

export function MentorSalesVolumeTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Sales Volume"
        description="Blueprint purchases over time."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="This month" value={thisMonth.sales} icon={CalendarDays} tone="blue" />
        <AdminStatCard label="Last month" value={lastMonth.sales} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Total sales" value={totalSales} icon={TrendingUp} tone="purple" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Sales</th>
                <th className="px-5 py-3 font-medium text-right">Gross revenue</th>
              </tr>
            </thead>
            <tbody>
              {SALES_BY_MONTH.map((row) => (
                <tr key={row.month} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.month}</td>
                  <td className="px-5 py-4 text-slate-600">{row.sales}</td>
                  <td className="px-5 py-4 text-right text-slate-900">{formatKes(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
