'use client';

import { Percent, Tag, TrendingUp } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { COUPON_PERFORMANCE, formatKes } from '@/components/admin/mentor/data/mentorPerformanceData';

const totalRedemptions = COUPON_PERFORMANCE.reduce((s, r) => s + r.redemptions, 0);
const totalGenerated = COUPON_PERFORMANCE.reduce((s, r) => s + r.revenueGenerated, 0);
const totalWaived = COUPON_PERFORMANCE.reduce((s, r) => s + r.revenueWaived, 0);

export function MentorCouponsTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Growth"
        title="Coupon & Promo Performance"
        description="Redemptions, revenue generated, and waived amounts for campaigns you opted into."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="Total redemptions" value={totalRedemptions} icon={Tag} tone="blue" />
        <AdminStatCard label="Revenue generated" value={formatKes(totalGenerated)} icon={TrendingUp} tone="green" />
        <AdminStatCard label="Revenue waived" value={formatKes(totalWaived)} icon={Percent} tone="orange" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Redemptions</th>
                <th className="px-5 py-3 font-medium">Generated</th>
                <th className="px-5 py-3 font-medium">Waived</th>
                <th className="px-5 py-3 font-medium text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {COUPON_PERFORMANCE.map((row) => (
                <tr key={row.code} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.code}</td>
                  <td className="px-5 py-4 text-slate-600">{row.type}</td>
                  <td className="px-5 py-4 text-slate-600">{row.redemptions}</td>
                  <td className="px-5 py-4 text-slate-900">{formatKes(row.revenueGenerated)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatKes(row.revenueWaived)}</td>
                  <td className="px-5 py-4 text-right text-slate-900">{row.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
