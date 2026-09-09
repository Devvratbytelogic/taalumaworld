'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { type GridColDef } from '@mui/x-data-grid';
import { CsvExportButton } from '@/components/admin/CsvExportButton';
import { useGetAnalyticsAiQualityQuery, type IAnalyticsRangeParams } from '@/store/rtkQueries/analytics';
import {
  AnalyticsBlock,
  AnalyticsChartSkeleton,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsSummary,
  analyticsTooltipStyle,
} from './AnalyticsShared';
import {
  AI_CLASSIFICATION_COLORS,
  analyticsCsvSuffix,
  analyticsQueryOptions,
  distributionToSeries,
  formatScore,
  humanizeKey,
  normalizeNamedCounts,
  queryErrorMessage,
} from './analyticsUtils';

const namedCountColumns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 160,
    sortable: false,
    renderCell: (params) => params.row.name || humanizeKey(params.row.key),
  },
  {
    field: 'count',
    headerName: 'Count',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
];

const classificationColumns: GridColDef[] = [
  { ...namedCountColumns[0], headerName: 'Classification' },
  namedCountColumns[1],
];

const statusColumns: GridColDef[] = [
  { ...namedCountColumns[0], headerName: 'Status' },
  namedCountColumns[1],
];

export function AnalyticsAiQualitySection({ params }: { params: IAnalyticsRangeParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsAiQualityQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const ai = payload?.ai;
  const quality = payload?.quality;
  const series = distributionToSeries(ai?.distribution);
  const byClassification = normalizeNamedCounts(ai?.byClassification);
  const byStatus = normalizeNamedCounts(ai?.byStatus);

  return (
    <AnalyticsBlock
      title="AI & quality"
      interval={payload?.interval}
      action={
        <CsvExportButton
          filename={`ai-quality-chart-${analyticsCsvSuffix(params)}.csv`}
          ariaLabel="Export AI quality chart CSV"
          disabled={pending || isError}
          rows={series}
          columns={[
            { header: 'Key', value: (row) => row.key },
            { header: 'Label', value: (row) => row.label },
            { header: 'Value', value: (row) => row.value },
          ]}
        />
      }
    >
      {pending ? (
        <AnalyticsChartSkeleton />
      ) : isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Blueprints scored', value: (ai?.scored ?? 0).toLocaleString() },
              { label: 'Avg. AI score', value: formatScore(ai?.avgScore, 2) },
              { label: 'Flagged', value: (ai?.flagged ?? 0).toLocaleString() },
              { label: 'Mentors', value: (quality?.mentors ?? 0).toLocaleString() },
              { label: 'Avg. quality score', value: formatScore(quality?.avgQualityScore) },
            ]}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {series.length === 0 ? (
              <AnalyticsEmpty message="No AI classification data for this range." />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={series}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                    >
                      {series.map((item) => (
                        <Cell
                          key={item.key}
                          fill={AI_CLASSIFICATION_COLORS[item.key] ?? '#64748b'}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={analyticsTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="space-y-3">
              {series.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: AI_CLASSIFICATION_COLORS[item.key] }}
                    />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">By classification</h3>
              {byClassification.length === 0 ? (
                <AnalyticsEmpty message="No classification breakdown yet." />
              ) : (
                <AnalyticsDataTable
                  rows={byClassification}
                  columns={classificationColumns}
                  getRowId={(row) => row.key}
                  loading={false}
                />
              )}
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700">By status</h3>
              {byStatus.length === 0 ? (
                <AnalyticsEmpty message="No status breakdown yet." />
              ) : (
                <AnalyticsDataTable
                  rows={byStatus}
                  columns={statusColumns}
                  getRowId={(row) => row.key}
                  loading={false}
                />
              )}
            </div>
          </div>
        </>
      )}
    </AnalyticsBlock>
  );
}
