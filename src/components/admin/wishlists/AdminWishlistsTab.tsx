'use client';

import { useState } from 'react';
import moment from 'moment';
import { Download } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { AdminPage, AdminPageHeader, AdminTableShell } from '@/components/admin/layout/AdminContent';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import Button from '@/components/ui/Button';
import { AdminWishlistsSearch, type WishlistFilters } from '@/components/admin/wishlists/AdminWishlistsSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAdminWishlistsQuery } from '@/store/rtkQueries/adminWishlistsApi';
import { useGetAllAdminChaptersQuery, useGetAllBooksQuery } from '@/store/rtkQueries/adminGetApi';
import { useGetAllUsersQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IAdminWishlistsDataEntity } from '@/types/adminWishlist';
import { API_BASE_URL } from '@/utils/config';
import { authFetch } from '@/utils/refreshSession';
import toast from '@/utils/toast';

const TYPE_LABEL: Record<string, string> = {
  series: 'Series',
  blueprint: 'Book',
};

const EMPTY_FILTERS: WishlistFilters = {
  search: '',
  type: '',
  from: '',
  to: '',
  userId: '',
  seriesId: '',
  blueprintId: '',
};


export function AdminWishlistsTab({ scope = 'staff' }: { scope?: 'staff' | 'mentor' }) {
  const [filters, setFilters] = useState<WishlistFilters>(EMPTY_FILTERS);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isExporting, setIsExporting] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 400);
  const mineOnly = scope === 'mentor' ? { isMine: true } : {};

  const { data: usersResponse } = useGetAllUsersQuery({ limit: 100, user_type: 'user' });
  const { data: seriesResponse } = useGetAllBooksQuery({ limit: 100, ...mineOnly });
  const { data: blueprintsResponse } = useGetAllAdminChaptersQuery({
    limit: 100,
    ...mineOnly,
    ...(filters.seriesId ? { bookId: filters.seriesId } : {}),
  });

  const userOptions = (usersResponse?.data?.data ?? []).map((user) => ({
    value: user._id,
    label: user.name || user.email,
  }));
  const seriesOptions = (seriesResponse?.data?.data ?? []).map((series) => ({
    value: series._id || series.id,
    label: series.title,
  }));
  const blueprintOptions = (blueprintsResponse?.data?.data ?? []).map((blueprint) => ({
    value: blueprint._id || blueprint.id,
    label: blueprint.title,
  }));

  const today = new Date().toLocaleDateString('en-CA');
  const fromDate = filters.from && filters.from <= today ? filters.from : '';
  const toDate = filters.to && filters.to <= today && (!fromDate || filters.to >= fromDate) ? filters.to : '';
  const query = {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
    ...(filters.userId ? { user_id: filters.userId } : {}),
    ...(filters.seriesId ? { series_id: filters.seriesId } : {}),
    ...(filters.blueprintId ? { blueprint_id: filters.blueprintId } : {}),
  };

  const { data, isLoading, isFetching } = useGetAdminWishlistsQuery(query);
  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;

  const exportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams({ format: 'csv' });
      Object.entries(query).forEach(([key, value]) => {
        if (key !== 'page' && key !== 'limit' && value) params.set(key, String(value));
      });
      const res = await authFetch(`${API_BASE_URL}/admin/wishlists?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to export wishlists');
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wishlists.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Wishlists exported');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export wishlists');
    } finally {
      setIsExporting(false);
    }
  };

  const columns: GridColDef<IAdminWishlistsDataEntity>[] = [
    {
      field: 'saved_at',
      headerName: 'Saved',
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => moment(row.saved_at).format('MMM D, YYYY h:mm A'),
    },
    {
      field: 'user',
      headerName: 'User',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.user?.name || '—'}</p>
          <p className="truncate text-xs text-muted-foreground">{row.user?.email}</p>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => {
        const label = TYPE_LABEL[row.type] || row.type || '—';
        return (
          <Badge className={row.type === 'series'
            ? 'border-emerald-200! bg-emerald-100 text-emerald-700'
            : 'border-sky-200! bg-sky-100 text-sky-700'}
          >
            {label}
          </Badge>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => row.blueprint?.title || row.series?.title || '—',
    },
    {
      field: 'series',
      headerName: 'Series',
      minWidth: 180,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => row.blueprint?.series_title || row.series?.title || '—',
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Content"
        title="Wishlists"
        description={scope === 'mentor'
          ? 'Saves of series you created, and of blueprints on those series.'
          : 'Every series and blueprint customers have saved.'}
      >
        <Button
          className="global_btn rounded_full bg_primary"
          onPress={exportCsv}
          isDisabled={isExporting || total === 0}
          isLoading={isExporting}
          startContent={!isExporting ? <Download className="h-4 w-4" /> : undefined}
        >
          Export CSV
        </Button>
      </AdminPageHeader>

      <AdminWishlistsSearch
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        userOptions={userOptions}
        seriesOptions={seriesOptions}
        blueprintOptions={blueprintOptions}
      />

      <AdminTableShell>
        <CommonDataTable
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </AdminTableShell>
    </AdminPage>
  );
}
