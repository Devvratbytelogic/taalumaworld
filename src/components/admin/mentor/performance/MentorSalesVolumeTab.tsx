'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { CalendarDays, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
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
import { useGetSalesVolumeQuery } from '@/store/rtkQueries/dashboard';

const columns: GridColDef[] = [
  { field: 'month', headerName: 'Month', flex: 1, minWidth: 160, sortable: false },
  { field: 'sales', headerName: 'Sales', width: 120, sortable: false },
  {
    field: 'revenue',
    headerName: 'Gross revenue',
    width: 160,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
];

export function MentorSalesVolumeTab() {
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetSalesVolumeQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const rows = (listData?.data ?? []).map((row, idx) => ({ ...row, id: `${row.month}-${idx}` }));
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
        title="Sales Volume"
        description="Blueprint purchases over time."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="This month" value={summary?.thisMonth ?? 0} icon={CalendarDays} tone="blue" />
        <AdminStatCard label="Last month" value={summary?.lastMonth ?? 0} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Total sales" value={summary?.totalSales ?? 0} icon={TrendingUp} tone="purple" />
        <AdminStatCard label="Total revenue" value={formatKes(summary?.totalRevenue ?? 0)} icon={Wallet} tone="orange" />
      </div>

      <AdminSearchPanel>
        <AdminSearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by month, e.g. Jul 2026…"
        />
      </AdminSearchPanel>

      <div className="border border-gray-200 rounded-md overflow-hidden">
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
