'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { AdminPage, AdminPageHeader, AdminSearchInput, AdminSearchPanel, AdminTableShell, adminSelectClass } from '@/components/admin/layout/AdminContent';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { formatKes, ROLE_NAME_MAP } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminMentorDetailRoutePath, getAdminUserDetailRoutePath } from '@/routes/routes';
import { useGetAdminReferralWalletsQuery } from '@/store/rtkQueries/adminReferralWalletsApi';
import type { IAdminReferralWallet } from '@/types/adminReferralWallet';

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
  hasReferrals: false,
};

type Filters = typeof EMPTY_FILTERS;

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={adminSelectClass}>
      {options.map((option) => (
        <option key={option.value || label} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export function AdminReferralWalletsTab() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const debouncedSearch = useDebounce(filters.search, 400);
  const today = new Date().toLocaleDateString('en-CA');
  const fromDate = filters.from && filters.from <= today ? filters.from : '';
  const toDate = filters.to && filters.to <= today && (!fromDate || filters.to >= fromDate) ? filters.to : '';

  const update = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const query = {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
    ...(filters.hasReferrals ? { has_referrals: 'true' } : {}),
  };

  const { data, isLoading, isFetching } = useGetAdminReferralWalletsQuery(query);
  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const hasFilters = Object.entries(filters).some(([key, value]) => key !== 'search' && value);

  const columns: GridColDef<IAdminReferralWallet>[] = [
    {
      field: 'name',
      headerName: 'Account',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        const href = row.user_type === 'mentor'
          ? getAdminMentorDetailRoutePath(row.id)
          : row.user_type === 'user'
            ? getAdminUserDetailRoutePath(row.id)
            : '';
        const content = (
          <div className="min-w-0">
            <p className={`truncate text-sm font-medium text-slate-900 ${href ? 'group-hover:text-primary group-hover:underline' : ''}`}>
              {row.name || '—'}
            </p>
            <p className="truncate text-xs text-slate-500">{row.email}</p>
          </div>
        );
        return href ? <Link href={href} className="group min-w-0">{content}</Link> : content;
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => ROLE_NAME_MAP[row.role] || row.role || '—',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Badge variant="outline" className={STATUS_BADGE[row.status] ?? 'border-slate-200 text-slate-600'}>
          {row.status || '—'}
        </Badge>
      ),
    },
    { field: 'referral_code', headerName: 'Code', minWidth: 120, sortable: false, renderCell: ({ row }) => row.referral_code || '—' },
    { field: 'wallet_balance', headerName: 'Balance', minWidth: 120, sortable: false, renderCell: ({ row }) => formatKes(row.wallet_balance || 0) },
    { field: 'lifetime_earnings', headerName: 'Earned', minWidth: 120, sortable: false, renderCell: ({ row }) => formatKes(row.lifetime_earnings || 0) },
    { field: 'lifetime_spent', headerName: 'Spent', minWidth: 120, sortable: false, renderCell: ({ row }) => formatKes(row.lifetime_spent || 0) },
    { field: 'total_referrals', headerName: 'Referrals', width: 110, sortable: false },
    { field: 'completed_referrals', headerName: 'Completed', width: 120, sortable: false },
    { field: 'pending_referrals', headerName: 'Pending', width: 110, sortable: false },
    { field: 'conversion_rate', headerName: 'Conv. rate', width: 110, sortable: false, renderCell: ({ row }) => `${row.conversion_rate || 0}%` },
    { field: 'commission', headerName: 'Commission', minWidth: 130, sortable: false, renderCell: ({ row }) => formatKes(row.commission || 0) },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Referral Wallets"
        description="Wallet balance and referral totals for each account. Rejected and deleted accounts stay hidden unless you filter for them."
      />

      <AdminSearchPanel>
        <div className="flex flex-wrap items-center gap-2">
          <AdminSearchInput
            className="w-72 max-w-full flex-none"
            inputClassName="h-9"
            value={filters.search}
            onChange={(search) => update({ search })}
            placeholder="Search by name, email, or code…"
          />
          <SelectFilter
            label="Status"
            value={filters.status}
            onChange={(status) => update({ status })}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'pending', label: 'Pending' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'retired', label: 'Retired' },
              { value: 'deleted', label: 'Deleted' },
            ]}
          />
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
              checked={filters.hasReferrals}
              onCheckedChange={(checked) => update({ hasReferrals: checked })}
              aria-label="Has referrals"
            />
            Has referrals
          </label>
        </div>
      </AdminSearchPanel>

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
