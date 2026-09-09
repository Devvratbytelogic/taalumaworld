'use client';

import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsBlueprintsQuery, type IAnalyticsTopListParams } from '@/store/rtkQueries/analytics';
import { getViewChapterRoutePath } from '@/routes/routes';
import {
  AnalyticsBlock,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsStatusBadge,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatAnalyticsMoney, formatRate, formatScore, humanizeKey, queryErrorMessage } from './analyticsUtils';

const columns: GridColDef[] = [
  { field: 'rank', headerName: '#', width: 70, sortable: false },
  {
    field: 'title',
    headerName: 'Blueprint',
    flex: 1,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => (
      <div className="min-w-0">
        <Link href={getViewChapterRoutePath(params.row.id)} className="font-medium text-slate-900 hover:text-primary">
          {params.row.title}
        </Link>
        {params.row.aiClassification ? (
          <p className="text-xs text-slate-400">{humanizeKey(params.row.aiClassification)}</p>
        ) : null}
      </div>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    sortable: false,
    renderCell: (params) => <AnalyticsStatusBadge value={params.row.status} />,
  },
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
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
  {
    field: 'views',
    headerName: 'Views',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  {
    field: 'conversionRate',
    headerName: 'Conv.',
    width: 100,
    sortable: false,
    renderCell: (params) => formatRate(params.value),
  },
  {
    field: 'aiScore',
    headerName: 'AI',
    width: 90,
    sortable: false,
    renderCell: (params) => formatScore(params.value, 2),
  },
];

export function AnalyticsBlueprintsSection({ params }: { params: IAnalyticsTopListParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsBlueprintsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const items = payload?.items ?? [];

  return (
    <AnalyticsBlock title="Blueprint performance" interval={payload?.interval}>
      {isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : !pending && items.length === 0 ? (
        <AnalyticsEmpty message="No paid blueprint sales in this range." />
      ) : (
        <AnalyticsDataTable
          rows={items}
          columns={columns}
          getRowId={(row) => row.id}
          loading={pending}
        />
      )}
    </AnalyticsBlock>
  );
}
