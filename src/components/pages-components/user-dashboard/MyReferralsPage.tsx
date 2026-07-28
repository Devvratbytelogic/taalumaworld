'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Percent,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { formatKes } from '@/constants/common';
import { useGetMyMentorReferralsQuery } from '@/store/rtkQueries/dashboard';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import type {
  IMentorReferralsAPIResponseDataEntity,
  MentorReferralStatus,
} from '@/types/dashboard';
import toast from '@/utils/toast';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

const PAGE_LIMIT = 10;

const STATUS_OPTIONS: { value: MentorReferralStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'registered', label: 'Registered' },
  { value: 'purchased', label: 'Purchased' },
  { value: 'pending', label: 'Pending' },
];

const STATUS_BADGE_CLASS: Record<MentorReferralStatus, string> = {
  registered: 'bg-sky-50 text-sky-700 border-sky-200!',
  purchased: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
};

function getReferralStatus(row: IMentorReferralsAPIResponseDataEntity): MentorReferralStatus {
  if (row.isFirstPurchaseDone) return 'purchased';
  if (row.isRegistered) return 'registered';
  return 'pending';
}

function ReferralCard({ referral }: { referral: IMentorReferralsAPIResponseDataEntity }) {
  const status = getReferralStatus(referral);
  const userName = referral.registered_user?.name ?? referral.user_name ?? '—';
  const userEmail = referral.registered_user?.email ?? '—';

  return (
    <article className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{userEmail}</p>
        </div>
        <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Code</p>
          <p className="mt-0.5 font-mono text-sm text-gray-800">{referral.referral_code || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Commission type</p>
          <p className="mt-0.5 text-sm capitalize text-gray-800">{referral.commission_type || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Commission rate</p>
          <p className="mt-0.5 text-sm text-gray-800">
            {referral.commission_type === 'percentage'
              ? `${referral.commission_value}%`
              : formatKes(referral.commission_value ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Earned</p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">
            {formatKes(referral.commission_amount ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Credited</p>
          <p className="mt-0.5 text-sm text-gray-800">
            {referral.is_credited
              ? referral.credited_at
                ? moment(referral.credited_at).format('MMM D, YYYY')
                : 'Yes'
              : 'Pending'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>
          Referred {referral.createdAt ? moment(referral.createdAt).format('MMM D, YYYY') : '—'}
        </span>
        {referral.order ? (
          <span>
            Order #{referral.order.order_number} · {formatKes(referral.order.total_amount ?? 0)}
          </span>
        ) : (
          <span>No purchase yet</span>
        )}
      </div>
    </article>
  );
}

export function MyReferralsPage() {
  const [status, setStatus] = useState<MentorReferralStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data: profileData } = useGetUserProfileQuery();
  const shortCode = profileData?.data?.short_code?.trim() || '';

  useEffect(() => {
    setPage(1);
  }, [status]);

  const { data, isLoading, isFetching } = useGetMyMentorReferralsQuery({
    page,
    limit: PAGE_LIMIT,
    ...(status ? { status } : {}),
  });

  const summary = data?.data?.summary;
  const listData = data?.data?.data;
  const referrals = listData?.data ?? [];
  const total = listData?.total ?? 0;
  const totalPages = listData?.totalPages ?? 1;
  const currentPage = listData?.page ?? page;
  const hasActiveFilters = !!status;

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`, { description: value });
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const clearFilters = () => setStatus('');

  const statItems = [
    { icon: Users, label: 'Total referrals', value: summary?.total_referrals ?? 0, iconClass: 'text-primary' },
    { icon: UserCheck, label: 'Registered', value: summary?.total_registered ?? 0, iconClass: 'text-sky-600' },
    { icon: TrendingUp, label: 'Purchased', value: summary?.total_purchased ?? 0, iconClass: 'text-green-600' },
    {
      icon: Wallet,
      label: 'Commission earned',
      value: formatKes(summary?.total_commission_earned ?? 0),
      iconClass: 'text-amber-600',
    },
  ] as const;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="My Referrals"
          description="Track registrations and conversions from your referral code"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="grid grid-cols-2 gap-px bg-gray-100 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white px-5 py-4" />
            ))}
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="My Referrals"
        description="Track registrations and conversions from your referral code"
      />

      {shortCode ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Your referral code</p>
              <p className="mt-1 font-mono text-lg font-semibold text-gray-900">{shortCode}</p>
            </div>
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              startContent={<Copy className="h-4 w-4" />}
              onPress={() => copyText(shortCode, 'Referral code')}
            >
              Copy code
            </Button>
          </div>
        </div>
      ) : null}

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

        {/* {(summary?.conversion_rate ?? 0) > 0 ? (
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 text-sm text-gray-600 sm:px-6">
            <Percent className="h-3.5 w-3.5 text-gray-400" aria-hidden />
            Conversion rate: {(summary?.conversion_rate ?? 0).toFixed(1)}%
          </div>
        ) : null} */}

        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex min-w-0 flex-col gap-1 sm:w-44">
              <label className="text-xs font-medium text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MentorReferralStatus | '')}
                className="h-9 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              >
                {STATUS_OPTIONS.map((option) => (
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
            {total} referral{total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <ReferralCard key={referral._id} referral={referral} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Users className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {hasActiveFilters ? 'No referrals match this status' : 'No referrals yet'}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Try a different status filter.'
                    : 'Share your referral code or link. When someone signs up with it, they will appear here.'}
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
