'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminPage, AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { useGetCampaignUsersQuery } from '@/store/rtkQueries/adminGetApi';
import { CAMPAIGN_USERS_MODEL } from '@/constants/campaignAttribution';
import type { ICampaignUser } from '@/types/campaignUsers';
import { AdminCampaignUsersSearch } from './AdminCampaignUsersSearch';
import { AdminCampaignUsersSkeleton } from '@/components/skeleton-loader/admin';

const EMPTY_COPY =
  'No campaign signups yet. Users appear here only when they register from a URL with UTM or a click id.';

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function displayValue(value?: string | null) {
  return value?.trim() || '—';
}

export function AdminCampaignUsersTab() {
  const { hasPermission, isLoading: isLoadingPermissions } = useAdminPermissions();
  const canView = hasPermission(CAMPAIGN_USERS_MODEL, 'view');

  const [searchQuery, setSearchQuery] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });

  const debouncedSearch = useDebounce(searchQuery, 400);
  const debouncedCampaign = useDebounce(utmCampaign, 400);

  const { data, isLoading, isFetching } = useGetCampaignUsersQuery(
    {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(utmSource ? { utm_source: utmSource } : {}),
      ...(debouncedCampaign.trim() ? { utm_campaign: debouncedCampaign.trim() } : {}),
    },
    { skip: isLoadingPermissions || !canView },
  );

  const payload = data?.data;
  const rows = payload?.data ?? [];
  const total = payload?.total ?? 0;
  const loading = isLoading || isFetching || isLoadingPermissions;
  const hasActiveFilters = Boolean(searchQuery.trim() || utmSource || utmCampaign.trim());

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const columns: GridColDef<ICampaignUser>[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{displayValue(params.row.name)}</p>
          {params.row.short_code ? (
            <p className="truncate font-mono text-xs text-slate-500">{params.row.short_code}</p>
          ) : null}
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <span className="truncate text-sm text-slate-700">{displayValue(params.row.email)}</span>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline">{displayValue(params.row.role?.name)}</Badge>
      ),
    },
    {
      field: 'utm_source',
      headerName: 'Source',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{displayValue(params.row.campaign?.utm_source)}</span>
      ),
    },
    {
      field: 'utm_campaign',
      headerName: 'Campaign',
      minWidth: 160,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <span className="truncate text-sm text-slate-700">{displayValue(params.row.campaign?.utm_campaign)}</span>
      ),
    },
    {
      field: 'utm_medium',
      headerName: 'Medium',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{displayValue(params.row.campaign?.utm_medium)}</span>
      ),
    },
    {
      field: 'referral_code',
      headerName: 'Referral',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-sm text-slate-700">
          {displayValue(params.row.referral?.referral_code)}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Signed up',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{formatDate(params.row.createdAt)}</span>
      ),
    },
  ];

  if (isLoadingPermissions || isLoading) {
    return (
      <AdminPage>
        <AdminPageHeader
          eyebrow="User Management"
          title="Campaign Users"
          description="Users who signed up from a campaign / ad"
        >
          <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
            Total: {total}
          </Badge>
        </AdminPageHeader>
        <AdminCampaignUsersSkeleton />
      </AdminPage>
    );
  }

  if (!isLoadingPermissions && !canView) {
    return (
      <AdminPage>
        <AdminPageHeader
          eyebrow="User Management"
          title="Campaign Users"
          description="Users who signed up from a campaign / ad"
        />
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Megaphone className="h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-500">You do not have view access to Campaign Users</p>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="User Management"
        title="Campaign Users"
        description="Users who signed up from a campaign / ad"
      >
        <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
          Total: {total}
        </Badge>
      </AdminPageHeader>

      <AdminCampaignUsersSearch
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          resetToFirstPage();
        }}
        utmSource={utmSource}
        onUtmSourceChange={(value) => {
          setUtmSource(value);
          resetToFirstPage();
        }}
        utmCampaign={utmCampaign}
        onUtmCampaignChange={(value) => {
          setUtmCampaign(value);
          resetToFirstPage();
        }}
      />

      {!loading && rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Megaphone className="h-10 w-10 text-slate-300" />
          <p className="max-w-lg text-sm text-slate-500">
            {hasActiveFilters ? 'No campaign signups match your filters.' : EMPTY_COPY}
          </p>
        </div>
      ) : (
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
      )}
    </AdminPage>
  );
}
