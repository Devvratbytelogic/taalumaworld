'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Percent, ShoppingBag, Tag, TicketPercent, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { COUPON_SCOPE_LABELS, COUPON_TYPE_LABELS } from '@/constants/coupon';
import { formatKes } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetCouponPerformanceQuery } from '@/store/rtkQueries/couponApis';
import type { ICouponPerformanceEntity } from '@/types/coupon';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200!',
};

const SCOPE_BADGE_CLASS: Record<string, string> = {
  university: 'bg-sky-50 text-sky-700 border-sky-200!',
  event: 'bg-violet-50 text-violet-700 border-violet-200!',
  campaign: 'bg-amber-50 text-amber-700 border-amber-200!',
  normal: 'bg-slate-100 text-slate-600 border-slate-200!',
};

function formatCouponValue(coupon: ICouponPerformanceEntity): string {
  if (coupon.coupon_type === 'Free') return 'Free';
  if (coupon.coupon_type === 'Percentage') return `${coupon.value}%`;
  return formatKes(coupon.value ?? 0);
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function MentorCouponPerformanceTab() {
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetCouponPerformanceQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const summary = data?.data?.summary;
  const coupons = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const loading = isLoading || isFetching;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const columns: GridColDef<ICouponPerformanceEntity>[] = [
    {
      field: 'coupon_code',
      headerName: 'Coupon',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.coupon_code}</p>
            <p className="text-xs text-slate-500">
              {COUPON_TYPE_LABELS[params.row.coupon_type as keyof typeof COUPON_TYPE_LABELS] ?? params.row.coupon_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      field: 'coupon_for',
      headerName: 'Scope',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={SCOPE_BADGE_CLASS[params.row.coupon_for] ?? 'border-slate-200 text-slate-600'}>
          {COUPON_SCOPE_LABELS[params.row.coupon_for as keyof typeof COUPON_SCOPE_LABELS] ?? params.row.coupon_for}
        </Badge>
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-medium text-slate-900">{formatCouponValue(params.row)}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status}
        </Badge>
      ),
    },
    {
      field: 'redeemed_count',
      headerName: 'Usage',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-600">
          {params.row.redeemed_count ?? 0}
          {params.row.usage_limit ? ` / ${params.row.usage_limit}` : ''}
        </span>
      ),
    },
    {
      field: 'orders_count',
      headerName: 'Orders',
      width: 100,
      sortable: false,
      renderCell: (params) => (params.row.orders_count ?? 0).toLocaleString(),
    },
    {
      field: 'total_discount_given',
      headerName: 'Discount given',
      width: 150,
      sortable: false,
      renderCell: (params) => formatKes(params.row.total_discount_given ?? 0),
    },
    {
      field: 'total_revenue',
      headerName: 'Revenue',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.total_revenue ?? 0),
    },
    {
      field: 'last_used_at',
      headerName: 'Last used',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">{formatDate(params.row.last_used_at)}</span>
      ),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Coupon Performance"
        description="Redemptions, discounts, and revenue from your coupons."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total coupons" value={(summary?.total_coupons ?? 0).toLocaleString()} icon={TicketPercent} tone="blue" />
        <AdminStatCard label="Total redemptions" value={(summary?.total_redemptions ?? 0).toLocaleString()} icon={ShoppingBag} tone="green" />
        <AdminStatCard label="Discount given" value={formatKes(summary?.total_discount_given ?? 0)} icon={Percent} tone="purple" />
        <AdminStatCard label="Total revenue" value={formatKes(summary?.total_revenue ?? 0)} icon={Wallet} tone="orange" />
      </div>

      <AdminSearchPanel>
        <AdminSearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by coupon code…"
        />
      </AdminSearchPanel>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={coupons}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </AdminPage>
  );
}
