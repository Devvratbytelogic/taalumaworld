'use client';

import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsInstitutionsQuery, type IAnalyticsRangeParams } from '@/store/rtkQueries/analytics';
import {
  AnalyticsBlock,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsSummary,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatRate, humanizeKey, queryErrorMessage } from './analyticsUtils';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'University',
    flex: 1,
    minWidth: 180,
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
    field: 'activeUsers',
    headerName: 'Active users',
    width: 130,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  {
    field: 'consumption',
    headerName: 'Consumption',
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

export function AnalyticsInstitutionsSection({ params }: { params: IAnalyticsRangeParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsInstitutionsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const summary = payload?.summary;
  const items = payload?.items ?? [];

  return (
    <AnalyticsBlock title="Institutional performance" interval={payload?.interval}>
      {isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Registrations', value: (summary?.registrations ?? 0).toLocaleString() },
              { label: 'Active users', value: (summary?.activeUsers ?? 0).toLocaleString() },
              { label: 'Consumption', value: (summary?.consumption ?? 0).toLocaleString() },
              { label: 'Conversions', value: (summary?.conversions ?? 0).toLocaleString() },
              { label: 'Conversion rate', value: formatRate(summary?.conversionRate) },
            ]}
          />
          {!pending && items.length === 0 ? (
            <AnalyticsEmpty message="No university activity in this range." />
          ) : (
            <AnalyticsDataTable
              rows={items}
              columns={columns}
              getRowId={(row) => String(row.id ?? row.key ?? row.name)}
              loading={pending}
            />
          )}
        </>
      )}
    </AnalyticsBlock>
  );
}
