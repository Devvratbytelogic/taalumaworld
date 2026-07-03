'use client';

import { Download, FileText } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import { formatKes, STATEMENTS } from '@/components/admin/mentor/mentorPerformanceData';
import toast from '@/utils/toast';

export function MentorStatementsTab() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Downloadable Statements"
        description="Export monthly revenue and sales reports."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminStatCard label="Available statements" value={STATEMENTS.length} icon={FileText} tone="blue" />
        <AdminStatCard
          label="Latest statement"
          value={STATEMENTS[0]?.month ?? '—'}
          icon={Download}
          tone="green"
        />
      </div>

      <div className="space-y-3">
        {STATEMENTS.map((row) => (
          <AdminPanel key={row.month}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{row.month}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {row.sales} sales · {formatKes(row.revenue)} earned
                </p>
              </div>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary gap-2"
                startContent={<Download className="h-4 w-4" />}
                onPress={() =>
                  toast.info(`Download for ${row.fileName} will be available when the API is connected.`)
                }
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
