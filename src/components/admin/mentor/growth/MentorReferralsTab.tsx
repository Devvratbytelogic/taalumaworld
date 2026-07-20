'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Percent, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminSectionHeader,
  AdminStatCard,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { formatKes } from '@/components/admin/mentor/data/mentorPerformanceData';
import { useGetMyMentorReferralsQuery } from '@/store/rtkQueries/dashboard';
import { IMentorReferralsAPIResponseDataEntity, MentorReferralStatus } from '@/types/dashboard';

const STATUS_FILTER_OPTIONS: { label: string; value: MentorReferralStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'Registered', value: 'registered' },
  { label: 'Purchased', value: 'purchased' },
  { label: 'Pending', value: 'pending' },
];

const STATUS_BADGE_CLASS: Record<MentorReferralStatus, string> = {
  registered: 'bg-sky-50 text-sky-700 border-sky-200',
  purchased: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

const getReferralStatus = (row: IMentorReferralsAPIResponseDataEntity): MentorReferralStatus => {
  if (row.isFirstPurchaseDone) return 'purchased';
  if (row.isRegistered) return 'registered';
  return 'pending';
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—';

const referralColumns: GridColDef<IMentorReferralsAPIResponseDataEntity>[] = [
  {
    field: 'user_name',
    headerName: 'Referred user',
    flex: 1,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {params.row.registered_user?.name ?? params.row.user_name ?? '—'}
        </p>
        <p className="truncate text-xs text-slate-500">{params.row.registered_user?.email ?? '—'}</p>
      </div>
    ),
  },
  {
    field: 'referral_code',
    headerName: 'Referral code',
    width: 160,
    sortable: false,
    renderCell: (params) => params.value ?? '—',
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    sortable: false,
    renderCell: (params) => {
      const status = getReferralStatus(params.row);
      return (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    field: 'commission_type',
    headerName: 'Commission rate',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <div className="min-w-0">
        <p className="text-sm text-slate-900">
          {params.row.commission_type === 'percentage'
            ? `${params.row.commission_value}%`
            : formatKes(params.row.commission_value ?? 0)}
        </p>
        <p className="truncate text-xs capitalize text-slate-500">{params.row.commission_type ?? '—'}</p>
      </div>
    ),
  },
  {
    field: 'commission_amount',
    headerName: 'Commission earned',
    width: 150,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'order',
    headerName: 'Order',
    width: 170,
    sortable: false,
    renderCell: (params) =>
      params.row.order ? (
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-900">#{params.row.order.order_number}</p>
          <p className="truncate text-xs text-slate-500">{formatKes(params.row.order.total_amount ?? 0)}</p>
        </div>
      ) : (
        '—'
      ),
  },
  {
    field: 'is_credited',
    headerName: 'Credited',
    width: 170,
    sortable: false,
    renderCell: (params) => (
      <div className="min-w-0">
        <Badge
          variant="outline"
          className={
            params.value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'border-slate-200 text-slate-600'
          }
        >
          {params.value ? 'Credited' : 'Pending'}
        </Badge>
        {params.value ? (
          <p className="mt-1 truncate text-xs text-slate-500">{formatDateTime(params.row.credited_at)}</p>
        ) : null}
      </div>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Referred on',
    width: 130,
    sortable: false,
    renderCell: (params) => formatDate(params.value),
  },
];

export function MentorReferralsTab() {
  const [statusFilter, setStatusFilter] = useState<MentorReferralStatus | ''>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data, isLoading, isFetching } = useGetMyMentorReferralsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const referrals = listData?.data ?? [];
  const totalReferrals = listData?.total ?? 0;
  const loading = isLoading || isFetching;

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as MentorReferralStatus | '');
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Growth"
        title="Referral Link Performance"
        description="Registrations and conversions from your mentor referral link."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total referrals" value={summary?.total_referrals ?? 0} icon={Users} tone="blue" />
        <AdminStatCard label="Registered" value={summary?.total_registered ?? 0} icon={UserCheck} tone="green" />
        <AdminStatCard label="Purchased" value={summary?.total_purchased ?? 0} icon={TrendingUp} tone="purple" />
        <AdminStatCard
          label="Commission earned"
          value={formatKes(summary?.total_commission_earned ?? 0)}
          icon={Wallet}
          tone="orange"
        />
        <AdminStatCard
          label="Conversion rate"
          value={`${(summary?.conversion_rate ?? 0).toFixed(1)}%`}
          icon={Percent}
          tone="slate"
        />
      </div>

      <div>
        <AdminSectionHeader
          title="My Referrals"
          action={
            <select
              className={adminSelectClass}
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <CommonDataTable
            rows={referrals}
            columns={referralColumns}
            getRowId={(row) => row._id}
            loading={loading}
            paginationMode="server"
            rowCount={totalReferrals}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>
      </div>
    </AdminPage>
  );
}
