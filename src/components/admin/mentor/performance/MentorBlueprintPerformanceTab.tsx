'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetBlueprintPerformanceQuery } from '@/store/rtkQueries/dashboard';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Blueprint', flex: 1, minWidth: 200, sortable: false },
  { field: 'status', headerName: 'Status', width: 130, sortable: false },
  {
    field: 'views',
    headerName: 'Views',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  { field: 'sales', headerName: 'Sales', width: 90, sortable: false },
  {
    field: 'conversion',
    headerName: 'Conversion',
    width: 120,
    sortable: false,
    renderCell: (params) => `${params.value ?? 0}%`,
  },
  {
    field: 'aiScore',
    headerName: 'AI score',
    width: 100,
    sortable: false,
    renderCell: (params) => params.value ?? '—',
  },
  { field: 'classification', headerName: 'Classification', width: 170, sortable: false },
];

export function MentorBlueprintPerformanceTab() {
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetBlueprintPerformanceQuery({
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
        title="Blueprint Performance"
        description="Views, sales, conversion, and AI quality scores across your blueprints."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total views" value={(summary?.totalViews ?? 0).toLocaleString()} icon={Eye} tone="blue" />
        <AdminStatCard label="Total sales" value={summary?.totalSales ?? 0} icon={ShoppingCart} tone="green" />
        <AdminStatCard label="Avg. conversion" value={`${summary?.avgConversion ?? 0}%`} icon={TrendingUp} tone="purple" />
        <AdminStatCard label="High Value blueprints" value={summary?.highValueBlueprints ?? 0} icon={Sparkles} tone="orange" />
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
