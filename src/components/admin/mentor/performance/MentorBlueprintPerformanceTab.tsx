'use client';

import { Eye, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { BLUEPRINT_PERFORMANCE } from '@/components/admin/mentor/data/mentorPerformanceData';

const totalViews = BLUEPRINT_PERFORMANCE.reduce((sum, row) => sum + row.views, 0);
const totalSales = BLUEPRINT_PERFORMANCE.reduce((sum, row) => sum + row.sales, 0);
const avgConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0';
const highValueCount = BLUEPRINT_PERFORMANCE.filter((b) => b.classification === 'High Value').length;

export function MentorBlueprintPerformanceTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Blueprint Performance"
        description="Views, sales, conversion, and AI quality scores across your blueprints."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total views" value={totalViews.toLocaleString()} icon={Eye} tone="blue" />
        <AdminStatCard label="Total sales" value={totalSales} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Avg. conversion" value={`${avgConversion}%`} icon={TrendingUp} tone="purple" />
        <AdminStatCard label="High Value blueprints" value={highValueCount} icon={Sparkles} tone="orange" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Blueprint</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium">Sales</th>
                <th className="px-5 py-3 font-medium">Conversion</th>
                <th className="px-5 py-3 font-medium">AI score</th>
                <th className="px-5 py-3 font-medium text-right">Classification</th>
              </tr>
            </thead>
            <tbody>
              {BLUEPRINT_PERFORMANCE.map((row) => (
                <tr key={row.title} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.title}</td>
                  <td className="px-5 py-4 text-slate-600">{row.status}</td>
                  <td className="px-5 py-4 text-slate-600">{row.views.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-600">{row.sales}</td>
                  <td className="px-5 py-4 text-slate-600">{row.conversion}%</td>
                  <td className="px-5 py-4 text-slate-900">{row.aiScore}</td>
                  <td className="px-5 py-4 text-right text-slate-900">{row.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
