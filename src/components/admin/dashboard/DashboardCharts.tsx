'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CsvExportButton } from '@/components/admin/CsvExportButton';
import { AdminPanel, AdminSectionHeader, adminSelectClass } from '@/components/admin/layout/AdminContent';
import { formatKes } from '@/constants/common';
import {
  useGetAdminDashboardEarningsChartQuery,
  useGetAdminDashboardRegistrationsChartQuery,
  useGetAdminDashboardRevenueSplitChartQuery,
  useGetAdminDashboardSalesVolumeChartQuery,
  type IDashboardDateRangeParams,
} from '@/store/rtkQueries/dashboard';

const CHART_COLORS = {
  platform: '#0284c7',
  mentor: '#059669',
  gross: '#7c3aed',
  sales: '#d97706',
  book: '#0284c7',
  chapter: '#059669',
  customers: '#0284c7',
  mentors: '#7c3aed',
};

const REVENUE_SPLIT_COLORS: Record<string, string> = {
  platform_earning: CHART_COLORS.platform,
  mentor_share: CHART_COLORS.mentor,
};

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 12,
};

function formatCompactKes(value: number) {
  if (Math.abs(value) >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `KSh ${(value / 1_000).toFixed(0)}k`;
  return formatKes(value);
}

function ChartSkeleton() {
  return <div className="h-64 animate-pulse rounded-lg bg-slate-100" />;
}

function ChartEmpty({ message }: { message: string }) {
  return <p className="flex h-64 items-center justify-center text-sm text-slate-500">{message}</p>;
}

function ChartSummary({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className={`mb-5 grid grid-cols-2 gap-3 ${items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs text-slate-500">{item.label}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

const CURRENT_YEAR = new Date().getFullYear();
const CHART_YEARS = Array.from({ length: CURRENT_YEAR - 2020 + 1 }, (_, i) => CURRENT_YEAR - i);

function chartCsvSuffix(year: string, filterParams: IDashboardDateRangeParams) {
  if (filterParams.fromDate && filterParams.toDate) {
    return `${filterParams.fromDate}-to-${filterParams.toDate}`;
  }
  return year || 'all-years';
}

function YearFilter({
  year,
  onYearChange,
  disabled,
}: {
  year: string;
  onYearChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={year}
      onChange={(e) => onYearChange(e.target.value)}
      className={`${adminSelectClass} min-w-28`}
      aria-label="Filter charts by year"
      disabled={disabled}
    >
      <option value="">All years</option>
      {CHART_YEARS.map((value) => (
        <option key={value} value={String(value)}>
          {value}
        </option>
      ))}
    </select>
  );
}

export function DashboardCharts({
  year,
  onYearChange,
  filterParams,
}: {
  year: string;
  onYearChange: (value: string) => void;
  filterParams: IDashboardDateRangeParams;
}) {
  const {
    data: earningsData,
    isLoading: earningsLoading,
    isError: earningsError,
  } = useGetAdminDashboardEarningsChartQuery(filterParams);
  const {
    data: salesVolumeData,
    isLoading: salesVolumeLoading,
    isError: salesVolumeError,
  } = useGetAdminDashboardSalesVolumeChartQuery(filterParams);
  const {
    data: registrationsData,
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useGetAdminDashboardRegistrationsChartQuery(filterParams);
  const {
    data: revenueSplitData,
    isLoading: revenueSplitLoading,
    isError: revenueSplitError,
  } = useGetAdminDashboardRevenueSplitChartQuery(filterParams);

  const earnings = earningsData?.data;
  const salesVolume = salesVolumeData?.data;
  const registrations = registrationsData?.data;
  const revenueSplit = revenueSplitData?.data;

  const earningsSeries = earnings?.series ?? [];
  const salesVolumeSeries = salesVolume?.series ?? [];
  const registrationsSeries = registrations?.series ?? [];
  const revenueSplitSeries = (revenueSplit?.series ?? []).filter((item) => item.value > 0);
  const csvSuffix = chartCsvSuffix(year, filterParams);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Charts</h2>
        <YearFilter
          year={year}
          onYearChange={onYearChange}
          disabled={Boolean(filterParams.fromDate && filterParams.toDate)}
        />
      </div>

      <AdminPanel>
        <AdminSectionHeader
          title="Earnings"
          action={
            <CsvExportButton
              filename={`earnings-chart-${csvSuffix}.csv`}
              ariaLabel="Export earnings chart CSV"
              disabled={earningsLoading || earningsError}
              rows={earningsSeries}
              columns={[
                { header: 'Date', value: (row) => row.date },
                { header: 'Period', value: (row) => row.label },
                { header: 'Platform earning', value: (row) => row.platform_earning },
                { header: 'Mentor share', value: (row) => row.mentor_share },
                { header: 'Gross', value: (row) => row.gross },
                { header: 'Sales', value: (row) => row.sales },
              ]}
            />
          }
        />
        {earningsLoading ? (
          <ChartSkeleton />
        ) : earningsError ? (
          <ChartEmpty message="Unable to load earnings right now." />
        ) : earningsSeries.length === 0 ? (
          <ChartEmpty message="No earnings data available yet." />
        ) : (
          <>
            <ChartSummary
              items={[
                { label: 'Platform earning', value: formatKes(earnings?.summary.platform_earning ?? 0) },
                { label: 'Mentor share', value: formatKes(earnings?.summary.mentor_share ?? 0) },
                { label: 'Gross', value: formatKes(earnings?.summary.gross ?? 0) },
                { label: 'Sales', value: (earnings?.summary.sales ?? 0).toLocaleString() },
              ]}
            />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis
                    yAxisId="money"
                    tickFormatter={formatCompactKes}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    width={72}
                  />
                  <YAxis
                    yAxisId="sales"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      name === 'Sales' ? Number(value).toLocaleString() : formatKes(Number(value)),
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="money" type="monotone" dataKey="platform_earning" name="Platform earning" stroke={CHART_COLORS.platform} strokeWidth={2} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="mentor_share" name="Mentor share" stroke={CHART_COLORS.mentor} strokeWidth={2} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="gross" name="Gross" stroke={CHART_COLORS.gross} strokeWidth={2} dot={false} />
                  <Line yAxisId="sales" type="monotone" dataKey="sales" name="Sales" stroke={CHART_COLORS.sales} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </AdminPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminPanel>
          <AdminSectionHeader
            title="Sales volume"
            action={
              <CsvExportButton
                filename={`sales-volume-chart-${csvSuffix}.csv`}
                ariaLabel="Export sales volume chart CSV"
                disabled={salesVolumeLoading || salesVolumeError}
                rows={salesVolumeSeries}
                columns={[
                  { header: 'Date', value: (row) => row.date },
                  { header: 'Period', value: (row) => row.label },
                  { header: 'Books', value: (row) => row.book },
                  { header: 'Blueprints', value: (row) => row.chapter },
                  { header: 'Other', value: (row) => row.other },
                  { header: 'Total', value: (row) => row.total },
                ]}
              />
            }
          />
          {salesVolumeLoading ? (
            <ChartSkeleton />
          ) : salesVolumeError ? (
            <ChartEmpty message="Unable to load sales volume right now." />
          ) : salesVolumeSeries.length === 0 ? (
            <ChartEmpty message="No sales volume data available yet." />
          ) : (
            <>
              <ChartSummary
                items={[
                  { label: 'Books', value: (salesVolume?.summary.book ?? 0).toLocaleString() },
                  { label: 'Blueprints', value: (salesVolume?.summary.chapter ?? 0).toLocaleString() },
                  { label: 'Total', value: (salesVolume?.summary.total ?? 0).toLocaleString() },
                ]}
              />
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesVolumeSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={36} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="book" name="Books" fill={CHART_COLORS.book} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="chapter" name="Blueprints" fill={CHART_COLORS.chapter} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </AdminPanel>

        <AdminPanel>
          <AdminSectionHeader
            title="Registrations"
            action={
              <CsvExportButton
                filename={`registrations-chart-${csvSuffix}.csv`}
                ariaLabel="Export registrations chart CSV"
                disabled={registrationsLoading || registrationsError}
                rows={registrationsSeries}
                columns={[
                  { header: 'Date', value: (row) => row.date },
                  { header: 'Period', value: (row) => row.label },
                  { header: 'Customers', value: (row) => row.customers },
                  { header: 'Mentors', value: (row) => row.mentors },
                  { header: 'Total', value: (row) => row.total },
                ]}
              />
            }
          />
          {registrationsLoading ? (
            <ChartSkeleton />
          ) : registrationsError ? (
            <ChartEmpty message="Unable to load registrations right now." />
          ) : registrationsSeries.length === 0 ? (
            <ChartEmpty message="No registration data available yet." />
          ) : (
            <>
              <ChartSummary
                items={[
                  { label: 'Customers', value: (registrations?.summary.customers ?? 0).toLocaleString() },
                  { label: 'Mentors', value: (registrations?.summary.mentors ?? 0).toLocaleString() },
                  { label: 'Total', value: (registrations?.summary.total ?? 0).toLocaleString() },
                ]}
              />
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationsSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={36} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="customers" name="Customers" stroke={CHART_COLORS.customers} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="mentors" name="Mentors" stroke={CHART_COLORS.mentors} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminSectionHeader
          title="Revenue split"
          action={
            <CsvExportButton
              filename={`revenue-split-chart-${csvSuffix}.csv`}
              ariaLabel="Export revenue split chart CSV"
              disabled={revenueSplitLoading || revenueSplitError}
              rows={revenueSplitSeries}
              columns={[
                { header: 'Key', value: (row) => row.key },
                { header: 'Label', value: (row) => row.label },
                { header: 'Value', value: (row) => row.value },
              ]}
            />
          }
        />
        {revenueSplitLoading ? (
          <ChartSkeleton />
        ) : revenueSplitError ? (
          <ChartEmpty message="Unable to load revenue split right now." />
        ) : revenueSplitSeries.length === 0 ? (
          <ChartEmpty message="No revenue split data available yet." />
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSplitSeries}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {revenueSplitSeries.map((item) => (
                      <Cell key={item.key} fill={REVENUE_SPLIT_COLORS[item.key] ?? CHART_COLORS.gross} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [formatKes(Number(value)), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {revenueSplitSeries.map((item) => {
                const total = revenueSplit?.summary.total || 1;
                const percent = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: REVENUE_SPLIT_COLORS[item.key] ?? CHART_COLORS.gross }}
                      />
                      <span className="text-sm text-slate-600">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatKes(item.value)}</p>
                      <p className="text-xs text-slate-400">{percent}%</p>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">Gross</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatKes(revenueSplit?.summary.gross ?? 0)}</p>
              </div>
            </div>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
