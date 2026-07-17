'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp, CheckCircle, Play, BookMarked, FileDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetMyChaptersQuery, useLazyGetTransactionInvoiceQuery } from '@/store/rtkQueries/userGetAPI';
import { cn } from '@/components/ui/utils';
import type { ItemsEntity } from '@/types/user/myChapters';
import ImageComponent from '@/components/ui/ImageComponent';
import { getBlueprintRoutePath, getHomeRoutePath } from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

type FilterType = 'all' | 'reading' | 'completed' | 'unread';

export function MyChaptersPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [invoiceDownloadingOrderId, setInvoiceDownloadingOrderId] = useState<string | null>(null);

  const { data: myChaptersData, isLoading } = useGetMyChaptersQuery();
  const [fetchTransactionInvoice] = useLazyGetTransactionInvoiceQuery();
  const chapters: ItemsEntity[] = myChaptersData?.data?.items ?? [];

  const stats = useMemo(
    () => ({
      total: chapters.length,
      reading: chapters.filter((c) => c.progressPercent > 0 && !c.completed).length,
      completed: chapters.filter((c) => c.completed).length,
      unread: chapters.filter((c) => c.progressPercent === 0 && !c.completed).length,
    }),
    [chapters]
  );

  const filteredChapters = useMemo(() => {
    switch (activeFilter) {
      case 'reading':
        return chapters.filter((c) => c.progressPercent > 0 && !c.completed);
      case 'completed':
        return chapters.filter((c) => c.completed);
      case 'unread':
        return chapters.filter((c) => c.progressPercent === 0 && !c.completed);
      default:
        return chapters;
    }
  }, [chapters, activeFilter]);

  const getProgressStatus = (progressPercent: number, completed: boolean) => {
    if (completed || progressPercent >= 100) return { label: 'Completed', color: 'text-green-600' };
    if (progressPercent > 0) return { label: 'In progress', color: 'text-primary' };
    return { label: 'Not started', color: 'text-gray-500' };
  };

  const normalizeProgress = (value?: number) => Math.min(100, Math.max(0, value ?? 0));

  const getReadAction = (progressPercent: number, completed: boolean) => {
    const progress = normalizeProgress(progressPercent);
    const isCompleted = completed || progress >= 100;

    if (isCompleted) {
      return { label: 'Read again', icon: BookOpen };
    }
    if (progress > 0) {
      return { label: 'Continue reading', icon: BookOpen };
    }
    return { label: 'Start reading', icon: Play };
  };

  const shouldShowDescription = (title?: string, description?: string) => {
    const normalizedTitle = title?.trim().toLowerCase();
    const normalizedDescription = description?.trim().toLowerCase();
    return Boolean(normalizedDescription && normalizedDescription !== normalizedTitle);
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
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="My Blueprints"
          description="Your personal collection of purchased blueprints"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="grid grid-cols-1 divide-y divide-gray-200/70 bg-gray-50/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                <div className="h-9 w-9 rounded-md bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-5 w-8 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 p-5 sm:p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row">
                <div className="aspect-16/10 w-full bg-gray-200 sm:w-40 sm:min-h-[168px]" />
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div className="h-3 w-32 rounded bg-gray-100" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-1.5 w-full rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    { icon: BookOpen, label: 'Total blueprints', value: stats.total, iconClass: 'text-primary' },
    { icon: TrendingUp, label: 'In progress', value: stats.reading, iconClass: 'text-primary' },
    { icon: CheckCircle, label: 'Completed', value: stats.completed, iconClass: 'text-green-600' },
  ] as const;

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="My Blueprints"
        description="Your personal collection of purchased blueprints"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-1 divide-y divide-gray-200/70 bg-gray-50/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
            {(
              [
                { key: 'all', label: `All (${stats.total})` },
                { key: 'reading', label: `Reading (${stats.reading})` },
                { key: 'completed', label: `Completed (${stats.completed})` },
                { key: 'unread', label: `Unread (${stats.unread})` },
              ] as { key: FilterType; label: string }[]
            ).map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                className={cn('global_btn shrink-0 rounded_full', activeFilter === key ? 'bg_primary' : 'outline_primary')}
                onPress={() => setActiveFilter(key)}
              >
                {label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {filteredChapters.length} blueprint{filteredChapters.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {filteredChapters.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredChapters.map((chapter) => {
                const progress = normalizeProgress(chapter.progressPercent);
                const isCompleted = chapter.completed || progress >= 100;
                const status = getProgressStatus(progress, chapter.completed);
                const readAction = getReadAction(progress, chapter.completed);
                const ReadIcon = readAction.icon;
                const showDescription = shouldShowDescription(chapter.title, chapter.description);

                return (
                  <article
                    key={chapter.chapterId}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300 sm:flex-row"
                  >
                    <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-auto sm:w-40 sm:min-h-[168px] md:w-44">
                      <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
                        <ImageComponent
                          key={chapter.chapterId}
                          src={chapter.coverImage}
                          alt={chapter.title}
                          object_cover={true}
                        />
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
                            <BookMarked className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            <span className="truncate">{chapter.bookTitle}</span>
                          </span>
                          <span className="hidden text-gray-300 sm:inline" aria-hidden>
                            ·
                          </span>
                          <span>Blueprint {chapter.chapterNumber}</span>
                          <span className="hidden text-gray-300 sm:inline" aria-hidden>
                            ·
                          </span>
                          <span>{chapter.pageCount} pages</span>
                        </div>

                        <h3 className="line-clamp-2 text-base font-medium text-gray-900">{chapter.title}</h3>

                        {showDescription ? (
                          <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{chapter.description}</p>
                        ) : null}

                        <div className="mt-4 max-w-md">
                          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <div className="flex items-center gap-2">
                              <span className={status.color}>{status.label}</span>
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
                          onPress={() => router.push(getBlueprintRoutePath(chapter.chapterId))}
                        >
                          <ReadIcon className="h-4 w-4" />
                          {readAction.label}
                        </Button>

                        {chapter.order_id ? (
                          <Button
                            type="button"
                            className="global_btn rounded_full outline_primary w-full"
                            isDisabled={invoiceDownloadingOrderId === chapter.order_id}
                            onPress={() => handleDownloadInvoice(chapter.order_id)}
                          >
                            <FileDown className="h-4 w-4" />
                            {invoiceDownloadingOrderId === chapter.order_id ? 'Downloading…' : 'Invoice'}
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
                  <BookOpen className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {activeFilter === 'all'
                    ? 'No blueprints yet'
                    : `No ${activeFilter === 'reading' ? 'in progress' : activeFilter === 'completed' ? 'completed' : 'unread'} blueprints`}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {activeFilter === 'all'
                    ? "You haven't purchased any blueprints yet. Start exploring and build your collection."
                    : 'No blueprints match this filter.'}
                </p>
                {activeFilter === 'all' ? (
                  <Button
                    type="button"
                    onPress={() => router.push(getHomeRoutePath())}
                    className="global_btn rounded_full bg_primary"
                  >
                    Browse Blueprints
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onPress={() => setActiveFilter('all')}
                    className="global_btn rounded_full outline_primary"
                  >
                    Show All Blueprints
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
