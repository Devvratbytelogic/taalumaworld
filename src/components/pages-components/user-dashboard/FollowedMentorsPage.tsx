'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { cn } from '@/components/ui/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetFollowedMentorsQuery } from '@/store/rtkQueries/userGetAPI';
import { getAllAuthorsRoutePath } from '@/routes/routes';
import MentorCard from '@/components/pages-components/mentor/MentorCard';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

const PAGE_LIMIT = 9;

export function FollowedMentorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate]);

  const { data, isLoading, isFetching } = useGetFollowedMentorsQuery({
    page,
    limit: PAGE_LIMIT,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  });

  const mentors = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const currentPage = data?.data?.page ?? page;
  const hasActiveFilters = !!fromDate || !!toDate || !!searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery('');
    setFromDate('');
    setToDate('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="Followed Mentors"
          description="Mentors you follow across TaalumaWorld"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="h-10 w-full rounded-lg bg-gray-100" />
            <div className="flex gap-2">
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="Followed Mentors"
        description="Mentors you follow across TaalumaWorld"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mentor name or email…"
              className="h-10 pl-9 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-end sm:gap-2">
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
              {total} mentor{total !== 1 ? 's' : ''} followed
            </p>
          </div>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {mentors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((item, index) => (
                <MentorCard
                  key={item._id || item.id}
                  index={index}
                  mentor={item.mentorId}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Users className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {hasActiveFilters ? 'No mentors match your filters' : 'No followed mentors yet'}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Try adjusting your search or date range.'
                    : 'Follow mentors you admire to keep their profiles handy here.'}
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
                  <Button
                    type="button"
                    onPress={() => router.push(getAllAuthorsRoutePath())}
                    className="global_btn mx-auto rounded_full bg_primary"
                  >
                    Browse Mentors
                  </Button>
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
