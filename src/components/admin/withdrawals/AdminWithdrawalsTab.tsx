'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Banknote, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminPage, AdminPageHeader, AdminStatCard } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { formatKes } from '@/constants/common';
import { useGetAllWithdrawalsQuery } from '@/store/rtkQueries/walletAPIs';
import type { IWithdrawalDataEntity } from '@/types/wallet';
import { AdminWithdrawalsSearch } from './AdminWithdrawalsSearch';
import { WithdrawalReviewModal } from './WithdrawalReviewModal';
import moment from 'moment';

const WITHDRAWAL_MODEL = 'Withdrawal';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPayoutMethod(method?: string) {
  if (!method) return '—';
  if (method.toLowerCase() === 'mpesa') return 'M-Pesa';
  if (method.toLowerCase() === 'bank') return 'Bank transfer';
  return method;
}

function formatWalletType(walletType?: string) {
  if (walletType === 'mentor') return 'Mentor';
  if (walletType === 'affiliate') return 'Affiliate';
  return walletType || '—';
}

export function AdminWithdrawalsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [walletType, setWalletType] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [reviewItem, setReviewItem] = useState<IWithdrawalDataEntity | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canView = hasPermission(WITHDRAWAL_MODEL, 'view');
  const canEdit = hasPermission(WITHDRAWAL_MODEL, 'edit');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading, isFetching } = useGetAllWithdrawalsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(walletType ? { wallet_type: walletType as 'mentor' | 'affiliate' } : {}),
    ...(statusFilter ? { status: statusFilter as 'pending' | 'approved' | 'rejected' } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const withdrawals = data?.data?.data ?? [];
  const summary = data?.data?.summary;
  const total = data?.data?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleWalletTypeChange = (value: string) => {
    setWalletType(value);
    resetToFirstPage();
  };

  const columns: GridColDef<IWithdrawalDataEntity>[] = [
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
      field: 'user',
      headerName: 'User',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Banknote className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm text-slate-900">{params.row.user?.name || '—'}</p>
            <p className="truncate text-xs text-muted-foreground">{params.row.user?.email || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-semibold text-primary whitespace-nowrap">
          {formatKes(Number(params.row.amount ?? 0))}
        </span>
      ),
    },
    {
      field: 'payout_method',
      headerName: 'Payout',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{formatPayoutMethod(params.row.payout_method)}</span>
      ),
    },
    {
      field: 'wallet_type',
      headerName: 'Wallet',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className="capitalize">
          {formatWalletType(params.row.wallet_type)}
        </Badge>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Requested',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">{params.row.createdAt ? moment(params.row.createdAt).format('DD MMM YYYY, h:mm A') : '—'}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = (params.row.status || 'pending').toLowerCase();
        return (
          <Badge
            variant="outline"
            className={`capitalize ${STATUS_BADGE_CLASS[status] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}
          >
            {formatStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        if (!canView) return null;
        return (
          <div className="action_buttons">
            <button
              type="button"
              className="active_button"
              title="Review withdrawal"
              onClick={() => setReviewItem(params.row)}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Withdrawals"
        description="Review and process mentor and affiliate withdrawal requests."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminStatCard label="Total requests" value={summary?.total ?? 0} icon={Banknote} tone="blue" />
        <AdminStatCard label="Pending" value={summary?.pending ?? 0} icon={Clock} tone="orange" />
      </div>

      <AdminWithdrawalsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        walletType={walletType}
        onWalletTypeChange={handleWalletTypeChange}
        status={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={withdrawals}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {canView ? (
        <WithdrawalReviewModal
          open={!!reviewItem}
          withdrawal={reviewItem}
          canEdit={canEdit}
          onOpenChange={(open) => {
            if (!open) setReviewItem(null);
          }}
        />
      ) : null}
    </AdminPage>
  );
}
