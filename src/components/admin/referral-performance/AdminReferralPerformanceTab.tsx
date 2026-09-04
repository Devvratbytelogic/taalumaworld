'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { Percent, ShoppingBag, TrendingUp, Users, UserPlus, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { formatKes } from '@/constants/common';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import { useGetReferralPerformanceQuery } from '@/store/rtkQueries/dashboard';
import type { IReferralPerformanceEntity, ReferralPerformanceUserType } from '@/types/dashboard';
import { AdminReferralPerformanceSearch } from './AdminReferralPerformanceSearch';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
};

export function AdminReferralPerformanceTab() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [userType, setUserType] = useState<ReferralPerformanceUserType>('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data, isLoading, isFetching } = useGetReferralPerformanceQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    user_type: userType,
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  });

  const summary = data?.data?.summary;
  const rows = data?.data?.data?.data ?? [];
  const total = data?.data?.data?.total ?? 0;
  const loading = isLoading || isFetching;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const columns: GridColDef<IReferralPerformanceEntity>[] = [
    {
      field: 'rank',
      headerName: '#',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-medium text-slate-600">{params.row.rank}</span>
      ),
    },
    {
      field: 'name',
      headerName: 'Referrer',
      minWidth: 240,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const content = (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{params.row.name}</p>
            <p className="truncate text-xs text-slate-500">{params.row.email}</p>
          </div>
        );
        if (params.row.user_type === 'mentor') {
          return (
            <Link href={getAdminMentorDetailRoutePath(params.row.id)} className="min-w-0">
              {content}
            </Link>
          );
        }
        return content;
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{params.row.role ?? '—'}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status}
        </Badge>
      ),
    },
    {
      field: 'registrations',
      headerName: 'Registrations',
      width: 140,
      sortable: false,
      renderCell: (params) => (params.row.registrations ?? 0).toLocaleString(),
    },
    {
      field: 'conversions',
      headerName: 'Conversions',
      width: 130,
      sortable: false,
      renderCell: (params) => (params.row.conversions ?? 0).toLocaleString(),
    },
    {
      field: 'conversion_rate',
      headerName: 'Conv. rate',
      width: 120,
      sortable: false,
      renderCell: (params) => `${params.row.conversion_rate ?? 0}%`,
    },
    {
      field: 'attributed_revenue',
      headerName: 'Attributed revenue',
      width: 170,
      sortable: false,
      renderCell: (params) => formatKes(params.row.attributed_revenue ?? 0),
    },
    {
      field: 'commission',
      headerName: 'Commission',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.commission ?? 0),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Referral Performance"
        description="Registrations, conversions, and commission across referrers."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Referrers" value={(summary?.referrers ?? 0).toLocaleString()} icon={Users} tone="blue" />
        <AdminStatCard label="Registrations" value={(summary?.registrations ?? 0).toLocaleString()} icon={UserPlus} tone="green" />
        <AdminStatCard label="Conversions" value={(summary?.conversions ?? 0).toLocaleString()} icon={ShoppingBag} tone="purple" />
        <AdminStatCard label="Conversion rate" value={`${summary?.conversion_rate ?? 0}%`} icon={Percent} tone="orange" />
        <AdminStatCard label="Attributed revenue" value={formatKes(summary?.attributed_revenue ?? 0)} icon={TrendingUp} tone="slate" />
        <AdminStatCard label="Commission" value={formatKes(summary?.commission ?? 0)} icon={Wallet} tone="green" />
      </div>

      <AdminReferralPerformanceSearch
        fromDate={fromDate}
        onFromDateChange={(value) => {
          setFromDate(value);
          resetToFirstPage();
        }}
        toDate={toDate}
        onToDateChange={(value) => {
          setToDate(value);
          resetToFirstPage();
        }}
        userType={userType}
        onUserTypeChange={(value) => {
          setUserType(value);
          resetToFirstPage();
        }}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
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
