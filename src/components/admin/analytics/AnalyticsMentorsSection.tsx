'use client';

import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsMentorsQuery, type IAnalyticsTopListParams } from '@/store/rtkQueries/analytics';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import {
  AnalyticsBlock,
  AnalyticsDataTable,
  AnalyticsEmpty,
} from './AnalyticsShared';
import {
  analyticsQueryOptions,
  formatAnalyticsMoney,
  formatScore,
  queryErrorMessage,
} from './analyticsUtils';

const columns: GridColDef[] = [
  { field: 'rank', headerName: '#', width: 70, sortable: false },
  {
    field: 'name',
    headerName: 'Mentor',
    flex: 1,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => (
      <div className="min-w-0">
        <Link href={getAdminMentorDetailRoutePath(params.row.id)} className="font-medium text-slate-900 hover:text-primary">
          {params.row.name}
        </Link>
        <p className="truncate text-xs text-slate-400">{params.row.email}</p>
      </div>
    ),
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
    field: 'mentorShare',
    headerName: 'Mentor share',
    width: 140,
    sortable: false,
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
  {
    field: 'platformShare',
    headerName: 'Platform',
    width: 140,
    sortable: false,
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
  {
    field: 'qualityScore',
    headerName: 'Quality',
    width: 110,
    sortable: false,
    renderCell: (params) => (
      <div>
        {formatScore(params.row.qualityScore)}
        <span className="block text-xs font-normal text-slate-400">AI {formatScore(params.row.avgAiScore, 2)}</span>
      </div>
    ),
  },
];

export function AnalyticsMentorsSection({ params }: { params: IAnalyticsTopListParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsMentorsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const items = payload?.items ?? [];

  return (
    <AnalyticsBlock title="Mentor performance" interval={payload?.interval}>
      {isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : !pending && items.length === 0 ? (
        <AnalyticsEmpty message="No mentor sales in this range." />
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
