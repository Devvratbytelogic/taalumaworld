'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Book,
  BookOpen,
  TrendingUp,
  CheckCircle,
  CircleDashed,
  Play,
  User,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import { cn } from '@/components/ui/utils';
import { useGetMySeriesQuery, useLazyGetTransactionInvoiceQuery } from '@/store/rtkQueries/userGetAPI';
import type { ItemsEntity } from '@/types/user/mySeries';
import { getHomeRoutePath, getSeriesRoutePath } from '@/routes/routes';
import MyBooksPageSkeleton from '@/components/skeleton-loader/MyBooksPageSkeleton';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

type FilterType = 'all' | 'inProgress' | 'completed' | 'unread';

const PAGE_LIMIT = 10;

export function MyBooksPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [invoiceDownloadingOrderId, setInvoiceDownloadingOrderId] = useState<string | null>(null);

  const { data: mySeriesData, isLoading, isFetching } = useGetMySeriesQuery({
    page,
    limit: PAGE_LIMIT,
    inProgress: filter === 'inProgress',
    completed: filter === 'completed',
    unread: filter === 'unread',
  });
  const [fetchTransactionInvoice] = useLazyGetTransactionInvoiceQuery();

  const series: ItemsEntity[] = mySeriesData?.data?.items ?? [];
  const summary = mySeriesData?.data?.summary;
  const pagination = mySeriesData?.data?.pagination;

  const handleFilterChange = (nextFilter: FilterType) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const handleDownloadInvoice = async (orderId: string) => {
    setInvoiceDownloadingOrderId(orderId);
    try {
      const blob = await fetchTransactionInvoice({ orderId }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setInvoiceDownloadingOrderId(null);
    }
  };

  if (isLoading) {
    return <MyBooksPageSkeleton />;
  }

  const statItems = [
    { icon: Book, label: 'Total series', value: summary?.totalBooks ?? 0, iconClass: 'text-primary' },
    { icon: TrendingUp, label: 'In progress', value: summary?.inProgress ?? 0, iconClass: 'text-primary' },
    { icon: CheckCircle, label: 'Completed', value: summary?.completed ?? 0, iconClass: 'text-green-600' },
    { icon: CircleDashed, label: 'Unread', value: summary?.unread ?? 0, iconClass: 'text-gray-500' },
  ] as const;

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: `All (${summary?.totalBooks ?? 0})` },
    { key: 'inProgress', label: `In progress (${summary?.inProgress ?? 0})` },
    { key: 'completed', label: `Completed (${summary?.completed ?? 0})` },
    { key: 'unread', label: `Unread (${summary?.unread ?? 0})` },
  ];

  const emptyStateCopy: Record<FilterType, { title: string; description: string }> = {
    all: {
      title: 'No series yet',
      description: "You haven't purchased any series yet. Start exploring and build your collection.",
    },
    inProgress: {
      title: 'No series in progress',
      description: 'Series you start reading will show up here.',
    },
    completed: {
      title: 'No completed series',
      description: 'Series you finish reading will show up here.',
    },
    unread: {
      title: 'No unread series',
      description: "You've started reading all of your series.",
    },
  };

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="My Series" description="Your personal collection of purchased series" />

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
            {pagination?.totalItems ?? 0} series
          </p>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {series.length > 0 ? (
            <div className="flex flex-col gap-4">
              {series.map((item) => {
                const { totalChapters, completedChapters } = item.progress;
                const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
                const isCompleted = item.readStatus === 'completed' || (totalChapters > 0 && completedChapters >= totalChapters);

                let statusLabel = 'Not started';
                let statusColor = 'text-gray-500';
                if (isCompleted) {
                  statusLabel = 'Completed';
                  statusColor = 'text-green-600';
                } else if (progress > 0) {
                  statusLabel = 'In progress';
                  statusColor = 'text-primary';
                }

                let readLabel = 'Start reading';
                let ReadIcon = Play;
                if (isCompleted) {
                  readLabel = 'Read again';
                  ReadIcon = BookOpen;
                } else if (progress > 0) {
                  readLabel = 'Continue reading';
                  ReadIcon = BookOpen;
                }

                return (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300 sm:flex-row"
                  >
                    <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-auto sm:w-40 sm:min-h-[168px] md:w-44">
                      <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
                        <ImageComponent src={item.coverImage || ''} alt={item.title} object_cover={true} />
                      </div>

                      {isCompleted ? (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md border border-green-200 bg-white/95 px-2 py-0.5 text-xs font-medium text-green-700 sm:left-2 sm:top-2">
                          <CheckCircle className="h-3 w-3" aria-hidden />
                          Done
                        </div>
                      ) : progress > 0 ? (
                        <div className="absolute left-3 top-3 rounded-md border border-primary/15 bg-white/95 px-2 py-0.5 text-xs font-medium text-primary sm:left-2 sm:top-2">
                          {Math.round(progress)}%
                        </div>
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col sm:flex-row">
                      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            <span className="truncate">{item.mentor?.name}</span>
                          </span>
                          <span className="hidden text-gray-300 sm:inline" aria-hidden>
                            ·
                          </span>
                          <span>{item.chapterCount} blueprints</span>
                        </div>

                        <h3 className="line-clamp-2 text-base font-medium text-gray-900">{item.title}</h3>

                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{item.description}</p>

                        <div className="mt-4 max-w-md">
                          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <div className="flex items-center gap-2">
                              <span className={statusColor}>{statusLabel}</span>
                              <span className="font-medium tabular-nums text-gray-700">{Math.round(progress)}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                isCompleted ? 'bg-green-500' : progress > 0 ? 'bg-primary' : 'bg-transparent'
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col justify-center gap-2 border-t border-gray-100 p-4 sm:w-44 sm:border-l sm:border-t-0 sm:p-5 md:w-48">
                        <Button
                          type="button"
                          className="global_btn rounded_full bg_primary w-full"
                          onPress={() => router.push(getSeriesRoutePath(item.slug ?? item.id ?? ''))}
                        >
                          <ReadIcon className="h-4 w-4" />
                          {readLabel}
                        </Button>

                        {item.order_id ? (
                          <Button
                            type="button"
                            className="global_btn rounded_full outline_primary w-full"
                            isDisabled={invoiceDownloadingOrderId === item.order_id}
                            onPress={() => handleDownloadInvoice(item.order_id as string)}
                          >
                            <FileDown className="h-4 w-4" />
                            {invoiceDownloadingOrderId === item.order_id ? 'Downloading…' : 'Invoice'}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Book className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{emptyStateCopy[filter].title}</h3>
                <p className="mb-6 text-sm text-gray-500">{emptyStateCopy[filter].description}</p>
                {filter === 'all' ? (
                  <Button
                    type="button"
                    onPress={() => router.push(getHomeRoutePath())}
                    className="global_btn rounded_full bg_primary"
                  >
                    Browse Series
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onPress={() => handleFilterChange('all')}
                    className="global_btn rounded_full outline_primary"
                  >
                    Show All Series
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
