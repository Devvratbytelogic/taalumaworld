'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsRegistrationsQuery, type IAnalyticsRangeParams } from '@/store/rtkQueries/analytics';
import { getAdminSectionRoutePath } from '@/routes/routes';
import {
  ANALYTICS_CHART_COLORS,
  AnalyticsBlock,
  AnalyticsChartSkeleton,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsSummary,
  analyticsTooltipStyle,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatRate, humanizeKey, queryErrorMessage } from './analyticsUtils';

function conversionColumns(nameHeader: string): GridColDef[] {
  return [
    {
      field: 'name',
      headerName: nameHeader,
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => params.row.name || humanizeKey(params.row.key),
    },
    {
      field: 'registrations',
      headerName: 'Registrations',
      width: 140,
      sortable: false,
      renderCell: (params) => (params.value ?? 0).toLocaleString(),
    },
    {
      field: 'conversions',
      headerName: 'Conversions',
      width: 130,
      sortable: false,
      renderCell: (params) => (params.value ?? 0).toLocaleString(),
    },
    {
      field: 'conversionRate',
      headerName: 'Rate',
      width: 100,
      sortable: false,
      renderCell: (params) => formatRate(params.value),
    },
  ];
}

const institutionColumns = conversionColumns('University');
const sourceColumns = conversionColumns('Source');

export function AnalyticsRegistrationsSection({ params }: { params: IAnalyticsRangeParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsRegistrationsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const summary = payload?.summary;
  const byPeriod = payload?.byPeriod ?? [];
  const byInstitution = payload?.byInstitution ?? [];
  const bySource = payload?.bySource ?? [];

  return (
    <AnalyticsBlock title="Registration & conversion" interval={payload?.interval}>
      {pending ? (
        <AnalyticsChartSkeleton />
      ) : isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Registrations', value: (summary?.registrations ?? 0).toLocaleString() },
              { label: 'Conversions', value: (summary?.conversions ?? 0).toLocaleString() },
              { label: 'Conversion rate', value: formatRate(summary?.conversionRate) },
            ]}
          />
          {byPeriod.length === 0 ? (
            <AnalyticsEmpty message="No registration data for this range." />
          ) : (
            <div className="mb-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byPeriod} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={analyticsTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="registrations" name="Registrations" stroke={ANALYTICS_CHART_COLORS.primary} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conversions" name="Conversions" stroke={ANALYTICS_CHART_COLORS.green} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">By university</h3>
              {byInstitution.length === 0 ? (
                <AnalyticsEmpty message="No institution breakdown yet." />
              ) : (
                <AnalyticsDataTable
                  rows={byInstitution}
                  columns={institutionColumns}
                  getRowId={(row) => String(row.key ?? row.name)}
                  loading={false}
                />
              )}
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">By source</h3>
              {bySource.length === 0 ? (
                <AnalyticsEmpty message="No source breakdown yet." />
              ) : (
                <AnalyticsDataTable
                  rows={bySource}
                  columns={sourceColumns}
                  getRowId={(row) => String(row.key ?? row.name)}
                  loading={false}
                />
              )}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            <Link href={getAdminSectionRoutePath('campaign_users')} className="text-primary hover:text-primary/80">
              Campaign users
            </Link>
            {' '}lists signups attributed to ads and UTM sources.
          </p>
        </>
      )}
    </AnalyticsBlock>
  );
}
