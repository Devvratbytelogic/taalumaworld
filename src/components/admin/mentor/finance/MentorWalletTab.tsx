'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { ArrowDownToLine, Wallet } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminPanel, AdminStatCard } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import Button from '@/components/ui/Button';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useGetWithdrawalLedgerQuery } from '@/store/rtkQueries/walletAPIs';
import { formatKes } from '@/constants/common';
import type { IMentorLedgerWalletDataEntity } from '@/types/wallet';
import MentorWithdrawalModal from './MentorWithdrawalModal';
import { MentorWalletSearch } from './MentorWalletSearch';
import moment from 'moment';

function displayValue(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
}

const DEBIT_ENTRY_TYPES = new Set(['refund_debit', 'payout_debit', 'withdrawal']);
const CREDIT_ENTRY_TYPES = new Set(['sale_credit', 'referral_topup']);

const ENTRY_TYPE_LABELS: Record<string, string> = {
  refund_debit: 'Refund debit',
  payout_debit: 'Payout debit',
  withdrawal: 'Withdrawal',
  sale_credit: 'Sale credit',
  referral_topup: 'Referral top-up',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200!',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border border-red-200!',
};

function getEntryTypeLabel(entryType?: string | null) {
  if (!entryType) return '—';
  return ENTRY_TYPE_LABELS[entryType] ?? entryType.replaceAll('_', ' ');
}

function isDebitEntry(entryType?: string | null) {
  return DEBIT_ENTRY_TYPES.has(String(entryType ?? '').toLowerCase());
}

function isCreditEntry(entryType?: string | null) {
  return CREDIT_ENTRY_TYPES.has(String(entryType ?? '').toLowerCase());
}


export function MentorWalletTab() {
  const { data: profileData, isLoading: isProfileLoading } = useGetAdminProfileQuery();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [entryType, setEntryType] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: ledgerData, isLoading: isLedgerLoading, isFetching } = useGetWithdrawalLedgerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(entryType ? { type: entryType as 'credit' | 'debit' } : {}),
    ...(status ? { status: status as 'pending' | 'completed' | 'rejected' } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  });

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleEntryTypeChange = (value: string) => {
    setEntryType(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    resetToFirstPage();
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    resetToFirstPage();
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    resetToFirstPage();
  };

  const profile = profileData?.data;
  const mentorInfo = profile?.mentor_info;
  const bankName = mentorInfo?.bank_name;
  const accountName = profile?.name;
  const accountNumber = mentorInfo?.bank_number;
  const mpesaNumber = mentorInfo?.mpesa_number;
  const taxId = mentorInfo?.tax_id;
  const currency = profile?.mentor_economy?.wallet?.currency || 'KES';
  const preferredFrequency = mentorInfo?.preferred_payment_frequency || '';

  const walletSummary = ledgerData?.data?.summary;
  const rows = ledgerData?.data?.data ?? [];
  const total = ledgerData?.data?.total ?? 0;
  const loading = isLedgerLoading || isFetching;

  const columns: GridColDef<IMentorLedgerWalletDataEntity>[] = [
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
      field: 'date',
      headerName: 'Date',
      width: 130,
      sortable: false,
      renderCell: (params) => (params.value ? moment(params.value).format('DD MMM YYYY hh:mm A') : '-'),
    },
    {
      field: 'entry_type',
      headerName: 'Entry',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const rowEntryType = String(params.value ?? '').toLowerCase();
        const isDebit = isDebitEntry(rowEntryType);
        const isCredit = isCreditEntry(rowEntryType);
        return (
          <span
            className={
              isDebit
                ? 'text-red-700'
                : isCredit
                  ? 'text-emerald-700'
                  : 'text-slate-700'
            }
          >
            {getEntryTypeLabel(rowEntryType)}
          </span>
        );
      },
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
      field: 'transaction_id',
      headerName: 'Transaction',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-xs text-slate-600">{displayValue(params.value)}</span>
      ),
    },
    {
      field: 'order_id',
      headerName: 'Order',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-xs text-slate-600">{displayValue(params.value)}</span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const entryType = String(params.row.entry_type ?? '').toLowerCase();
        const isDebit = isDebitEntry(entryType);
        return (
          <span className={isDebit ? 'font-medium text-red-600' : 'font-medium text-emerald-700'}>
            {isDebit ? '-' : '+'}
            {formatKes(Math.abs(params.value ?? 0))}
          </span>
        );
      },
    },
    {
      field: 'payout_method',
      headerName: 'Payout method',
      width: 140,
      sortable: false,
      renderCell: (params) => <span className="capitalize">{displayValue(params.value)}</span>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const status = String(params.value ?? '').toLowerCase();
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE_CLASS[status] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
          >
            {displayValue(params.value)}
          </span>
        );
      },
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Wallet & Payouts"
        description="Real-time balance, refunds, and chargebacks."
      />
      {/* <Button
          type="button"
          className="global_btn rounded_full bg_primary"
          startContent={<ArrowDownToLine className="h-4 w-4" />}
          onPress={() => setWithdrawOpen(true)}
        >
          Request withdrawal
        </Button> 
      </AdminPageHeader>
*/}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="Total earnings" value={formatKes(walletSummary?.lifetime_earnings ?? 0)} icon={Wallet} tone="green" />
        <AdminStatCard label="Wallet balance" value={formatKes(walletSummary?.balance ?? 0)} icon={Wallet} tone="green" />
        <AdminStatCard label="Available balance" value={formatKes(walletSummary?.available_balance ?? 0)} icon={Wallet} tone="blue" />
        <AdminStatCard label="Total withdrawals" value={formatKes(walletSummary?.total_withdrawn ?? 0)} icon={Wallet} tone="purple" />
        <AdminStatCard label="Pending withdrawals" value={formatKes(walletSummary?.pending_withdrawals ?? 0)} icon={Wallet} tone="purple" />
      </div>

      <AdminPanel>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Payment details</h2>
        {isProfileLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="h-4 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-slate-500">Bank</dt>
              <dd className="font-medium text-slate-900">{displayValue(bankName)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Account name</dt>
              <dd className="font-medium text-slate-900">{displayValue(accountName)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Account number</dt>
              <dd className="font-medium text-slate-900">{displayValue(accountNumber)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">M-Pesa</dt>
              <dd className="font-medium text-slate-900">{displayValue(mpesaNumber)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tax ID (KRA PIN)</dt>
              <dd className="font-medium text-slate-900">{displayValue(taxId)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Currency</dt>
              <dd className="font-medium text-slate-900">{displayValue(currency)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Preferred payment frequency</dt>
              <dd className="font-medium text-slate-900 capitalize">{displayValue(preferredFrequency)}</dd>
            </div>
          </dl>
        )}
      </AdminPanel>

      <div className="space-y-4">
        <MentorWalletSearch
          entryType={entryType}
          onEntryTypeChange={handleEntryTypeChange}
          status={status}
          onStatusChange={handleStatusChange}
          fromDate={fromDate}
          onFromDateChange={handleFromDateChange}
          toDate={toDate}
          onToDateChange={handleToDateChange}
        />

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
      </div>

      <MentorWithdrawalModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </AdminPage>
  );
}
