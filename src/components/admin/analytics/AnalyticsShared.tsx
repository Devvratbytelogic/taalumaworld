'use client';

import { useState, type ReactNode } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { AdminPanel, AdminSectionHeader, AdminTableShell } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import type { AnalyticsInterval } from '@/types/commercialAnalytics';
import { intervalLabel } from './analyticsUtils';

export const analyticsTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 12,
};

export const ANALYTICS_CHART_COLORS = {
  primary: '#0284c7',
  green: '#059669',
  purple: '#7c3aed',
  orange: '#d97706',
  slate: '#64748b',
};

export function AnalyticsBlock({
  title,
  interval,
  action,
  children,
}: {
  title: string;
  interval?: AnalyticsInterval | null;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AdminPanel>
      <AdminSectionHeader
        title={title}
        badge={
          interval ? (
            <Badge variant="outline" className="border-slate-200 text-xs font-medium text-slate-600">
              {intervalLabel(interval)} buckets
            </Badge>
          ) : null
        }
        action={action}
      />
      {children}
    </AdminPanel>
  );
}

export function AnalyticsSummary({ items }: { items: { label: string; value: string }[] }) {
  const cols =
    items.length >= 5
      ? 'md:grid-cols-3 xl:grid-cols-5'
      : items.length === 4
        ? 'md:grid-cols-4'
        : items.length === 3
          ? 'md:grid-cols-3'
          : 'md:grid-cols-2';
  return (
    <div className={cn('mb-5 grid grid-cols-2 gap-3', cols)}>
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs text-slate-500">{item.label}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChartSkeleton() {
  return <div className="h-64 animate-pulse rounded-lg bg-slate-100" />;
}

export function AnalyticsEmpty({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-slate-500">{message}</p>;
}

export function AnalyticsStatusBadge({ value }: { value?: string | null }) {
  if (!value) return <span className="text-slate-400">—</span>;
  const key = value.toLowerCase();
  const tone =
    key === 'active' || key === 'published' || key === 'approved'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200!'
      : key === 'suspended' || key === 'rejected' || key === 'inactive'
        ? 'bg-red-50 text-red-700 border-red-200!'
        : key === 'pending' || key === 'draft'
          ? 'bg-amber-50 text-amber-700 border-amber-200!'
          : 'border-slate-200 text-slate-600';
  return (
    <Badge variant="outline" className={tone}>
      {value}
    </Badge>
  );
}

export function AnalyticsDataTable({
  rows,
  columns,
  getRowId,
  loading,
  pageSize = 10,
}: {
  rows: unknown[];
  columns: GridColDef[];
  getRowId: (row: any) => string;
  loading: boolean;
  pageSize?: number;
}) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize });
  return (
    <AdminTableShell>
      <CommonDataTable
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        paginationMode="client"
        rowCount={rows.length}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        hideFooter={rows.length <= paginationModel.pageSize}
        pageSizeOptions={[10, 25, 50]}
      />
    </AdminTableShell>
  );
}
