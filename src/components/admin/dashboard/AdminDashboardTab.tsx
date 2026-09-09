'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Book, CalendarDays, ClipboardCheck, Eye, FileText, Flag, GraduationCap, Shield, ShoppingCart, Sparkles, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  AdminPage,
  AdminPanel,
  AdminSectionHeader,
  AdminStatCard,
  AdminTableShell,
  AdminTextLink,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { DashboardWelcomeHeader } from './DashboardWelcomeHeader';
import { DashboardStatsGrid, type StatCard } from './DashboardStatsGrid';
import { DashboardMentorActions } from './DashboardMentorActions';
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
  useGetMentorPerformanceQuery,
  useGetSalesVolumeQuery,
  type IDashboardDateRangeParams,
} from '@/store/rtkQueries/dashboard';
import { getAdminMentorPerformanceRoutePath, getAdminMentorRevenueRoutePath, getAdminSectionRoutePath } from '@/routes/routes';
import { DashboardCharts } from './DashboardCharts';
import { formatKes } from '@/constants/common';

const CURRENT_YEAR = new Date().getFullYear();
const PREVIEW_PAGINATION_MODEL = { page: 0, pageSize: 5 };
const noopPaginationChange = () => { };

function getOverviewParams(year: string, fromDate: string, toDate: string): IDashboardDateRangeParams {
  if (fromDate && toDate) return { fromDate, toDate };
  if (year) return { year: Number(year) };
  return {};
}

const mentorPerformanceColumns: GridColDef[] = [
  { field: 'rank', headerName: 'Rank', width: 80, sortable: false },
  { field: 'name', headerName: 'Mentor', flex: 1, minWidth: 160, sortable: false },
  {
    field: 'sales',
    headerName: 'Sales',
    width: 100,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  {
    field: 'revenue',
    headerName: 'Revenue',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'mentorShare',
    headerName: 'Mentor share',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'avgAiScore',
    headerName: 'AI score',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value == null ? '—' : Number(params.value).toFixed(2)),
  },
];

const blueprintPerformanceColumns: GridColDef[] = [
  { field: 'title', headerName: 'Blueprint', flex: 1, minWidth: 160, sortable: false },
  { field: 'status', headerName: 'Status', width: 130, sortable: false },
  {
    field: 'views',
    headerName: 'Views',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  { field: 'sales', headerName: 'Sales', width: 90, sortable: false },
  {
    field: 'conversion',
    headerName: 'Conversion',
    width: 120,
    sortable: false,
    renderCell: (params) => `${params.value ?? 0}%`,
  },
  { field: 'classification', headerName: 'Classification', width: 160, sortable: false },
];

const salesVolumeColumns: GridColDef[] = [
  { field: 'month', headerName: 'Month', flex: 1, minWidth: 140, sortable: false },
  { field: 'sales', headerName: 'Sales', width: 100, sortable: false },
  {
    field: 'revenue',
    headerName: 'Revenue',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
];

const blueprintRevenueColumns: GridColDef[] = [
  { field: 'title', headerName: 'Blueprint', flex: 1, minWidth: 160, sortable: false },
  { field: 'sales', headerName: 'Sales', width: 90, sortable: false },
  {
    field: 'earned',
    headerName: 'Earned',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
];

export default function AdminDashboardTab() {
  const { data: profileData } = useGetAdminProfileQuery();
  const userName = profileData?.data?.name ?? 'Admin';

  const { data: globalSettingsData } = useGetAdminGlobalSettingsQuery();
  const contentMode: ContentMode = globalSettingsData?.data?.visible === 'book' ? 'books' : 'chapters';

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const dateRangeParams = {
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  };
  const overviewParams = getOverviewParams(year, fromDate, toDate);
  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
  };

  const { data: dashboardData, isLoading: dashboardLoading } = useGetAdminDashboardQuery(overviewParams);
  const statsData = dashboardData?.data;

  const {
    data: performanceData,
    isLoading: performanceLoading,
    isError: performanceError,
  } = useGetBlueprintPerformanceQuery({ page: 1, limit: 5, ...dateRangeParams });
  const {
    data: salesVolumeData,
    isLoading: salesVolumeLoading,
    isError: salesVolumeError,
  } = useGetSalesVolumeQuery({ page: 1, limit: 5, ...dateRangeParams });
  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useGetBlueprintRevenueQuery({ page: 1, limit: 5, ...dateRangeParams });
  const {
    data: mentorPerformanceData,
    isLoading: mentorPerformanceLoading,
    isError: mentorPerformanceError,
  } = useGetMentorPerformanceQuery({
    ...dateRangeParams,
    page: 1,
    limit: 5,
  });

  const stats: StatCard[] = [
    {
      title: 'Platform earning',
      value: formatKes(statsData?.platform_total_earning ?? 0),
      icon: Wallet,
      color: 'green',
      href: getAdminMentorRevenueRoutePath(),
    },
    {
      title: 'Total customers',
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
      title: 'Staff',
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
    {
      title: 'Blueprints to review',
      value: (statsData?.reviewBlueprint ?? 0).toLocaleString(),
      icon: ClipboardCheck,
      color: 'purple',
      href: `${getAdminSectionRoutePath('chapters')}?reviewBlueprint=true`,
    },
  ];

  const performanceSummary = performanceData?.data?.summary;
  const topPerformingBlueprints = performanceData?.data?.data?.data ?? [];

  const salesVolumeSummary = salesVolumeData?.data?.summary;
  const salesByMonth = (salesVolumeData?.data?.data?.data ?? []).map((row, idx) => ({
    ...row,
    id: `${row.month}-${idx}`,
  }));

  const revenueSummary = revenueData?.data?.summary;
  const topEarningBlueprints = revenueData?.data?.data?.data ?? [];

  const mentorPerformanceSummary = mentorPerformanceData?.data?.summary;
  const topMentors = mentorPerformanceData?.data?.data?.data ?? [];

  return (
    <AdminPage>
      <DashboardWelcomeHeader
        userName={userName}
        contentMode={contentMode}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onClearDateFilter={clearDateFilter}
      />

      <DashboardStatsGrid stats={stats} isLoading={dashboardLoading} />

      <DashboardMentorActions stats={statsData} isLoading={dashboardLoading} />

      <DashboardCharts
        year={year}
        onYearChange={setYear}
        filterParams={overviewParams}
      />

      <AdminPanel>
        <AdminSectionHeader
          title="Mentor performance"
          action={<AdminTextLink href={getAdminMentorPerformanceRoutePath()}>View all</AdminTextLink>}
        />
        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <AdminStatCard label="Mentors" value={(mentorPerformanceSummary?.mentors ?? 0).toLocaleString()} icon={GraduationCap} tone="blue" />
          <AdminStatCard label="Total sales" value={(mentorPerformanceSummary?.totalSales ?? 0).toLocaleString()} icon={ShoppingCart} tone="green" />
          <AdminStatCard label="Total revenue" value={formatKes(mentorPerformanceSummary?.totalRevenue ?? 0)} icon={Wallet} tone="purple" />
          <AdminStatCard label="Avg. AI score" value={mentorPerformanceSummary?.avgAiScore != null ? Number(mentorPerformanceSummary.avgAiScore).toFixed(2) : '—'} icon={Sparkles} tone="orange" />
        </div>
        <AdminTableShell>
          {mentorPerformanceError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load mentor performance right now.</p>
          ) : !mentorPerformanceLoading && topMentors.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No mentor performance data available yet.</p>
          ) : (
            <CommonDataTable
              rows={topMentors}
              columns={mentorPerformanceColumns}
              getRowId={(row) => row.id}
              loading={mentorPerformanceLoading}
              paginationMode="client"
              paginationModel={PREVIEW_PAGINATION_MODEL}
              onPaginationModelChange={noopPaginationChange}
              hideFooter
            />
          )}
        </AdminTableShell>
      </AdminPanel>

      <AdminPanel>
        <AdminSectionHeader title="Blueprint performance" />
        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <AdminStatCard label="Total views" value={(performanceSummary?.totalViews ?? 0).toLocaleString()} icon={Eye} tone="blue" />
          <AdminStatCard label="Total sales" value={performanceSummary?.totalSales ?? 0} icon={ShoppingCart} tone="green" />
          <AdminStatCard label="Avg. conversion" value={`${performanceSummary?.avgConversion ?? 0}%`} icon={TrendingUp} tone="purple" />
          <AdminStatCard label="High Value blueprints" value={performanceSummary?.highValueBlueprints ?? 0} icon={Sparkles} tone="orange" />
        </div>
        <AdminTableShell>
          {performanceError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint performance right now.</p>
          ) : !performanceLoading && topPerformingBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No performance data available yet.</p>
          ) : (
            <CommonDataTable
              rows={topPerformingBlueprints}
              columns={blueprintPerformanceColumns}
              getRowId={(row) => row.id}
              loading={performanceLoading}
              paginationMode="client"
              paginationModel={PREVIEW_PAGINATION_MODEL}
              onPaginationModelChange={noopPaginationChange}
              hideFooter
            />
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
          {salesVolumeError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load sales volume right now.</p>
          ) : !salesVolumeLoading && salesByMonth.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No sales data available yet.</p>
          ) : (
            <AdminTableShell>
              <CommonDataTable
                rows={salesByMonth}
                columns={salesVolumeColumns}
                getRowId={(row) => row.id}
                loading={salesVolumeLoading}
                paginationMode="client"
                paginationModel={PREVIEW_PAGINATION_MODEL}
                onPaginationModelChange={noopPaginationChange}
                hideFooter
              />
            </AdminTableShell>
          )}
        </AdminPanel>

        <AdminPanel>
          <AdminSectionHeader title="Blueprint revenue" />
          <div className="mb-5 grid grid-cols-2 gap-4">
            <AdminStatCard label="Earned" value={formatKes(revenueSummary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
            <AdminStatCard label="Pending" value={formatKes(revenueSummary?.totalPending ?? 0)} icon={TrendingUp} tone="orange" />
          </div>
          {revenueError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint revenue right now.</p>
          ) : !revenueLoading && topEarningBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No revenue data available yet.</p>
          ) : (
            <AdminTableShell>
              <CommonDataTable
                rows={topEarningBlueprints}
                columns={blueprintRevenueColumns}
                getRowId={(row) => row.id}
                loading={revenueLoading}
                paginationMode="client"
                paginationModel={PREVIEW_PAGINATION_MODEL}
                onPaginationModelChange={noopPaginationChange}
                hideFooter
              />
            </AdminTableShell>
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
