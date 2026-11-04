'use client';

import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { X } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { AdminSearchInput, AdminSearchPanel, AdminTableShell, adminSelectClass } from '@/components/admin/layout/AdminContent';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminUserDetailRoutePath } from '@/routes/routes';
import { useGetInstitutionStudentsQuery } from '@/store/rtkQueries/institutionApi';
import type { IAdminInstitutionStudent } from '@/types/adminInstitutionStudent';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
  deleted: 'bg-slate-100 text-slate-600 border-slate-200',
};

const EMPTY_FILTERS = {
  search: '',
  status: '',
  from: '',
  to: '',
  verified: false,
};

export function InstitutionStudentsTab({ institutionId }: { institutionId: string }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const debouncedSearch = useDebounce(filters.search, 400);
  const today = new Date().toLocaleDateString('en-CA');
  const fromDate = filters.from && filters.from <= today ? filters.from : '';
  const toDate = filters.to && filters.to <= today && (!fromDate || filters.to >= fromDate) ? filters.to : '';

  const update = (patch: Partial<typeof EMPTY_FILTERS>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const { data, isLoading, isFetching, isError } = useGetInstitutionStudentsQuery(
    {
      id: institutionId,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(fromDate ? { from: fromDate } : {}),
      ...(toDate ? { to: toDate } : {}),
      ...(filters.verified ? { verified: 'true' } : {}),
    },
    { skip: !institutionId },
  );

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const hasFilters = Boolean(filters.search || filters.status || filters.from || filters.to || filters.verified);

  const columns: GridColDef<IAdminInstitutionStudent>[] = [
    {
      field: 'name',
      headerName: 'Student',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Link href={getAdminUserDetailRoutePath(row.id)} className="group min-w-0">
          <p className="truncate text-sm font-medium text-slate-900 group-hover:text-primary group-hover:underline">{row.name || '—'}</p>
          <p className="truncate text-xs text-slate-500">{row.email}</p>
        </Link>
      ),
    },
    { field: 'phone', headerName: 'Phone', minWidth: 140, sortable: false, renderCell: ({ row }) => row.phone || '—' },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => (
        <Badge variant="outline" className={STATUS_BADGE[row.status] ?? 'border-slate-200 text-slate-600'}>
          {row.status || '—'}
        </Badge>
      ),
    },
    {
      field: 'is_verified',
      headerName: 'Verified',
      width: 110,
      sortable: false,
      renderCell: ({ row }) => (
        <Badge variant="outline" className={row.is_verified ? 'bg-green-50 text-green-700 border-green-200!' : 'bg-slate-100 text-slate-600 border-slate-200'}>
          {row.is_verified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      field: 'joined_at',
      headerName: 'Joined',
      minWidth: 140,
      sortable: false,
      renderCell: ({ row }) => (row.joined_at ? moment(row.joined_at).format('MMM D, YYYY') : '—'),
    },
  ];

  return (
    <div className="space-y-4">
      <AdminSearchPanel>
        <div className="flex flex-wrap items-center gap-2">
          <AdminSearchInput
            className="w-72 max-w-full flex-none"
            inputClassName="h-9"
            value={filters.search}
            onChange={(search) => update({ search })}
            placeholder="Search by name or email…"
          />
          <select
            aria-label="Status"
            value={filters.status}
            onChange={(event) => update({ status: event.target.value })}
            className={adminSelectClass}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="retired">Retired</option>
            <option value="deleted">Deleted</option>
          </select>
          <Input aria-label="From" type="date" value={filters.from} max={filters.to && filters.to < today ? filters.to : today} onChange={(event) => update({ from: event.target.value })} className="h-9 w-40" />
          <Input aria-label="To" type="date" value={filters.to} min={filters.from || undefined} max={today} onChange={(event) => update({ to: event.target.value })} className="h-9 w-40" />
          {hasFilters ? (
            <button
              type="button"
              onClick={() => update(EMPTY_FILTERS)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-200! px-3 text-sm text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
          <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
            <Switch
              checked={filters.verified}
              onCheckedChange={(checked) => update({ verified: checked })}
              aria-label="Verified"
            />
            Verified
          </label>
        </div>
      </AdminSearchPanel>

      {isError ? <p className="text-sm text-red-600">Could not load students for this institution.</p> : null}

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
    </div>
  );
}
