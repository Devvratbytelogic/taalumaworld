'use client';

import { Download, FileText } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import { formatKes, STATEMENTS } from '@/components/admin/mentor/data/mentorPerformanceData';
import toast from '@/utils/toast';

export function MentorStatementsTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Downloadable Statements"
        description="Monthly statements with gross sales, discounts, refunds, commission, net earnings, and balance."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminStatCard label="Available statements" value={STATEMENTS.length} icon={FileText} tone="blue" />
        <AdminStatCard label="Latest statement" value={STATEMENTS[0]?.month ?? '—'} icon={Download} tone="green" />
      </div>

      <div className="space-y-4">
        {STATEMENTS.map((row) => (
          <AdminPanel key={row.month}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{row.month}</p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div><dt className="text-slate-500">Gross sales</dt><dd className="font-medium">{formatKes(row.grossSales)}</dd></div>
                  <div><dt className="text-slate-500">Discounts</dt><dd className="font-medium">{formatKes(row.discounts)}</dd></div>
                  <div><dt className="text-slate-500">Refunds</dt><dd className="font-medium">{formatKes(row.refunds)}</dd></div>
                  <div><dt className="text-slate-500">Platform commission</dt><dd className="font-medium">{formatKes(row.platformCommission)}</dd></div>
                  <div><dt className="text-slate-500">Net earnings</dt><dd className="font-medium text-emerald-700">{formatKes(row.netEarnings)}</dd></div>
                  <div><dt className="text-slate-500">Payouts processed</dt><dd className="font-medium">{formatKes(row.payoutsProcessed)}</dd></div>
                  <div><dt className="text-slate-500">Outstanding balance</dt><dd className="font-medium">{formatKes(row.outstandingBalance)}</dd></div>
                  <div><dt className="text-slate-500">Sales count</dt><dd className="font-medium">{row.sales}</dd></div>
                </dl>
              </div>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary shrink-0"
                startContent={<Download className="h-4 w-4" />}
                onPress={() => toast.info(`Downloading ${row.fileName}… (API connection pending)`)}
              >
                Download PDF
              </Button>
            </div>
          </AdminPanel>
        ))}
      </div>
    </AdminPage>
  );
}
