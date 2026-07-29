'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import moment from 'moment';
import {
  AdminPage,
  AdminPageHeader,
  AdminStatCard,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { formatKes } from '@/constants/common';
import { useGetReferralWalletLedgerQuery } from '@/store/rtkQueries/dashboard';
import type { IReferralWalletLedgerEntry } from '@/types/referralWallet';

const TYPE_FILTER_OPTIONS = [
  { label: 'All entries', value: '' },
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
];

function isCredit(type?: string | null) {
  return String(type ?? '').toLowerCase() === 'credit';
}

function displayValue(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
}

export function MentorReferralWalletTab() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [entryType, setEntryType] = useState('');

  const { data, isLoading, isFetching } = useGetReferralWalletLedgerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(entryType ? { type: entryType as 'credit' | 'debit' } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const rows = listData?.data ?? [];
  const total = listData?.total ?? 0;
  const loading = isLoading || isFetching;

  const handleEntryTypeChange = (value: string) => {
    setEntryType(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const columns: GridColDef<IReferralWalletLedgerEntry>[] = [
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
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      sortable: false,
      renderCell: (params) =>
        params.value ? moment(params.value).format('DD MMM YYYY hh:mm A') : '—',
    },
    {
      field: 'referred_user',
      headerName: 'Referred user',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {params.row.referred_user?.name ?? '—'}
          </p>
          <p className="truncate text-xs text-slate-500">
            {params.row.referred_user?.email ?? '—'}
          </p>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const credit = isCredit(params.value);
        return (
          <Badge
            variant="outline"
            className={
              credit
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200!'
                : 'bg-red-50 text-red-700 border-red-200!'
            }
          >
            {displayValue(params.value)}
          </Badge>
        );
      },
    },
    {
      field: 'transaction_id',
      headerName: 'Transaction ID',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-xs text-slate-600">{displayValue(params.value)}</span>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="truncate text-sm text-slate-700">{displayValue(params.value)}</span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const credit = isCredit(params.row.type);
        return (
          <span className={credit ? 'font-medium text-emerald-700' : 'font-medium text-red-600'}>
            {credit ? '+' : '-'}
            {formatKes(params.row.absolute_amount ?? Math.abs(params.value ?? 0))}
          </span>
        );
      },
    },
    {
      field: 'balance_after',
      headerName: 'Balance after',
      width: 130,
      sortable: false,
      renderCell: (params) => formatKes(params.value ?? 0),
    },
    {
      field: 'commission',
      headerName: 'Commission',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const type = params.row.commission_type;
        if (!type) return '—';
        const value =
          type === 'percentage'
            ? `${params.row.commission_value ?? 0}%`
            : formatKes(params.row.commission_value ?? 0);
        return (
          <span className="capitalize text-sm text-slate-700">
            {type} · {value}
          </span>
        );
      },
    },
    {
      field: 'order',
      headerName: 'Order',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const order = params.row.order;
        if (!order?.order_number) return '—';
        return (
          <div className="min-w-0">
            <p className="truncate font-mono text-xs text-slate-700">#{order.order_number}</p>
            <p className="text-xs text-slate-500">{formatKes(order.total_amount ?? 0)}</p>
          </div>
        );
      },
    },
    {
      field: 'referral',
      headerName: 'Code',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-xs text-slate-600">
          {displayValue(params.row.referral?.referral_code)}
        </span>
      ),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Growth"
        title="Referral Wallet"
        description="Commission credits and debits from your referrals."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Balance"
          value={formatKes(summary?.balance ?? 0)}
          icon={Wallet}
          tone="blue"
        />
        <AdminStatCard
          label="Lifetime earnings"
          value={formatKes(summary?.lifetime_earnings ?? 0)}
          icon={ArrowUpRight}
          tone="green"
        />
        <AdminStatCard
          label="Lifetime spent"
          value={formatKes(summary?.lifetime_spent ?? 0)}
          icon={ArrowDownLeft}
          tone="purple"
        />
        <AdminStatCard
          label="Total credits"
          value={formatKes(summary?.total_credits ?? 0)}
          icon={Wallet}
          tone="green"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1 sm:w-52">
            <label className="text-xs font-medium text-slate-500">Type</label>
            <select
              value={entryType}
              onChange={(e) => handleEntryTypeChange(e.target.value)}
              className={adminSelectClass}
            >
              {TYPE_FILTER_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500">
            {total} entr{total !== 1 ? 'ies' : 'y'}
            {summary?.credit_count != null || summary?.debit_count != null
              ? ` · ${summary?.credit_count ?? 0} credit · ${summary?.debit_count ?? 0} debit`
              : ''}
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-gray-200">
          <CommonDataTable
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>
      </div>
    </AdminPage>
  );
}
