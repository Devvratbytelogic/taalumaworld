'use client';

import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { ArrowLeft, RotateCcw, Tag, X } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import {
  AdminEmptyState,
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSearchInput,
  AdminSearchPanel,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminUserDetailSkeleton } from '@/components/skeleton-loader/admin';
import { COUPON_SCOPE_LABELS, COUPON_TYPE_LABELS } from '@/constants/coupon';
import { formatKes } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminSectionRoutePath, getAdminUserDetailRoutePath, getViewOrderRoutePath } from '@/routes/routes';
import { useGetCouponRedemptionsQuery } from '@/store/rtkQueries/couponApis';
import type { ICouponRedemption, ICouponRedemptionCoupon } from '@/types/coupon';

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

const EMPTY_FILTERS = {
  search: '',
  from: '',
  to: '',
};

function isNotFoundError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'status' in error && (error as { status?: number }).status === 404);
}

function formatCouponValue(coupon: Pick<ICouponRedemptionCoupon, 'coupon_type' | 'value'>) {
  if (coupon.coupon_type === 'Free') return 'Free';
  if (coupon.coupon_type === 'Percentage') return `${coupon.value}%`;
  return formatKes(coupon.value ?? 0);
}

export function CouponRedemptionsView({ couponId }: { couponId: string }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const debouncedSearch = useDebounce(filters.search, 400);
  const today = new Date().toLocaleDateString('en-CA');
  const fromDate = filters.from && filters.from <= today ? filters.from : '';
  const toDate = filters.to && filters.to <= today && (!fromDate || filters.to >= fromDate) ? filters.to : '';

  const update = (patch: Partial<typeof EMPTY_FILTERS>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCouponRedemptionsQuery(
    {
      id: couponId,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(fromDate ? { from: fromDate } : {}),
      ...(toDate ? { to: toDate } : {}),
    },
    { skip: !couponId },
  );

  const payload = data?.data;
  const coupon = payload?.coupon;
  const rows = payload?.data ?? [];
  const total = payload?.total ?? 0;
  const hasFilters = Boolean(filters.search || filters.from || filters.to);

  const backLink = (
    <Link
      href={getAdminSectionRoutePath('coupons')}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to coupons
    </Link>
  );

  const columns: GridColDef<ICouponRedemption>[] = [
    {
      field: 'order_number',
      headerName: 'Order',
      minWidth: 160,
      flex: 0.7,
      sortable: false,
      renderCell: ({ row }) => (
        <Link href={getViewOrderRoutePath(row.id)} className="text-sm font-medium text-slate-900 hover:text-primary hover:underline">
          {row.order_number || '—'}
        </Link>
      ),
    },
    {
      field: 'user',
      headerName: 'Customer',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        if (!row.user) return <span className="text-sm text-slate-400">—</span>;
        return (
          <Link href={getAdminUserDetailRoutePath(row.user.id)} className="group min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 group-hover:text-primary group-hover:underline">{row.user.name || '—'}</p>
            <p className="truncate text-xs text-slate-500">{row.user.email}</p>
          </Link>
        );
      },
    },
    {
      field: 'redeemed_at',
      headerName: 'Redeemed',
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {row.redeemed_at ? moment(row.redeemed_at).format('MMM D, YYYY, h:mm A') : '—'}
        </span>
      ),
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => <span className="text-sm font-medium text-slate-900">{formatKes(row.discount ?? 0)}</span>,
    },
    {
      field: 'order_total',
      headerName: 'Order total',
      width: 140,
      sortable: false,
      renderCell: ({ row }) => <span className="text-sm text-slate-700">{formatKes(row.order_total ?? 0)}</span>,
    },
  ];

  if (isLoading) return <AdminUserDetailSkeleton />;

  if (isNotFoundError(error) || (data && !coupon)) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel>
          <AdminEmptyState
            icon={Tag}
            title="Coupon not found"
            description="This coupon may have been removed, or the link is invalid."
            action={
              <Link
                href={getAdminSectionRoutePath('coupons')}
                className="global_btn rounded_full bg_primary inline-flex items-center justify-center"
              >
                Back to coupons
              </Link>
            }
          />
        </AdminPanel>
      </AdminPage>
    );
  }

  if (isError || !coupon) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel>
          <AdminEmptyState
            icon={Tag}
            title="Couldn't load redemptions"
            description="The redemption list didn't load. Try again — this is usually a temporary session issue."
            action={
              <Button
                className="global_btn rounded_full bg_primary"
                onPress={() => void refetch()}
                isLoading={isFetching}
                startContent={<RotateCcw className="h-4 w-4" />}
              >
                Try again
              </Button>
            }
          />
        </AdminPanel>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      {backLink}
      <AdminPageHeader
        eyebrow="Coupons"
        title={coupon.coupon_code}
        description="Paid orders that used this coupon. Newest redemption first."
      />

      <AdminPanel className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{coupon.coupon_code}</h2>
            <p className="text-sm text-slate-500">
              {COUPON_TYPE_LABELS[coupon.coupon_type as keyof typeof COUPON_TYPE_LABELS] ?? coupon.coupon_type}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Scope</dt>
            <dd className="mt-1">
              <Badge variant="outline" className={SCOPE_BADGE_CLASS[coupon.coupon_for] ?? 'border-slate-200 text-slate-600'}>
                {COUPON_SCOPE_LABELS[coupon.coupon_for as keyof typeof COUPON_SCOPE_LABELS] ?? coupon.coupon_for}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Value</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{formatCouponValue(coupon)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
            <dd className="mt-1">
              <Badge variant="outline" className={STATUS_BADGE_CLASS[coupon.status] ?? 'border-slate-200 text-slate-600'}>
                {coupon.status}
              </Badge>
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          Redemptions
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold text-white">
            {total.toLocaleString()}
          </span>
        </h2>
        <AdminSearchPanel>
          <div className="flex flex-wrap items-center gap-2">
            <AdminSearchInput
              className="w-80 max-w-full flex-none"
              inputClassName="h-9"
              value={filters.search}
              onChange={(search) => update({ search })}
              placeholder="Search name, email, or order…"
            />
            <Input
              aria-label="From"
              type="date"
              value={filters.from}
              max={filters.to && filters.to < today ? filters.to : today}
              onChange={(event) => update({ from: event.target.value })}
              className="h-9 w-40"
            />
            <Input
              aria-label="To"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              max={today}
              onChange={(event) => update({ to: event.target.value })}
              className="h-9 w-40"
            />
            {hasFilters ? (
              <button
                type="button"
                onClick={() => update(EMPTY_FILTERS)}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-200! px-3 text-sm text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>
        </AdminSearchPanel>

        <AdminTableShell>
          <CommonDataTable
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={isFetching}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </AdminTableShell>
      </div>
    </AdminPage>
  );
}
