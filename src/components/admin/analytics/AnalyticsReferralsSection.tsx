'use client';

import Link from 'next/link';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsReferralsQuery, type IAnalyticsTopListParams } from '@/store/rtkQueries/analytics';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import {
  AnalyticsBlock,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsSummary,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatAnalyticsMoney, formatRate, queryErrorMessage } from './analyticsUtils';

const columns: GridColDef[] = [
  { field: 'rank', headerName: '#', width: 70, sortable: false },
  {
    field: 'name',
    headerName: 'Referrer',
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
    field: 'referralCode',
    headerName: 'Code',
    width: 140,
    sortable: false,
    renderCell: (params) => params.value || '—',
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
  {
    field: 'commission',
    headerName: 'Commission',
    width: 140,
    sortable: false,
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
];

export function AnalyticsReferralsSection({ params }: { params: IAnalyticsTopListParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsReferralsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const summary = payload?.summary;
  const items = payload?.items ?? [];

  return (
    <AnalyticsBlock title="Referral analytics" interval={payload?.interval}>
      {isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Referrers', value: (summary?.referrers ?? 0).toLocaleString() },
              { label: 'Registrations', value: (summary?.registrations ?? 0).toLocaleString() },
              { label: 'Conversions', value: (summary?.conversions ?? 0).toLocaleString() },
              { label: 'Conversion rate', value: formatRate(summary?.conversionRate) },
              { label: 'Commission', value: formatAnalyticsMoney(summary?.commission) },
            ]}
          />
          {!pending && items.length === 0 ? (
            <AnalyticsEmpty message="No referral rows in this range." />
          ) : (
            <AnalyticsDataTable
              rows={items}
              columns={columns}
              getRowId={(row) => row.id}
              loading={pending}
            />
          )}
        </>
      )}
    </AnalyticsBlock>
  );
}
