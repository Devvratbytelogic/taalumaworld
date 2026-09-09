'use client';

import { type GridColDef } from '@mui/x-data-grid';
import { useGetAnalyticsCouponsQuery, type IAnalyticsTopListParams } from '@/store/rtkQueries/analytics';
import {
  AnalyticsBlock,
  AnalyticsDataTable,
  AnalyticsEmpty,
  AnalyticsStatusBadge,
  AnalyticsSummary,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatAnalyticsMoney, humanizeKey, queryErrorMessage } from './analyticsUtils';

const columns: GridColDef[] = [
  { field: 'rank', headerName: '#', width: 70, sortable: false },
  { field: 'couponCode', headerName: 'Code', flex: 1, minWidth: 140, sortable: false },
  {
    field: 'couponType',
    headerName: 'Type',
    width: 140,
    sortable: false,
    renderCell: (params) => humanizeKey(params.value),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    sortable: false,
    renderCell: (params) => <AnalyticsStatusBadge value={params.value} />,
  },
  {
    field: 'orders',
    headerName: 'Orders',
    width: 110,
    sortable: false,
    renderCell: (params) => (params.value ?? 0).toLocaleString(),
  },
  {
    field: 'discount',
    headerName: 'Discount',
    width: 140,
    sortable: false,
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
  {
    field: 'revenue',
    headerName: 'Revenue',
    width: 140,
    sortable: false,
    renderCell: (params) => formatAnalyticsMoney(params.value),
  },
];

export function AnalyticsCouponsSection({ params }: { params: IAnalyticsTopListParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsCouponsQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const summary = payload?.summary;
  const items = payload?.items ?? [];

  return (
    <AnalyticsBlock title="Coupon analytics" interval={payload?.interval}>
      {isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Coupons', value: (summary?.coupons ?? 0).toLocaleString() },
              { label: 'Orders', value: (summary?.orders ?? 0).toLocaleString() },
              { label: 'Discount', value: formatAnalyticsMoney(summary?.discount) },
              { label: 'Revenue', value: formatAnalyticsMoney(summary?.revenue) },
            ]}
          />
          {!pending && items.length === 0 ? (
            <AnalyticsEmpty message="No coupon-backed paid orders in this range." />
          ) : (
            <AnalyticsDataTable
              rows={items}
              columns={columns}
              getRowId={(row) => `${row.rank}-${row.couponCode}`}
              loading={pending}
            />
          )}
        </>
      )}
    </AnalyticsBlock>
  );
}
