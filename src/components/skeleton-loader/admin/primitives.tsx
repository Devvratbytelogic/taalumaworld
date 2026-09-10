import type { ReactNode } from 'react';
import { cn } from '@/components/ui/utils';

export const adminSkeletonPanelClass =
  'admin-surface rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]';

export function Bone({ className }: { className?: string }) {
  return <div className={cn('rounded-md bg-slate-200', className)} />;
}

export function AdminPageSkeleton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('animate-pulse space-y-6', className)}>{children}</div>;
}

export function AdminPageHeaderSkeleton({
  showAction = false,
  showEyebrow = false,
  titleWidth = 'w-56',
  descriptionWidth = 'w-80',
}: {
  showAction?: boolean;
  showEyebrow?: boolean;
  titleWidth?: string;
  descriptionWidth?: string;
}) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'p-6')}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {showEyebrow ? <Bone className="mb-2 h-3 w-24 bg-slate-100" /> : null}
          <Bone className={cn('h-8', titleWidth)} />
          <Bone className={cn('mt-2 h-4 max-w-full bg-slate-100', descriptionWidth)} />
        </div>
        {showAction ? <Bone className="h-10 w-36 rounded-lg" /> : null}
      </div>
    </div>
  );
}

export function AdminSearchPanelSkeleton({ filters = 0 }: { filters?: number }) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'animate-pulse space-y-4 p-5')}>
      <Bone className="h-10 w-full rounded-md bg-slate-100" />
      {filters > 0 ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: filters }).map((_, i) => (
            <Bone key={i} className="h-9 w-40 rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AdminStatCardsSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const columns =
    count === 3
      ? 'sm:grid-cols-3'
      : count === 2
        ? 'sm:grid-cols-2'
        : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={cn('grid grid-cols-1 gap-4', columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(adminSkeletonPanelClass, 'p-5')}>
          <div className="flex items-center gap-3">
            <Bone className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Bone className="h-3 w-20 bg-slate-100" />
              <Bone className="h-7 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({
  rows = 8,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'animate-pulse overflow-hidden')}>
      <div className="flex gap-4 border-b border-slate-100 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Bone key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-3.5 last:border-0"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Bone
              key={j}
              className={cn('h-4 flex-1', j === 0 ? 'bg-slate-200' : 'bg-slate-100')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminTabBarSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'flex flex-wrap gap-1 p-1.5')}>
      {Array.from({ length: count }).map((_, i) => (
        <Bone key={i} className="h-10 w-36 rounded-lg" />
      ))}
    </div>
  );
}

export function AdminFormPanelSkeleton({
  fields = 6,
  columns = 2,
  showHeading = true,
}: {
  fields?: number;
  columns?: 1 | 2;
  showHeading?: boolean;
}) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'animate-pulse space-y-6 p-6 sm:p-8')}>
      {showHeading ? (
        <div className="flex items-center gap-3">
          <Bone className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Bone className="h-5 w-48" />
            <Bone className="h-3 w-64 bg-slate-100" />
          </div>
        </div>
      ) : null}
      <div className={cn('grid grid-cols-1 gap-6', columns === 2 && 'md:grid-cols-2')}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Bone className="h-3 w-24" />
            <Bone className="h-10 w-full rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Bone className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function AdminBackLinkSkeleton() {
  return <Bone className="h-5 w-36 bg-slate-100" />;
}

export function AdminDetailPanelsSkeleton({
  panels = 3,
  fields = 6,
}: {
  panels?: number;
  fields?: number;
}) {
  return (
    <>
      {Array.from({ length: panels }).map((_, i) => (
        <div key={i} className={cn(adminSkeletonPanelClass, 'p-6')}>
          <Bone className="mb-4 h-4 w-32" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: fields }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Bone className="h-3 w-20 bg-slate-100" />
                <Bone className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function AdminChartPanelSkeleton() {
  return (
    <div className={cn(adminSkeletonPanelClass, 'p-5')}>
      <div className="mb-5 flex items-center justify-between">
        <Bone className="h-5 w-40" />
        <Bone className="h-8 w-24 rounded-lg bg-slate-100" />
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Bone className="h-3 w-16 bg-slate-100" />
            <Bone className="h-4 w-20" />
          </div>
        ))}
      </div>
      <Bone className="h-64 w-full rounded-lg bg-slate-100" />
    </div>
  );
}

export function AdminPreviewSectionSkeleton({
  statCount = 4,
  rows = 5,
}: {
  statCount?: number;
  rows?: number;
}) {
  return (
    <div className={cn(adminSkeletonPanelClass, 'p-5')}>
      <div className="mb-5 flex items-center justify-between">
        <Bone className="h-5 w-44" />
        <Bone className="h-4 w-16 bg-slate-100" />
      </div>
      <AdminStatCardsSkeleton count={statCount} className="mb-5" />
      <AdminTableSkeleton rows={rows} columns={5} />
    </div>
  );
}

export function AdminListPageSkeleton({
  showEyebrow = false,
  showAction = false,
  titleWidth,
  descriptionWidth,
  filters = 0,
  tabs,
  statCount,
  extra,
  tableRows = 8,
  tableColumns = 6,
}: {
  showEyebrow?: boolean;
  showAction?: boolean;
  titleWidth?: string;
  descriptionWidth?: string;
  filters?: number;
  tabs?: number;
  statCount?: number;
  extra?: ReactNode;
  tableRows?: number;
  tableColumns?: number;
}) {
  return (
    <AdminPageSkeleton>
      <AdminPageHeaderSkeleton
        showAction={showAction}
        showEyebrow={showEyebrow}
        titleWidth={titleWidth}
        descriptionWidth={descriptionWidth}
      />
      {tabs ? <AdminTabBarSkeleton count={tabs} /> : null}
      {statCount ? <AdminStatCardsSkeleton count={statCount} /> : null}
      {extra}
      <AdminSearchPanelSkeleton filters={filters} />
      <AdminTableSkeleton rows={tableRows} columns={tableColumns} />
    </AdminPageSkeleton>
  );
}

export function AdminDetailPageSkeleton({
  panels = 3,
  fields = 6,
  showTable = false,
  showImage = false,
}: {
  panels?: number;
  fields?: number;
  showTable?: boolean;
  showImage?: boolean;
}) {
  return (
    <AdminPageSkeleton>
      <AdminBackLinkSkeleton />
      <AdminPageHeaderSkeleton showAction />
      {showImage ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className={cn(adminSkeletonPanelClass, 'p-6 xl:col-span-1')}>
            <Bone className="aspect-3/4 w-full rounded-xl" />
            <div className="mt-4 space-y-2">
              <Bone className="h-4 w-3/4" />
              <Bone className="h-3 w-1/2 bg-slate-100" />
            </div>
          </div>
          <div className="space-y-6 xl:col-span-2">
            <AdminDetailPanelsSkeleton panels={Math.max(panels - 1, 1)} fields={fields} />
          </div>
        </div>
      ) : (
        <AdminDetailPanelsSkeleton panels={panels} fields={fields} />
      )}
      {showTable ? <AdminTableSkeleton rows={5} columns={4} /> : null}
    </AdminPageSkeleton>
  );
}
