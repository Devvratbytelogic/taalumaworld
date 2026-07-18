'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Book, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import CommonCard from '@/components/cards/CommonCard';
import { cn } from '@/components/ui/utils';
import { useGetWishlistQuery } from '@/store/rtkQueries/userGetAPI';
import { getHomeRoutePath } from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

type FilterType = 'all' | 'book' | 'chapter';

const PAGE_LIMIT = 12;

export function MyWishlistPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);

  const { data: wishlistData, isLoading, isFetching } = useGetWishlistQuery({
    page,
    limit: PAGE_LIMIT,
    ...(filter !== 'all' ? { type: filter } : {}),
  });

  const items = wishlistData?.data?.items ?? [];
  const pagination = wishlistData?.data?.pagination;

  const handleFilterChange = (nextFilter: FilterType) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'book', label: 'Series' },
    { key: 'chapter', label: 'Blueprints' },
  ];

  const emptyStateCopy: Record<FilterType, { title: string; description: string }> = {
    all: {
      title: 'Your wishlist is empty',
      description: 'Save series and blueprints you love by tapping the heart icon, and they will show up here.',
    },
    book: {
      title: 'No series wishlisted',
      description: 'Series you wishlist will show up here.',
    },
    chapter: {
      title: 'No blueprints wishlisted',
      description: 'Blueprints you wishlist will show up here.',
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader title="My Wishlist" description="Series and blueprints you have saved for later" />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="flex gap-2 border-b border-gray-100 px-4 py-4 sm:px-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
                <div className="aspect-2/2 bg-gray-200" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="My Wishlist" description="Series and blueprints you have saved for later" />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filterTabs.map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                className={cn('global_btn shrink-0 rounded_full', filter === key ? 'bg_primary' : 'outline_primary')}
                isDisabled={isFetching}
                onPress={() => handleFilterChange(key)}
              >
                {label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {pagination?.totalItems ?? 0} item{(pagination?.totalItems ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, index) => (
                <CommonCard key={item.id ?? index} data={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Heart className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{emptyStateCopy[filter].title}</h3>
                <p className="mb-6 text-sm text-gray-500">{emptyStateCopy[filter].description}</p>
                {filter === 'all' ? (
                  <Button
                    type="button"
                    onPress={() => router.push(getHomeRoutePath())}
                    className="global_btn rounded_full bg_primary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Browse Library
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onPress={() => handleFilterChange('all')}
                    className="global_btn rounded_full outline_primary"
                  >
                    <Book className="h-4 w-4" />
                    Show All Wishlist
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-700">{pagination.currentPage}</span> of{' '}
              <span className="font-medium text-gray-700">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={pagination.currentPage <= 1 || isFetching}
                onPress={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={pagination.currentPage >= pagination.totalPages || isFetching}
                onPress={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
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
