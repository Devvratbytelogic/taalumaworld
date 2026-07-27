'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { ChevronLeft, ChevronRight, MessageSquare, Star, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { useGetMyReviewsQuery } from '@/store/rtkQueries/userGetAPI';
import { getHomeRoutePath } from '@/routes/routes';
import type { IMyReviewsAPIResponseDataEntity } from '@/types/user/reviews';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

const PAGE_LIMIT = 10;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTypeLabel(type?: string) {
  if (type === 'Chapter') return 'Blueprint';
  if (type === 'Book') return 'Series';
  return type || 'Item';
}

function toApiDate(value: string) {
  if (!value) return '';
  return moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY');
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-3.5 w-3.5 ${
            value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: IMyReviewsAPIResponseDataEntity }) {
  const statusKey = String(review.status || 'pending').toLowerCase();

  return (
    <article className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {formatTypeLabel(review.type)} review
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {review.createdAt ? moment(review.createdAt).format('DD MMM YYYY') : '—'}
              {review.customer?.name ? ` · ${review.customer.name}` : ''}
            </p>
          </div>
          <Badge
            variant="outline"
            className={STATUS_BADGE_CLASS[statusKey] ?? STATUS_BADGE_CLASS.pending}
          >
            {formatStatusLabel(review.status)}
          </Badge>
        </div>

        <StarRow rating={review.rating ?? 0} />

        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {review.comment?.trim() || 'No comment provided.'}
        </p>

        {statusKey === 'rejected' && review.reason ? (
          <p className="rounded-lg border border-red-100 bg-red-50/70 px-3 py-2 text-xs text-red-700">
            <span className="font-medium">Rejection reason:</span> {review.reason}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function MyReviewsPage() {
  const [status, setStatus] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [status, fromDate, toDate]);

  const { data, isLoading, isFetching } = useGetMyReviewsQuery({
    page,
    limit: PAGE_LIMIT,
    status,
    ...(fromDate ? { fromDate: toApiDate(fromDate) } : {}),
    ...(toDate ? { toDate: toApiDate(toDate) } : {}),
  });

  const reviews = data?.data?.reviews ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? page;
  const hasActiveFilters = status !== 'all' || !!fromDate || !!toDate;

  const clearFilters = () => {
    setStatus('all');
    setFromDate('');
    setToDate('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="My Reviews"
          description="Reviews you have submitted across TaalumaWorld"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="h-9 w-40 rounded-lg bg-gray-100" />
            <div className="flex gap-2">
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
            </div>
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
        title="My Reviews"
        description="Reviews you have submitted across TaalumaWorld"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-end sm:gap-2">
              <div className="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1 sm:w-44">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex min-w-0 flex-col gap-1 sm:w-40">
                <label className="text-xs font-medium text-gray-500">From</label>
                <Input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-9 w-full text-sm"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1 sm:w-40">
                <label className="text-xs font-medium text-gray-500">To</label>
                <Input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-9 w-full text-sm"
                />
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="col-span-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50 sm:col-span-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </div>
            <p className="shrink-0 text-sm text-gray-500">
              {total} review{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <MessageSquare className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {hasActiveFilters ? 'No reviews match your filters' : 'No reviews yet'}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Try adjusting the status or date range.'
                    : 'After you review a blueprint or series, it will show up here.'}
                </p>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    onPress={clearFilters}
                    className="global_btn mx-auto rounded_full outline_primary"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Link
                    href={getHomeRoutePath()}
                    className="global_btn mx-auto inline-flex items-center justify-center rounded_full bg_primary px-4 py-2 text-sm"
                  >
                    Explore content
                  </Link>
                )}
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
