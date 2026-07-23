'use client';

import { Book, CalendarDays, Eye, FileText, Flag, GraduationCap, Shield, ShoppingCart, Sparkles, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPanel,
  AdminSectionHeader,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import { DashboardWelcomeHeader } from './DashboardWelcomeHeader';
import { DashboardStatsGrid, type StatCard } from './DashboardStatsGrid';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardTopContent } from './DashboardTopContent';
import type { ContentMode } from '@/types/admin';
import {
  useGetAdminGlobalSettingsQuery,
  useGetAdminProfileQuery,
} from '@/store/rtkQueries/adminGetApi';
import {
  useGetAdminDashboardQuery,
  useGetBlueprintPerformanceQuery,
  useGetBlueprintRevenueQuery,
  useGetSalesVolumeQuery,
} from '@/store/rtkQueries/dashboard';
import { getAdminSectionRoutePath } from '@/routes/routes';
import { formatKes } from '@/constants/common';

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

  const { data: dashboardData, isLoading: dashboardLoading } = useGetAdminDashboardQuery();
  const statsData = dashboardData?.data;

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

  const stats: StatCard[] = [
    {
      title: 'Total users',
      value: (statsData?.total_users ?? 0).toLocaleString(),
      icon: Users,
      color: 'blue',
      href: getAdminSectionRoutePath('users'),
    },
    {
      title: 'Total mentors',
      value: (statsData?.total_mentors ?? 0).toLocaleString(),
      icon: GraduationCap,
      color: 'green',
      href: getAdminSectionRoutePath('authors'),
    },
    {
      title: 'Institutional staff',
      value: (statsData?.institutional_staff ?? 0).toLocaleString(),
      icon: Shield,
      color: 'purple',
      href: getAdminSectionRoutePath('roles_permissions'),
    },
    {
      title: contentMode === 'chapters' ? 'Total blueprints' : 'Total series',
      value: contentMode === 'chapters'
        ? (statsData?.total_blueprints ?? 0).toLocaleString()
        : (statsData?.total_series ?? 0).toLocaleString(),
      icon: contentMode === 'chapters' ? FileText : Book,
      color: 'orange',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'chapters' : 'books'),
    },
    {
      title: contentMode === 'chapters' ? 'Total series' : 'Total blueprints',
      value: contentMode === 'chapters'
        ? (statsData?.total_series ?? 0).toLocaleString()
        : (statsData?.total_blueprints ?? 0).toLocaleString(),
      icon: contentMode === 'chapters' ? Book : FileText,
      color: 'blue',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'books' : 'chapters'),
    },
    {
      title: 'Flagged content',
      value: (statsData?.flagged_content ?? 0).toLocaleString(),
      icon: Flag,
      color: 'orange',
      href: `${getAdminSectionRoutePath('chapters')}?isContentFlagged=true`,
    },
  ];

  const performanceSummary = performanceData?.data?.summary;
  const topPerformingBlueprints = performanceData?.data?.data?.data ?? [];

  const salesVolumeSummary = salesVolumeData?.data?.summary;
  const salesByMonth = salesVolumeData?.data?.data?.data ?? [];

  const revenueSummary = revenueData?.data?.summary;
  const topEarningBlueprints = revenueData?.data?.data?.data ?? [];

  return (
    <AdminPage>
      <DashboardWelcomeHeader userName={userName} contentMode={contentMode} />
      <DashboardStatsGrid stats={stats} isLoading={dashboardLoading} />

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
                      <td className="py-3 text-right text-slate-900">{formatKes(row.revenue)}</td>
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
            <AdminStatCard label="Earned" value={formatKes(revenueSummary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
            <AdminStatCard label="Pending" value={formatKes(revenueSummary?.totalPending ?? 0)} icon={TrendingUp} tone="orange" />
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
                      <td className="py-3 text-right text-slate-900">{formatKes(row.earned)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanel>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardRecentActivity items={[]} />
        <DashboardTopContent items={[]} contentMode={contentMode} />
      </div>
    </AdminPage>
  );
}
