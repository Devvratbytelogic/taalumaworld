'use client';

import { CalendarClock, Clock, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import {
  formatKes,
  MENTOR_OVERVIEW,
  PENDING_PAYOUTS,
} from '@/components/admin/mentor/data/mentorPerformanceData';

const nextPayoutDate = PENDING_PAYOUTS[0]?.payoutDate ?? '—';

export function MentorRevenuePendingTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Revenue Pending Payment"
        description="Earnings awaiting the next payout cycle."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Pending payout"
          value={formatKes(MENTOR_OVERVIEW.revenuePending)}
          icon={Wallet}
          tone="orange"
        />
        <AdminStatCard label="Next payout date" value={nextPayoutDate} icon={CalendarClock} tone="blue" />
        <AdminStatCard label="Open items" value={PENDING_PAYOUTS.length} icon={Clock} tone="purple" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Expected payout</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_PAYOUTS.map((row) => (
                <tr key={row.period} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.period}</td>
                  <td className="px-5 py-4 text-slate-600">{formatKes(row.amount)}</td>
                  <td className="px-5 py-4 text-slate-600">{row.payoutDate}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
