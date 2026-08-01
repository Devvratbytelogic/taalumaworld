'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { Heart, BookOpen, BookMarked, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import WishlistButton from '@/components/ui/WishlistButton';
import { cn } from '@/components/ui/utils';
import { useGetWishlistQuery } from '@/store/rtkQueries/userGetAPI';
import { VISIBLE } from '@/constants/contentMode';
import { getBlueprintRoutePath, getHomeRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

type FilterType = 'all' | 'Book' | 'Chapter';

const PAGE_LIMIT = 8;

const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'Book', label: 'Series' },
  { key: 'Chapter', label: 'Blueprints' },
];

const emptyStateCopy: Record<FilterType, { title: string; description: string }> = {
  all: {
    title: 'Your wishlist is empty',
    description: 'Save series and blueprints you love so you can pick up where you left off.',
  },
  Book: {
    title: 'No series saved',
    description: 'Series you save for later will show up here.',
  },
  Chapter: {
    title: 'No blueprints saved',
    description: 'Blueprints you save for later will show up here.',
  },
};

export function MyWishlistPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);

  const { data: wishlistData, isLoading, isFetching } = useGetWishlistQuery({
    page,
    limit: PAGE_LIMIT,
    ...(filter !== 'all' ? { type: filter } : {}),
  });

  const items = wishlistData?.data?.data ?? [];
  const total = wishlistData?.data?.total ?? 0;
  const totalPages = wishlistData?.data?.totalPages ?? 1;
  const currentPage = wishlistData?.data?.page ?? page;

  const handleFilterChange = (nextFilter: FilterType) => {
    setFilter(nextFilter);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader title="My Wishlist" description="Series and blueprints you have saved for later" />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4 sm:px-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-gray-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
                <div className="aspect-4/3 w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-20 rounded-full bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-10 w-full rounded-full bg-gray-100" />
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
          <p className="shrink-0 text-sm text-gray-500">
            {total} item{total !== 1 ? 's' : ''} saved
          </p>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items && items?.map((item) => {
                const isBlueprint = item.type === 'Chapter';
                const title = isBlueprint ? item.blueprint?.title : item.series?.title;
                const description = isBlueprint ? item.blueprint?.description : item.series?.description;
                const coverImage = isBlueprint ? item.blueprint?.coverImage : item.series?.coverImage;
                const routePath = isBlueprint ? getBlueprintRoutePath(item.blueprint?.slug ?? '') : getSeriesRoutePath(item.series?.slug ?? '');
                const price = isBlueprint ? item.blueprint?.price ?? 0 : item.series?.price ?? 0;
                const isFree = isBlueprint ? item.blueprint?.isFree : price === 0;
                const isChapterPriced = item.series?.pricingModel === VISIBLE.CHAPTER;
                return (
                  <article
                    key={item._id}
                    className="hover-lift group flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-colors hover:border-gray-300"
                  >
                    <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-100">
                      <div
                        className="h-full w-full cursor-pointer transition-transform duration-300 group-hover:scale-[1.04]"
                        onClick={() => router.push(routePath)}
                      >
                        <ImageComponent src={coverImage || ''} alt={title} object_cover={true} />
                      </div>

                      {item.is_purchased ? (
                        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-green-200 bg-white/95 px-2.5 py-1 text-xs font-medium text-green-700 shadow-sm backdrop-blur-sm">
                          <Sparkles className="h-3 w-3" aria-hidden />
                          Owned
                        </div>
                      ) : null}

                      <WishlistButton
                        itemId={item.item_id}
                        type={item.type}
                        className="absolute right-2 top-2 z-2 h-8! w-8! min-w-8! rounded-full border border-gray-200 bg-white/95 p-0! shadow-sm backdrop-blur-sm"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        {isBlueprint ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            <BookMarked className="h-3 w-3" aria-hidden />
                            Blueprint
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            <BookOpen className="h-3 w-3" aria-hidden />
                            Series
                          </span>
                        )}
                        {isFree ? (
                          <span className="rounded-full border border-green-200 px-2.5 py-1 text-xs font-medium text-green-700">
                            Free
                          </span>
                        ) : null}
                      </div>

                      <p className="mb-1.5 truncate text-xs text-gray-400">
                        {isBlueprint ? (
                          <>
                            Part of <span className="font-medium text-gray-500">{item.series?.title}</span>
                          </>
                        ) : isChapterPriced ? (
                          'Priced per blueprint'
                        ) : (
                          'Full series bundle'
                        )}
                      </p>

                      <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{title}</h3>

                      {description ? (
                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{description}</p>
                      ) : null}

                      <div className="flex-1" />

                      <div className="mt-4 flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
                        <div>
                          {isFree ? (
                            <p className="text-lg font-bold text-primary">Free</p>
                          ) : (
                            <p className="text-lg font-bold text-primary">KSH {price?.toFixed(2) ?? 0}</p>
                          )}
                          <p className="text-xs text-gray-400">Saved {moment(item.createdAt).fromNow()}</p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="global_btn mt-3 w-full rounded_full bg_primary"
                        onPress={() => router.push(routePath)}
                      >
                        {item.is_purchased ? (
                          <>
                            <BookOpen className="h-4 w-4" />
                            Read Now
                          </>
                        ) : (
                          <>
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
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
                    className="global_btn mx-auto rounded_full bg_primary"
                  >
                    Browse Content
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onPress={() => handleFilterChange('all')}
                    className="global_btn mx-auto rounded_full outline_primary"
                  >
                    Show All Saved Items
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
