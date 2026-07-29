'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Wallet,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { formatKes } from '@/constants/common';
import { useGetReferralWalletLedgerQuery } from '@/store/rtkQueries/dashboard';
import type { IReferralWalletLedgerEntry } from '@/types/referralWallet';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

const PAGE_LIMIT = 10;

const TYPE_OPTIONS = [
  { value: '', label: 'All entries' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
];

function isCredit(type?: string | null) {
  return String(type ?? '').toLowerCase() === 'credit';
}

function formatCommission(entry: IReferralWalletLedgerEntry) {
  if (!entry.commission_type) return '—';
  if (entry.commission_type === 'percentage') {
    return `${entry.commission_value ?? 0}%`;
  }
  return formatKes(entry.commission_value ?? 0);
}

function LedgerCard({ entry }: { entry: IReferralWalletLedgerEntry }) {
  const credit = isCredit(entry.type);
  const userName = entry.referred_user?.name || '—';
  const userEmail = entry.referred_user?.email || '—';

  return (
    <article className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{userEmail}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            credit
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200!'
              : 'bg-red-50 text-red-700 border-red-200!',
          )}
        >
          {entry.type || entry.entry_type || '—'}
        </Badge>
      </div>

      <p className="mt-3 text-sm text-gray-700">
        {entry.description?.trim() || 'No description'}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Amount</p>
          <p className={cn('mt-0.5 text-sm font-semibold', credit ? 'text-emerald-700' : 'text-red-600')}>
            {credit ? '+' : '-'}
            {formatKes(entry.absolute_amount ?? Math.abs(entry.amount ?? 0))}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Balance after</p>
          <p className="mt-0.5 text-sm text-gray-800">{formatKes(entry.balance_after ?? 0)}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Commission</p>
          <p className="mt-0.5 text-sm capitalize text-gray-800">
            {entry.commission_type || '—'}
            {entry.commission_type ? ` · ${formatCommission(entry)}` : ''}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Referral code</p>
          <p className="mt-0.5 font-mono text-sm text-gray-800">
            {entry.referral?.referral_code || '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Order</p>
          <p className="mt-0.5 text-sm text-gray-800">
            {entry.order?.order_number
              ? `#${entry.order.order_number} · ${formatKes(entry.order.total_amount ?? 0)}`
              : '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>
          {entry.createdAt ? moment(entry.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
        </span>
        <span>
          Transaction ID:{' '}
          <span className="font-mono text-gray-700">{entry.transaction_id || '—'}</span>
        </span>
      </div>
    </article>
  );
}

export function ReferralWalletPage() {
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [type]);

  const { data, isLoading, isFetching } = useGetReferralWalletLedgerQuery({
    page,
    limit: PAGE_LIMIT,
    ...(type ? { type: type as 'credit' | 'debit' } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const entries = listData?.data ?? [];
  const total = listData?.total ?? 0;
  const totalPages = listData?.totalPages ?? 1;
  const currentPage = listData?.page ?? page;
  const hasActiveFilters = !!type;

  const clearFilters = () => setType('');

  const statItems = [
    {
      icon: Wallet,
      label: 'Balance',
      value: formatKes(summary?.balance ?? 0),
      iconClass: 'text-primary',
    },
    {
      icon: ArrowUpRight,
      label: 'Lifetime earnings',
      value: formatKes(summary?.lifetime_earnings ?? 0),
      iconClass: 'text-emerald-600',
    },
    {
      icon: ArrowDownLeft,
      label: 'Lifetime spent',
      value: formatKes(summary?.lifetime_spent ?? 0),
      iconClass: 'text-red-600',
    },
    {
      icon: Wallet,
      label: 'Total credits',
      value: formatKes(summary?.total_credits ?? 0),
      iconClass: 'text-amber-600',
    },
  ] as const;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="Referral Wallet"
          description="Commission credits and debits from your referrals"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="grid grid-cols-2 gap-px bg-gray-100 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white px-5 py-4" />
            ))}
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="Referral Wallet"
        description="Commission credits and debits from your referrals"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-1 divide-y divide-gray-200/70 bg-gray-50/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {statItems.map(({ icon: Icon, label, value, iconClass }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                <Icon className={cn('h-4 w-4', iconClass)} aria-hidden />
              </span>
              <div>
                <p className="text-xl font-semibold tracking-tight text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex min-w-0 flex-col gap-1 sm:w-44">
              <label className="text-xs font-medium text-gray-500">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-9 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>
          <p className="shrink-0 text-sm text-gray-500">
            {total} entr{total !== 1 ? 'ies' : 'y'}
          </p>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <LedgerCard key={entry._id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Wallet className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {hasActiveFilters ? 'No ledger entries match this filter' : 'No wallet activity yet'}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Try a different type filter.'
                    : 'Commission credits from successful referrals will show up here.'}
                </p>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    onPress={clearFilters}
                    className="global_btn mx-auto rounded_full outline_primary"
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-700">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={currentPage <= 1 || isFetching}
                onPress={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={currentPage >= totalPages || isFetching}
                onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
