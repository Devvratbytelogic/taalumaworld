import { DashboardPageHeaderSkeleton, DashboardLibraryListSkeleton } from './userDashboardSkeletons';

/** Fallback while a dashboard page is suspending. */
export default function UserDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardPageHeaderSkeleton />
      <DashboardLibraryListSkeleton />
    </div>
  );
}
