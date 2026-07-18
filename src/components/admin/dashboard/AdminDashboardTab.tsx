'use client';

import { Book, CalendarDays, Eye, FileText, GraduationCap, Shield, ShoppingCart, Sparkles, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPanel,
  AdminSectionHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { DashboardWelcomeHeader } from './DashboardWelcomeHeader';
import { DashboardStatsGrid, type StatCard } from './DashboardStatsGrid';
import { DashboardRecentActivity, type ActivityItem } from './DashboardRecentActivity';
import { DashboardTopContent, type TopContentItem } from './DashboardTopContent';
import type { ContentMode } from '@/types/admin';
import {
  useGetAdminGlobalSettingsQuery,
  useGetAdminProfileQuery,
  useGetAllAdminChaptersQuery,
  useGetAllBooksQuery,
} from '@/store/rtkQueries/adminGetApi';
import { useGetAllUsersQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import {
  useGetBlueprintPerformanceQuery,
  useGetBlueprintRevenueQuery,
  useGetSalesVolumeQuery,
} from '@/store/rtkQueries/dashboard';
import { getAdminSectionRoutePath } from '@/routes/routes';

function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

const MS_30D = 30 * 24 * 60 * 60 * 1000;

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/** Count of dates within the last 30 days — used as the "change" indicator on stat cards. */
function countRecent(dates: string[]): number {
  const now = Date.now();
  return dates.filter((d) => now - new Date(d).getTime() < MS_30D).length;
}

/** Percent change: dates in the last 30d vs the 30d before that. */
function calcGrowthPercent(dates: string[]): number {
  const now = Date.now();
  const recent = dates.filter((d) => now - new Date(d).getTime() < MS_30D).length;
  const previous = dates.filter((d) => {
    const age = now - new Date(d).getTime();
    return age >= MS_30D && age < 2 * MS_30D;
  }).length;
  if (previous === 0) return recent > 0 ? 100 : 0;
  return Math.round(((recent - previous) / previous) * 1000) / 10;
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardTab() {
  const { data: profileData } = useGetAdminProfileQuery();
  const userName = profileData?.data?.name ?? 'Admin';

  const { data: globalSettingsData } = useGetAdminGlobalSettingsQuery();
  const contentMode: ContentMode = globalSettingsData?.data?.visible === 'book' ? 'books' : 'chapters';

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ user_type: 'user' });
  const { data: mentorsData, isLoading: mentorsLoading } = useGetAllUsersQuery({ user_type: 'mentor' });
  const { data: staffData, isLoading: staffLoading } = useGetAllUsersQuery({ user_type: 'staff' });
  const { data: booksData, isLoading: booksLoading } = useGetAllBooksQuery();
  const { data: chaptersData, isLoading: chaptersLoading } = useGetAllAdminChaptersQuery();

  /** Admin & Mentor shared metrics */
  const {
    data: performanceData,
    isLoading: performanceLoading,
    isError: performanceError,
  } = useGetBlueprintPerformanceQuery();
  const {
    data: salesVolumeData,
    isLoading: salesVolumeLoading,
    isError: salesVolumeError,
  } = useGetSalesVolumeQuery();
  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useGetBlueprintRevenueQuery();

  const isLoading = usersLoading || mentorsLoading || staffLoading || booksLoading || chaptersLoading;

  const allUsers = usersData?.data?.data ?? [];
  const allMentors = mentorsData?.data?.data ?? [];
  const allStaff = staffData?.data?.data ?? [];
  const allBooks = booksData?.data?.data ?? [];
  const allChapters = chaptersData?.data?.data ?? [];

  const totalUsers = usersData?.data?.total ?? allUsers.length;
  const totalMentors = mentorsData?.data?.total ?? allMentors.length;
  const totalStaff = staffData?.data?.total ?? allStaff.length;
  const totalBooks = booksData?.data?.total ?? allBooks.length;
  const totalChapters = chaptersData?.data?.total ?? allChapters.length;

  const userGrowth = calcGrowthPercent(allUsers.map((u) => u.createdAt));
  const mentorGrowth = calcGrowthPercent(allMentors.map((m) => m.createdAt));
  const staffGrowth = calcGrowthPercent(allStaff.map((s) => s.createdAt));
  const recentChapters = countRecent(allChapters.map((c) => c.createdAt));
  const recentBooks = countRecent(allBooks.map((b) => b.createdAt));

  const stats: StatCard[] = [
    {
      title: 'Total users',
      value: totalUsers.toLocaleString(),
      change: userGrowth,
      icon: Users,
      color: 'blue',
      href: getAdminSectionRoutePath('users'),
    },
    {
      title: 'Total mentors',
      value: totalMentors.toLocaleString(),
      change: mentorGrowth,
      icon: GraduationCap,
      color: 'green',
      href: getAdminSectionRoutePath('authors'),
    },
    {
      title: 'Institutional staff',
      value: totalStaff.toLocaleString(),
      change: staffGrowth,
      icon: Shield,
      color: 'purple',
      href: getAdminSectionRoutePath('roles_permissions'),
    },
    {
      title: contentMode === 'chapters' ? 'Total blueprints' : 'Total series',
      value: contentMode === 'chapters' ? totalChapters : totalBooks,
      change: contentMode === 'chapters' ? recentChapters : recentBooks,
      icon: contentMode === 'chapters' ? FileText : Book,
      color: 'orange',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'chapters' : 'books'),
    },
    {
      title: contentMode === 'chapters' ? 'Total series' : 'Total blueprints',
      value: contentMode === 'chapters' ? totalBooks : totalChapters,
      change: contentMode === 'chapters' ? recentBooks : recentChapters,
      icon: contentMode === 'chapters' ? Book : FileText,
      color: 'blue',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'books' : 'chapters'),
    },
  ];

  const recentActivity: ActivityItem[] = [...allUsers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((user, idx) => ({
      id: idx + 1,
      user: user.name,
      action: 'registered',
      item: '',
      time: timeAgo(user.createdAt),
    }));

  const topContentSource = contentMode === 'chapters' ? allChapters : allBooks;
  const topContent: TopContentItem[] = [...topContentSource]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map((item, idx) => ({
      id: idx + 1,
      title: item.title,
      sales: 0,
      revenue: item.price,
      trend: 0,
    }));

  const performanceSummary = performanceData?.data?.summary;
  const topPerformingBlueprints = performanceData?.data?.data?.data ?? [];

  const salesVolumeSummary = salesVolumeData?.data?.summary;
  const salesByMonth = salesVolumeData?.data?.data?.data ?? [];

  const revenueSummary = revenueData?.data?.summary;
  const topEarningBlueprints = revenueData?.data?.data?.data ?? [];

  return (
    <AdminPage>
      <DashboardWelcomeHeader userName={userName} contentMode={contentMode} />
      <DashboardStatsGrid stats={stats} isLoading={isLoading} />

      <AdminPanel>
        <AdminSectionHeader title="Blueprint performance" />
        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <AdminStatCard label="Total views" value={(performanceSummary?.totalViews ?? 0).toLocaleString()} icon={Eye} tone="blue" />
          <AdminStatCard label="Total sales" value={performanceSummary?.totalSales ?? 0} icon={ShoppingCart} tone="green" />
          <AdminStatCard label="Avg. conversion" value={`${performanceSummary?.avgConversion ?? 0}%`} icon={TrendingUp} tone="purple" />
          <AdminStatCard label="High Value blueprints" value={performanceSummary?.highValueBlueprints ?? 0} icon={Sparkles} tone="orange" />
        </div>
        <AdminTableShell>
          {performanceLoading ? (
            <TableSkeleton columns={5} />
          ) : performanceError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint performance right now.</p>
          ) : topPerformingBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No performance data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                    <th className="px-5 py-3 font-medium">Blueprint</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Views</th>
                    <th className="px-5 py-3 font-medium">Sales</th>
                    <th className="px-5 py-3 font-medium">Conversion</th>
                    <th className="px-5 py-3 font-medium text-right">Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformingBlueprints.slice(0, 5).map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-4 font-medium text-slate-900">{row.title}</td>
                      <td className="px-5 py-4 text-slate-600">{row.status}</td>
                      <td className="px-5 py-4 text-slate-600">{row.views.toLocaleString()}</td>
                      <td className="px-5 py-4 text-slate-600">{row.sales}</td>
                      <td className="px-5 py-4 text-slate-600">{row.conversion}%</td>
                      <td className="px-5 py-4 text-right text-slate-900">{row.classification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminTableShell>
      </AdminPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminPanel>
          <AdminSectionHeader title="Sales volume" />
          <div className="mb-5 grid grid-cols-2 gap-4">
            <AdminStatCard label="This month" value={salesVolumeSummary?.thisMonth ?? 0} icon={CalendarDays} tone="blue" />
            <AdminStatCard label="Last month" value={salesVolumeSummary?.lastMonth ?? 0} icon={ShoppingCart} tone="green" />
          </div>
          {salesVolumeLoading ? (
            <TableSkeleton columns={3} />
          ) : salesVolumeError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load sales volume right now.</p>
          ) : salesByMonth.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No sales data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 font-medium">Month</th>
                    <th className="pb-3 font-medium">Sales</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByMonth.slice(0, 5).map((row) => (
                    <tr key={row.month} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-slate-900">{row.month}</td>
                      <td className="py-3 text-slate-600">{row.sales}</td>
                      <td className="py-3 text-right text-slate-900">{formatKsh(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanel>

        <AdminPanel>
          <AdminSectionHeader title="Blueprint revenue" />
          <div className="mb-5 grid grid-cols-2 gap-4">
            <AdminStatCard label="Earned" value={formatKsh(revenueSummary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
            <AdminStatCard label="Pending" value={formatKsh(revenueSummary?.totalPending ?? 0)} icon={TrendingUp} tone="orange" />
          </div>
          {revenueLoading ? (
            <TableSkeleton columns={3} />
          ) : revenueError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint revenue right now.</p>
          ) : topEarningBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No revenue data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 font-medium">Blueprint</th>
                    <th className="pb-3 font-medium">Sales</th>
                    <th className="pb-3 font-medium text-right">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {topEarningBlueprints.slice(0, 5).map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-slate-900">{row.title}</td>
                      <td className="py-3 text-slate-600">{row.sales}</td>
                      <td className="py-3 text-right text-slate-900">{formatKsh(row.earned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanel>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardRecentActivity items={recentActivity} isLoading={usersLoading} />
        <DashboardTopContent
          items={topContent}
          contentMode={contentMode}
          isLoading={chaptersLoading || booksLoading}
        />
      </div>
    </AdminPage>
  );
}
