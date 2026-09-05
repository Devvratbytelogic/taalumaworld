'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { BadgeCheck, Banknote, Download, GraduationCap, ShoppingCart, Sparkles, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { formatKes } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import { useGetMentorRevenueQuery } from '@/store/rtkQueries/dashboard';
import { useGetAllMentorTiersQuery } from '@/store/rtkQueries/mentorApis';
import type { IMentorRevenueEntity } from '@/types/dashboard';
import { API_BASE_URL } from '@/utils/config';
import { authFetch } from '@/utils/refreshSession';
import toast from '@/utils/toast';
import { AdminMentorRevenueSearch } from './AdminMentorRevenueSearch';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

function formatAiScore(value?: number | null): string {
  if (value == null) return '—';
  return Number(value).toFixed(2);
}

export function AdminMentorRevenueTab() {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [tierId, setTierId] = useState('');
  const [verified, setVerified] = useState('');
  const [hasRevenue, setHasRevenue] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isExporting, setIsExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data: tiersResponse } = useGetAllMentorTiersQuery({ status: 'active', limit: 100 });
  const tiers = tiersResponse?.data?.data ?? [];

  const listParams = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
    ...(status ? { status } : {}),
    ...(tierId ? { tier_id: tierId } : {}),
    ...(verified ? { verified } : {}),
    ...(hasRevenue ? { hasRevenue: hasRevenue === 'true' } : {}),
  };

  const { data, isLoading, isFetching } = useGetMentorRevenueQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...listParams,
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

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(listParams).forEach(([key, value]) => {
        if (value === undefined || value === '') return;
        params.set(key, String(value));
      });
      params.set('export', 'csv');

      const res = await authFetch(`${API_BASE_URL}/admin/mentors/revenue?${params.toString()}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Failed to export mentor revenue');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mentor-revenue.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Mentor revenue exported');
    } catch {
      toast.error('Failed to export mentor revenue');
    } finally {
      setIsExporting(false);
    }
  };

  const columns: GridColDef<IMentorRevenueEntity>[] = [
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
      field: 'gross',
      headerName: 'Gross',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.gross ?? 0),
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 130,
      sortable: false,
      renderCell: (params) => formatKes(params.row.discount ?? 0),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.revenue ?? 0),
    },
    {
      field: 'net',
      headerName: 'Net',
      width: 140,
      sortable: false,
      renderCell: (params) => formatKes(params.row.net ?? 0),
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
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Revenue"
        description="Gross, discounts, and revenue share across mentors."
      >
        <Button
          className="global_btn rounded_full bg_primary"
          onPress={handleExportCsv}
          isLoading={isExporting}
          startContent={isExporting ? null : <Download className="h-4 w-4" />}
        >
          Export CSV
        </Button>
      </AdminPageHeader>

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

      <AdminMentorRevenueSearch
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
        hasRevenue={hasRevenue}
        onHasRevenueChange={(value) => {
          setHasRevenue(value);
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
