'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { FileText, TrendingUp, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { formatKes } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetBlueprintRevenueQuery } from '@/store/rtkQueries/dashboard';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Blueprint', flex: 1, minWidth: 200, sortable: false },
  { field: 'status', headerName: 'Status', width: 130, sortable: false },
  { field: 'sales', headerName: 'Sales', width: 90, sortable: false },
  {
    field: 'earned',
    headerName: 'Earned',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'pending',
    headerName: 'Pending',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
];

export function MentorRevenueByBlueprintTab() {
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetBlueprintRevenueQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const blueprints = listData?.data ?? [];
  const total = listData?.total ?? 0;
  const loading = isLoading || isFetching;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Revenue by Blueprint"
        description="Earned and pending revenue broken down per blueprint."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Blueprints" value={summary?.blueprints ?? 0} icon={FileText} tone="purple" />
        <AdminStatCard label="Total sales" value={summary?.totalSales ?? 0} icon={TrendingUp} tone="blue" />
        <AdminStatCard label="Total earned" value={formatKes(summary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
        <AdminStatCard label="Total pending" value={formatKes(summary?.totalPending ?? 0)} icon={Wallet} tone="orange" />
      </div>

      <AdminSearchPanel>
        <AdminSearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by blueprint title…"
        />
      </AdminSearchPanel>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={blueprints}
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
