import type { ReactNode } from 'react';
import { cn } from '@/components/ui/utils';

function Bone({ className }: { className?: string }) {
  return <div className={cn('rounded bg-gray-200', className)} />;
}

function StatsRowSkeleton({ count }: { count: number }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 divide-y divide-gray-200/70 bg-gray-50/60 sm:divide-x sm:divide-y-0',
        count === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4',
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <Bone className="h-9 w-9 shrink-0 rounded-md" />
          <div className="space-y-2">
            <Bone className="h-5 w-10" />
            <Bone className="h-3 w-24 bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LibraryItemSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row">
      <div className="aspect-16/10 w-full bg-gray-200 sm:aspect-auto sm:w-40 sm:min-h-42 md:w-44" />
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          <Bone className="h-3 w-32 bg-gray-100" />
          <Bone className="h-5 w-3/4" />
          <Bone className="h-4 w-1/2 bg-gray-100" />
          <div className="mt-1 max-w-md space-y-1.5">
            <div className="flex justify-between">
              <Bone className="h-3 w-16 bg-gray-100" />
              <Bone className="h-3 w-12 bg-gray-100" />
            </div>
            <Bone className="h-1.5 w-full rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="flex shrink-0 items-center border-t border-gray-100 p-4 sm:w-44 sm:border-l sm:border-t-0 sm:p-5 md:w-48">
          <Bone className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

function PanelSkeleton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200 bg-white', className)}>
      {children}
    </div>
  );
}

export function DashboardPageHeaderSkeleton({
  showAction = false,
  titleWidth = 'w-48',
}: {
  showAction?: boolean;
  titleWidth?: string;
}) {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <div className="min-w-0 border-l-2 border-gray-200 pl-3 sm:pl-4">
        <Bone className={cn('h-7 sm:h-8', titleWidth)} />
        <Bone className="mt-2 h-4 w-64 max-w-full bg-gray-100" />
      </div>
      {showAction ? <Bone className="mt-4 h-10 w-40 rounded-full sm:mt-0" /> : null}
    </div>
  );
}

function FilterFieldSkeleton({ width = 'w-40' }: { width?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', width)}>
      <Bone className="h-3 w-12 bg-gray-100" />
      <Bone className="h-9 w-full rounded-sm bg-gray-100" />
    </div>
  );
}

function PurchasedChapterRowSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row">
      <div className="aspect-16/10 w-full bg-gray-200 sm:aspect-auto sm:w-40 sm:min-h-42 md:w-44" />
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
          <Bone className="h-5 w-3/4" />
          <Bone className="h-4 w-full bg-gray-100" />
          <Bone className="h-4 w-2/3 bg-gray-100" />
        </div>
        <div className="flex shrink-0 items-center border-t border-gray-100 p-4 sm:w-44 sm:border-l sm:border-t-0 sm:p-5 md:w-48">
          <Bone className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** My Series / My Blueprints */
export function DashboardLibraryListSkeleton({
  statCount = 4,
  showFilters = true,
}: {
  statCount?: number;
  showFilters?: boolean;
}) {
  return (
    <PanelSkeleton className="animate-pulse">
      <StatsRowSkeleton count={statCount} />
      {showFilters ? (
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-9 w-24 rounded-full bg-gray-100" />
            ))}
          </div>
          <Bone className="h-4 w-24 bg-gray-100" />
        </div>
      ) : null}
      <div className="space-y-4 p-4 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LibraryItemSkeleton key={i} />
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardHistorySkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <StatsRowSkeleton count={3} />
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
        <Bone className="h-4 w-28 bg-gray-100" />
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LibraryItemSkeleton key={i} />
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardPurchasedSeriesSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <DashboardPageHeaderSkeleton showAction titleWidth="w-56 sm:w-72" />
      <PanelSkeleton>
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PurchasedChapterRowSkeleton key={i} />
          ))}
        </div>
      </PanelSkeleton>
    </div>
  );
}

export function DashboardBlueprintReaderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <DashboardPageHeaderSkeleton showAction titleWidth="w-56" />
      <PanelSkeleton className="p-4 sm:p-6">
        <div className="mb-8 flex items-center gap-4">
          <Bone className="h-3 w-20 bg-gray-100" />
          <Bone className="h-px flex-1 bg-gray-100" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <Bone className="h-1 w-full bg-gray-100" />
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sm:px-8">
            <div className="space-y-2">
              <Bone className="h-4 w-40" />
              <Bone className="h-3 w-24 bg-gray-100" />
            </div>
            <Bone className="h-3 w-16 bg-gray-100" />
          </div>
          <div className="space-y-3 p-6">
            <Bone className="h-4 w-full bg-gray-100" />
            <Bone className="h-4 w-11/12 bg-gray-100" />
            <Bone className="h-4 w-10/12 bg-gray-100" />
            <Bone className="h-4 w-full bg-gray-100" />
            <Bone className="h-4 w-8/12 bg-gray-100" />
            <Bone className="mt-6 h-64 w-full rounded-lg" />
          </div>
        </div>
      </PanelSkeleton>
    </div>
  );
}

export function DashboardProfileSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="sm:hidden">
        <div className="h-16 bg-gray-100" />
        <div className="relative px-4 pb-1 pt-0">
          <div className="-mt-8 rounded-lg border border-gray-100 bg-white p-4">
            <div className="flex items-start gap-3">
              <Bone className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-5 w-32" />
                <Bone className="h-4 w-40 bg-gray-100" />
                <Bone className="h-4 w-36 bg-gray-100" />
              </div>
            </div>
            <Bone className="mt-3 h-6 w-24 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="relative hidden h-24 bg-gray-100 sm:block">
        <Bone className="absolute right-8 bottom-0 h-7 w-28 translate-y-1/2 rounded-full bg-white" />
        <div className="absolute left-8 bottom-0 z-10 flex translate-y-1/2 items-end gap-4 rounded-2xl border border-gray-100 bg-white py-2.5 pl-2.5 pr-5">
          <Bone className="h-16 w-16 rounded-full" />
          <div className="space-y-2 pb-1">
            <Bone className="h-5 w-36" />
            <Bone className="h-3 w-48 bg-gray-100" />
            <Bone className="h-3 w-40 bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-16">
        <div className="mt-2 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
              <div className="flex items-center gap-3">
                <Bone className="h-9 w-9 rounded-md bg-white" />
                <div className="space-y-1.5">
                  <Bone className="h-5 w-8" />
                  <Bone className="h-3 w-16 bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60 sm:mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-b border-gray-200/70 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="flex items-center gap-3">
                <Bone className="h-9 w-9 rounded-md bg-white" />
                <Bone className="h-4 w-28 bg-gray-100" />
              </div>
              <Bone className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </PanelSkeleton>
  );
}

export function DashboardAddressSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="relative rounded-lg border border-gray-200 bg-white p-5">
          {i === 0 ? <Bone className="absolute right-4 top-4 h-6 w-16 rounded-full bg-gray-100" /> : null}
          <div className="flex items-start gap-3 pr-16">
            <Bone className="h-9 w-9 rounded-md" />
            <div className="space-y-2">
              <Bone className="h-5 w-32" />
              <Bone className="h-4 w-28 bg-gray-100" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Bone className="h-4 w-full bg-gray-100" />
            <Bone className="h-4 w-5/6 bg-gray-100" />
            <Bone className="h-4 w-1/3 bg-gray-100" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            <Bone className="h-9 w-20 rounded-full bg-gray-100" />
            <Bone className="h-9 w-20 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSettingsSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex items-start gap-3">
          <Bone className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Bone className="h-5 w-40" />
            <Bone className="h-4 w-64 bg-gray-100" />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Bone className="h-3 w-24 bg-gray-100" />
            <Bone className="h-4 w-48" />
          </div>
          <Bone className="h-10 w-40 rounded-full" />
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Bone className="h-9 w-9 rounded-md bg-gray-100" />
            <div className="space-y-2">
              <Bone className="h-5 w-20" />
              <Bone className="h-4 w-52 bg-gray-100" />
            </div>
          </div>
          <Bone className="h-10 w-28 rounded-full bg-gray-100" />
        </div>
      </div>
    </PanelSkeleton>
  );
}

export function DashboardWishlistSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Bone key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
        <Bone className="h-4 w-24 bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-200">
            <div className="aspect-4/3 w-full bg-gray-200" />
            <div className="space-y-3 p-4">
              <Bone className="h-6 w-24 rounded-full bg-gray-100" />
              <Bone className="h-3 w-32 bg-gray-100" />
              <Bone className="h-5 w-full" />
              <Bone className="h-4 w-2/3 bg-gray-100" />
              <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                <div className="space-y-1.5">
                  <Bone className="h-6 w-20" />
                  <Bone className="h-3 w-24 bg-gray-100" />
                </div>
              </div>
              <Bone className="h-10 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardOrdersSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <Bone className="h-10 w-full rounded-lg bg-gray-100" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterFieldSkeleton width="sm:w-44" />
            <FilterFieldSkeleton />
            <FilterFieldSkeleton />
          </div>
          <Bone className="h-4 w-20 bg-gray-100" />
        </div>
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-48 bg-gray-100" />
              </div>
              <Bone className="h-6 w-16 rounded-full bg-gray-100" />
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <Bone className="h-4 w-40" />
                <Bone className="h-4 w-16 bg-gray-100" />
              </div>
              <div className="flex justify-between">
                <Bone className="h-4 w-32" />
                <Bone className="h-4 w-14 bg-gray-100" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <Bone className="h-6 w-20" />
              <div className="flex gap-2">
                <Bone className="h-9 w-24 rounded-full bg-gray-100" />
                <Bone className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardOrderDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Bone className="h-5 w-32 bg-gray-100" />
      <DashboardPageHeaderSkeleton showAction titleWidth="w-40" />
      <PanelSkeleton className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bone className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Bone className="h-5 w-40" />
              <Bone className="h-4 w-20 bg-gray-100" />
            </div>
          </div>
          <Bone className="h-6 w-16 rounded-full bg-gray-100" />
        </div>
        <Bone className="mt-4 h-9 w-32" />
      </PanelSkeleton>
      {['Billing Address', 'Payment'].map((key) => (
        <PanelSkeleton key={key} className="p-4 sm:p-6">
          <Bone className="mb-4 h-4 w-32" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Bone className="h-3 w-20 bg-gray-100" />
                <Bone className="h-4 w-28" />
              </div>
            ))}
          </div>
        </PanelSkeleton>
      ))}
      <PanelSkeleton className="p-4 sm:p-6">
        <Bone className="mb-4 h-4 w-24" />
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-24 bg-gray-100" />
              </div>
              <Bone className="h-4 w-16" />
            </div>
          ))}
        </div>
      </PanelSkeleton>
      <PanelSkeleton className="p-4 sm:p-6">
        <Bone className="mb-4 h-4 w-28" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Bone className="h-4 w-20 bg-gray-100" />
              <Bone className="h-4 w-16" />
            </div>
          ))}
        </div>
      </PanelSkeleton>
    </div>
  );
}

export function DashboardReviewsSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterFieldSkeleton width="sm:w-44" />
            <FilterFieldSkeleton />
            <FilterFieldSkeleton />
          </div>
          <Bone className="h-4 w-24 bg-gray-100" />
        </div>
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-32 bg-gray-100" />
              </div>
              <Bone className="h-6 w-20 rounded-full bg-gray-100" />
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Bone key={s} className="h-3.5 w-3.5 rounded-sm bg-gray-100" />
              ))}
            </div>
            <Bone className="mt-3 h-4 w-full bg-gray-100" />
            <Bone className="mt-2 h-4 w-4/5 bg-gray-100" />
          </div>
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardFollowedMentorsSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <Bone className="h-10 w-full rounded-lg bg-gray-100" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterFieldSkeleton />
            <FilterFieldSkeleton />
          </div>
          <Bone className="h-4 w-32 bg-gray-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
            <div className="h-24 bg-gray-200" />
            <div className="flex flex-col items-center px-6 pb-6 text-center">
              <Bone className="-mt-10 mb-3 h-20 w-20 rounded-full border-4 border-white" />
              <Bone className="h-5 w-32" />
              <Bone className="mt-2 h-3 w-24 bg-gray-100" />
              <Bone className="mt-3 h-4 w-full bg-gray-100" />
              <Bone className="mt-1 h-4 w-4/5 bg-gray-100" />
              <div className="mt-5 flex w-full items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-2">
                  <Bone className="h-8 w-8 rounded-full bg-gray-100" />
                  <Bone className="h-8 w-8 rounded-full bg-gray-100" />
                </div>
                <Bone className="h-4 w-20 bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelSkeleton>
  );
}

export function DashboardReferralsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <PanelSkeleton className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Bone className="h-3 w-32 bg-gray-100" />
            <Bone className="h-6 w-40" />
          </div>
          <Bone className="h-10 w-32 rounded-full bg-gray-100" />
        </div>
      </PanelSkeleton>
      <PanelSkeleton>
        <StatsRowSkeleton count={4} />
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <FilterFieldSkeleton width="sm:w-44" />
          <Bone className="h-4 w-24 bg-gray-100" />
        </div>
        <div className="space-y-3 p-4 sm:p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-gray-200 p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Bone className="h-4 w-32" />
                  <Bone className="h-3 w-40 bg-gray-100" />
                </div>
                <Bone className="h-6 w-20 rounded-full bg-gray-100" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="space-y-1.5">
                    <Bone className="h-3 w-16 bg-gray-100" />
                    <Bone className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PanelSkeleton>
    </div>
  );
}

export function DashboardReferralWalletSkeleton() {
  return (
    <PanelSkeleton className="animate-pulse">
      <StatsRowSkeleton count={4} />
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <FilterFieldSkeleton width="sm:w-44" />
        <Bone className="h-4 w-20 bg-gray-100" />
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-40 bg-gray-100" />
              </div>
              <Bone className="h-6 w-16 rounded-full bg-gray-100" />
            </div>
            <Bone className="mt-3 h-4 w-full bg-gray-100" />
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <Bone className="h-3 w-16 bg-gray-100" />
                  <Bone className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelSkeleton>
  );
}
