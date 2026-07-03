'use client';

import { Link2, MousePointerClick, TrendingUp, Users } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { formatKes, REFERRAL_LINKS } from '@/components/admin/mentor/data/mentorPerformanceData';

const totalClicks = REFERRAL_LINKS.reduce((s, r) => s + r.clicks, 0);
const totalConversions = REFERRAL_LINKS.reduce((s, r) => s + r.conversions, 0);
const totalRevenue = REFERRAL_LINKS.reduce((s, r) => s + r.revenue, 0);

export function MentorReferralsTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Growth"
        title="Referral Link Performance"
        description="Clicks, registrations, and conversions from your mentor and blueprint referral links."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total clicks" value={totalClicks} icon={MousePointerClick} tone="blue" />
        <AdminStatCard label="Registrations" value={REFERRAL_LINKS.reduce((s, r) => s + r.registrations, 0)} icon={Users} tone="green" />
        <AdminStatCard label="Conversions" value={totalConversions} icon={TrendingUp} tone="purple" />
        <AdminStatCard label="Attributed revenue" value={formatKes(totalRevenue)} icon={Link2} tone="orange" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Link</th>
                <th className="px-5 py-3 font-medium">Clicks</th>
                <th className="px-5 py-3 font-medium">Registrations</th>
                <th className="px-5 py-3 font-medium">Conversions</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {REFERRAL_LINKS.map((row) => (
                <tr key={row.label} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.label}</td>
                  <td className="px-5 py-4 text-slate-600">{row.clicks}</td>
                  <td className="px-5 py-4 text-slate-600">{row.registrations}</td>
                  <td className="px-5 py-4 text-slate-600">{row.conversions}</td>
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
