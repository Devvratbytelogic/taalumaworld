'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { BadgeCheck, Banknote, GraduationCap, ShoppingCart, Sparkles, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatKes } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import { useGetMentorPerformanceQuery } from '@/store/rtkQueries/dashboard';
import { useGetAllMentorTiersQuery } from '@/store/rtkQueries/mentorApis';
import type { IMentorPerformanceEntity } from '@/types/dashboard';
import { AdminMentorPerformanceSearch } from './AdminMentorPerformanceSearch';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

function formatAiScore(value?: number | null): string {
  if (value == null) return '—';
  return Number(value).toFixed(2);
}

export function AdminMentorPerformanceTab() {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [tierId, setTierId] = useState('');
  const [verified, setVerified] = useState('');
  const [hasSales, setHasSales] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 500);

  const { data: tiersResponse } = useGetAllMentorTiersQuery({ status: 'active', limit: 100 });
  const tiers = tiersResponse?.data?.data ?? [];

  const { data, isLoading, isFetching } = useGetMentorPerformanceQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
    ...(status ? { status } : {}),
    ...(tierId ? { tier_id: tierId } : {}),
    ...(verified ? { verified } : {}),
    ...(hasSales ? { hasSales: hasSales === 'true' } : {}),
  });

  const summary = data?.data?.summary;
  const mentors = data?.data?.data?.data ?? [];
  const total = data?.data?.data?.total ?? 0;
  const loading = isLoading || isFetching;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const columns: GridColDef<IMentorPerformanceEntity>[] = [
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
      headerName: 'Mentor',
      minWidth: 240,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Link href={getAdminMentorDetailRoutePath(params.row.id)} className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0 border">
            <AvatarImage src={params.row.profile_pic ?? ''} alt={params.row.name} />
            <AvatarFallback>{params.row.name?.substring(0, 2).toUpperCase() || '—'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{params.row.name}</p>
            <p className="truncate text-xs text-slate-500">{params.row.email}</p>
          </div>
        </Link>
      ),
    },
    {
      field: 'tier',
      headerName: 'Tier',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline">{params.row.tier?.code ?? '—'}</Badge>
      ),
    },
    {
      field: 'is_verified_mentor',
      headerName: 'Verified',
      width: 130,
      sortable: false,
      renderCell: (params) =>
        params.row.is_verified_mentor ? (
          <Badge variant="outline" className="gap-1 border-blue-200! bg-blue-50 text-blue-700">
            <BadgeCheck className="h-3 w-3" /> Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="border-slate-200! bg-slate-100 text-slate-600">
            Unverified
          </Badge>
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
      field: 'sales',
      headerName: 'Sales',
      width: 90,
      sortable: false,
      renderCell: (params) => (params.row.sales ?? 0).toLocaleString(),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.revenue ?? 0),
    },
    {
      field: 'mentorShare',
      headerName: 'Mentor share',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.mentorShare ?? 0),
    },
    {
      field: 'platformShare',
      headerName: 'Platform share',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.platformShare ?? 0),
    },
    {
      field: 'avgAiScore',
      headerName: 'AI score',
      width: 100,
      sortable: false,
      renderCell: (params) => formatAiScore(params.row.avgAiScore),
    },
    {
      field: 'blueprintCount',
      headerName: 'Blueprints',
      width: 110,
      sortable: false,
      renderCell: (params) => `${params.row.scoredBlueprintCount ?? 0} / ${params.row.blueprintCount ?? 0}`,
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Performance"
        description="Sales, revenue share, and AI quality scores across mentors."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Mentors" value={(summary?.mentors ?? 0).toLocaleString()} icon={GraduationCap} tone="blue" />
        <AdminStatCard label="Total sales" value={(summary?.totalSales ?? 0).toLocaleString()} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Total revenue" value={formatKes(summary?.totalRevenue ?? 0)} icon={Wallet} tone="purple" />
        <AdminStatCard label="Platform share" value={formatKes(summary?.totalPlatformShare ?? 0)} icon={Banknote} tone="orange" />
        <AdminStatCard label="Mentor share" value={formatKes(summary?.totalMentorShare ?? 0)} icon={Wallet} tone="slate" />
        <AdminStatCard label="Avg. AI score" value={formatAiScore(summary?.avgAiScore)} icon={Sparkles} tone="blue" />
        <AdminStatCard label="Gross" value={formatKes(summary?.totalGross ?? 0)} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Discount" value={formatKes(summary?.totalDiscount ?? 0)} icon={Wallet} tone="orange" />
      </div>

      <AdminMentorPerformanceSearch
        searchQuery={search}
        onSearchChange={handleSearchChange}
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
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          resetToFirstPage();
        }}
        tierId={tierId}
        onTierIdChange={(value) => {
          setTierId(value);
          resetToFirstPage();
        }}
        verified={verified}
        onVerifiedChange={(value) => {
          setVerified(value);
          resetToFirstPage();
        }}
        hasSales={hasSales}
        onHasSalesChange={(value) => {
          setHasSales(value);
          resetToFirstPage();
        }}
        tiers={tiers}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={mentors}
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
