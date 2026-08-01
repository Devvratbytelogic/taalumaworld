'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Award, Edit2, Plus, X } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminSearchInput, AdminSearchPanel, adminFilterPillClass, adminSelectClass } from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllMentorTiersQuery } from '@/store/rtkQueries/mentorApis';
import type { IAllMentorTiersEntity } from '@/types/mentorTier';
import { MentorTypeModal } from './MentorTypeModal';
import moment from 'moment';
import ImageComponent from '@/components/ui/ImageComponent';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

const MODEL = 'Mentor Tier';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_OPTIONS = ['active', 'inactive'];

export function AdminMentorTypesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<IAllMentorTiersEntity | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canAdd = hasPermission(MODEL, 'add');
  const canEdit = hasPermission(MODEL, 'edit');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetAllMentorTiersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const tiers = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const hasActiveFilters = !!statusFilter;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <span className="text-sm text-muted-foreground">
            {paginationModel.page * paginationModel.pageSize + rowIndex + 1}
          </span>
        );
      },
    },
    {
      field: 'code',
      headerName: 'Tier code',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-primary/10">
            {params.row.badge ? (
              <ImageComponent src={params.row.badge || ''} alt='Mentor tier badge' object_cover={true} />
            ) : (
              <Award className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.code}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'revenue_share',
      headerName: 'Revenue share',
      minWidth: 190,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.mentor_share_percent}% Mentor / {params.row.platform_share_percent}% Platform
        </span>
      ),
    },
    {
      field: 'rank',
      headerName: 'Rank',
      width: 80,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700">#{params.row.rank}</span>,
    },
    {
      field: 'eligibility',
      headerName: 'Eligibility criteria',
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const criteria: string[] = [];
        if (params.row.max_mentors) criteria.push(`Max ${params.row.max_mentors} mentors`);
        if (params.row.min_confirmed_sales) criteria.push(`${params.row.min_confirmed_sales}+ sales`);
        if (params.row.min_days_since_published) criteria.push(`${params.row.min_days_since_published}+ days live`);
        if (params.row.min_words_per_blueprint) criteria.push(`${params.row.min_words_per_blueprint}+ words`);
        return criteria.length ? (
          <span className="truncate text-sm text-slate-600" title={criteria.join(' · ')}>
            {criteria.join(' · ')}
          </span>
        ) : (
          <span className="text-sm text-slate-400">No criteria</span>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">
          {params.row.createdAt
            ? moment(params.row.createdAt).format('DD MMM YYYY')
            : '—'}
        </span>
      ),
    },
    {
      field: 'is_verified_tier',
      headerName: 'Verified Tier',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={params.row.is_verified_tier ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
          {params.row.is_verified_tier ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        if (!canEdit) return null;
        return (
          <div className="action_buttons">
            <button
              type="button"
              className="edit_button"
              title="Edit mentor tier"
              onClick={() => setEditingTier(params.row)}
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <AdminPage>
        <AdminPageHeader
          eyebrow="Mentor Management"
          title="Mentor Tiers"
          description="Configure mentor tiers, revenue share, and rank used to grade mentor performance."
        >
          {canAdd ? (
            <Button className="global_btn rounded_full bg_primary" onPress={() => setIsCreateOpen(true)} startContent={<Plus className="h-4 w-4" />}>
              Add mentor tier
            </Button>
          ) : null}
        </AdminPageHeader>

        <AdminSearchPanel>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <AdminSearchInput value={searchQuery} onChange={handleSearchChange} placeholder="Search by tier code..." />

            <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={adminSelectClass}
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => handleStatusChange('')}
                  className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap gap-2">
              <span className={adminFilterPillClass}>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button type="button" onClick={() => handleStatusChange('')} className="hover:text-primary/70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          ) : null}
        </AdminSearchPanel>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <CommonDataTable
            rows={tiers}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isLoading}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>


        {canAdd ? <MentorTypeModal open={isCreateOpen} onOpenChange={setIsCreateOpen} /> : null}
        {canEdit ? (
          <MentorTypeModal
            open={!!editingTier}
            mentorTier={editingTier}
            onOpenChange={(open) => !open && setEditingTier(null)}
          />
        ) : null}
      </AdminPage>
    </>
  );
}
