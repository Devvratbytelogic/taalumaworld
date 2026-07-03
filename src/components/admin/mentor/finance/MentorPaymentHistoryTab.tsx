'use client';

import { CheckCircle2, History, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { formatKes, PAYMENT_HISTORY } from '@/components/admin/mentor/data/mentorPerformanceData';

const paidTotal = PAYMENT_HISTORY.filter((row) => row.status === 'Paid').reduce(
  (sum, row) => sum + row.amount,
  0,
);
const paidCount = PAYMENT_HISTORY.filter((row) => row.status === 'Paid').length;

export function MentorPaymentHistoryTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Payment History"
        description="Monthly payouts and disbursement status."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="Total paid out" value={formatKes(paidTotal)} icon={Wallet} tone="green" />
        <AdminStatCard label="Completed payouts" value={paidCount} icon={CheckCircle2} tone="blue" />
        <AdminStatCard label="Records" value={PAYMENT_HISTORY.length} icon={History} tone="slate" />
      </div>

      <AdminTableShell>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((row) => (
                <tr key={`${row.date}-${row.reference}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-slate-900">{row.date}</td>
                  <td className="px-5 py-4 text-slate-600">{row.reference}</td>
                  <td className="px-5 py-4 text-slate-600">{row.method}</td>
                  <td className="px-5 py-4 text-slate-900">
                    {row.amount > 0 ? formatKes(row.amount) : '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={
                        row.status === 'Paid'
                          ? 'rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700'
                          : 'rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPage>
  );
}
