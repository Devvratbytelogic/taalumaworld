'use client';
import { type GridColDef } from '@mui/x-data-grid';
import {
  CalendarDays,
  Percent,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  AdminPage,
  AdminPanel,
  AdminSectionHeader,
  AdminStatCard,
  AdminTableShell,
  AdminTextLink,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { MentorVerificationHeader } from '@/components/admin/mentor/dashboard/MentorVerificationHeader';
import { formatKes } from '@/components/admin/mentor/data/mentorPerformanceData';
import {
  useGetBlueprintPerformanceQuery,
  useGetBlueprintRevenueQuery,
  useGetMentorEconomyRevenueQuery,
  useGetSalesVolumeQuery,
} from '@/store/rtkQueries/dashboard';
import {
  getMentorBlueprintPerformanceRoutePath,
  getMentorRevenueEarnedRoutePath,
  getMentorRevenuePendingRoutePath,
  getMentorSalesVolumeRoutePath,
} from '@/routes/routes';

/** Dashboard previews are static (no in-grid paging) — "View all" links to the full, paginated list. */
const PREVIEW_PAGINATION_MODEL = { page: 0, pageSize: 5 };
const noopPaginationChange = () => {};

const performanceColumns: GridColDef[] = [
  { field: 'title', headerName: 'Blueprint', flex: 1, minWidth: 160, sortable: false },
  { field: 'status', headerName: 'Status', width: 130, sortable: false },
  { field: 'sales', headerName: 'Sales', width: 90, sortable: false },
  {
    field: 'conversion',
    headerName: 'Conversion',
    width: 110,
    sortable: false,
    renderCell: (params) => `${params.value}%`,
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

const mentorEconomyRevenueColumns: GridColDef[] = [
  { field: 'month', headerName: 'Month', flex: 1, minWidth: 140, sortable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    width: 130,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'discount',
    headerName: 'Discount',
    width: 130,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'platformShare',
    headerName: 'Platform share',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
  {
    field: 'yourShare',
    headerName: 'Your share',
    width: 140,
    sortable: false,
    renderCell: (params) => formatKes(params.value ?? 0),
  },
];

export function MentorDashboardTab() {
  const {
    data: blueprintPerformanceData,
    isLoading: performanceLoading,
    isError: performanceError,
  } = useGetBlueprintPerformanceQuery({ page: 1, limit: 5 });
  const {
    data: salesVolumeData,
    isLoading: salesVolumeLoading,
    isError: salesVolumeError,
  } = useGetSalesVolumeQuery({ page: 1, limit: 5 });
  const {
    data: revenueEarnedData,
    isLoading: revenueEarnedLoading,
    isError: revenueEarnedError,
  } = useGetBlueprintRevenueQuery({ page: 1, limit: 5 });
  const {
    data: revenuePendingData,
    isLoading: revenuePendingLoading,
    isError: revenuePendingError,
  } = useGetMentorEconomyRevenueQuery({ page: 1, limit: 5 });

  const performanceSummary = blueprintPerformanceData?.data?.summary;
  const topBlueprints = blueprintPerformanceData?.data?.data?.data ?? [];

  const salesVolumeSummary = salesVolumeData?.data?.summary;
  const salesByMonth = (salesVolumeData?.data?.data?.data ?? []).map((row, idx) => ({
    ...row,
    id: `${row.month}-${idx}`,
  }));

  const revenueEarnedSummary = revenueEarnedData?.data?.summary;
  const topEarningBlueprints = revenueEarnedData?.data?.data?.data ?? [];

  const revenuePendingSummary = revenuePendingData?.data?.summary;
  const revenueByMonth = (revenuePendingData?.data?.data?.data ?? []).map((row, idx) => ({
    ...row,
    id: `${row.month}-${idx}`,
  }));

  return (
    <AdminPage>
      <MentorVerificationHeader />

      <AdminPanel>
        <AdminSectionHeader
          title="Blueprint performance"
          action={<AdminTextLink href={getMentorBlueprintPerformanceRoutePath()}>View all</AdminTextLink>}
        />
        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          <AdminStatCard label="Total sales" value={performanceSummary?.totalSales ?? 0} icon={ShoppingCart} tone="green" />
          <AdminStatCard
            label="Avg. conversion"
            value={`${performanceSummary?.avgConversion ?? 0}%`}
            icon={TrendingUp}
            tone="purple"
          />
          <AdminStatCard
            label="High Value blueprints"
            value={performanceSummary?.highValueBlueprints ?? 0}
            icon={Sparkles}
            tone="orange"
          />
        </div>
        <AdminTableShell>
          {performanceError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint performance right now.</p>
          ) : !performanceLoading && topBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No performance data available yet.</p>
          ) : (
            <CommonDataTable
              rows={topBlueprints}
              columns={performanceColumns}
              getRowId={(row) => row.id}
              loading={performanceLoading}
              paginationMode="client"
              rowCount={topBlueprints.length}
              paginationModel={PREVIEW_PAGINATION_MODEL}
              onPaginationModelChange={noopPaginationChange}
            />
          )}
        </AdminTableShell>
      </AdminPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminPanel>
          <AdminSectionHeader
            title="Sales volume"
            action={<AdminTextLink href={getMentorSalesVolumeRoutePath()}>View all</AdminTextLink>}
          />
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
                rowCount={salesByMonth.length}
                paginationModel={PREVIEW_PAGINATION_MODEL}
                onPaginationModelChange={noopPaginationChange}
              />
            </AdminTableShell>
          )}
        </AdminPanel>

        <AdminPanel>
          <AdminSectionHeader
            title="Blueprint revenue"
            action={<AdminTextLink href={getMentorRevenueEarnedRoutePath()}>View all</AdminTextLink>}
          />
          <div className="mb-5 grid grid-cols-2 gap-4">
            <AdminStatCard label="Earned" value={formatKes(revenueEarnedSummary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
            <AdminStatCard label="Pending" value={formatKes(revenueEarnedSummary?.totalPending ?? 0)} icon={TrendingUp} tone="orange" />
          </div>
          {revenueEarnedError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load blueprint revenue right now.</p>
          ) : !revenueEarnedLoading && topEarningBlueprints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No revenue data available yet.</p>
          ) : (
            <AdminTableShell>
              <CommonDataTable
                rows={topEarningBlueprints}
                columns={blueprintRevenueColumns}
                getRowId={(row) => row.id}
                loading={revenueEarnedLoading}
                paginationMode="client"
                rowCount={topEarningBlueprints.length}
                paginationModel={PREVIEW_PAGINATION_MODEL}
                onPaginationModelChange={noopPaginationChange}
              />
            </AdminTableShell>
          )}
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminSectionHeader
          title="Mentor economy revenue"
          action={<AdminTextLink href={getMentorRevenuePendingRoutePath()}>View all</AdminTextLink>}
        />
        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <AdminStatCard label="Total earned" value={formatKes(revenuePendingSummary?.totalEarned ?? 0)} icon={Wallet} tone="green" />
          <AdminStatCard label="This month" value={formatKes(revenuePendingSummary?.thisMonth ?? 0)} icon={CalendarDays} tone="blue" />
          <AdminStatCard label="Total gross" value={formatKes(revenuePendingSummary?.totalGross ?? 0)} icon={TrendingUp} tone="purple" />
          <AdminStatCard label="Total discount" value={formatKes(revenuePendingSummary?.totalDiscount ?? 0)} icon={TrendingDown} tone="orange" />
          <AdminStatCard label="Platform share" value={formatKes(revenuePendingSummary?.platformShare ?? 0)} icon={Percent} tone="slate" />
        </div>
        <AdminTableShell>
          {revenuePendingError ? (
            <p className="py-8 text-center text-sm text-slate-500">Unable to load mentor economy revenue right now.</p>
          ) : !revenuePendingLoading && revenueByMonth.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No revenue data available yet.</p>
          ) : (
            <CommonDataTable
              rows={revenueByMonth}
              columns={mentorEconomyRevenueColumns}
              getRowId={(row) => row.id}
              loading={revenuePendingLoading}
              paginationMode="client"
              rowCount={revenueByMonth.length}
              paginationModel={PREVIEW_PAGINATION_MODEL}
              onPaginationModelChange={noopPaginationChange}
            />
          )}
        </AdminTableShell>
      </AdminPanel>
    </AdminPage>
  );
}
