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
import { useGetAnalyticsRevenueQuery, type IAnalyticsRangeParams } from '@/store/rtkQueries/analytics';
import {
  ANALYTICS_CHART_COLORS,
  AnalyticsBlock,
  AnalyticsChartSkeleton,
  AnalyticsEmpty,
  AnalyticsSummary,
  analyticsTooltipStyle,
} from './AnalyticsShared';
import { analyticsQueryOptions, formatAnalyticsMoney, formatCompactKes, queryErrorMessage } from './analyticsUtils';

export function AnalyticsRevenueSection({ params }: { params: IAnalyticsRangeParams }) {
  const { data, isLoading, isError, error, isUninitialized } = useGetAnalyticsRevenueQuery(
    params,
    analyticsQueryOptions(params),
  );
  const pending = isLoading || isUninitialized;
  const payload = data?.data;
  const summary = payload?.summary;
  const series = payload?.series ?? [];

  return (
    <AnalyticsBlock title="Revenue (net after commissions)" interval={payload?.interval}>
      {pending ? (
        <AnalyticsChartSkeleton />
      ) : isError ? (
        <AnalyticsEmpty message={queryErrorMessage(error)} />
      ) : (
        <>
          <AnalyticsSummary
            items={[
              { label: 'Sales', value: (summary?.sales ?? 0).toLocaleString() },
              { label: 'Gross', value: formatAnalyticsMoney(summary?.gross) },
              { label: 'Mentor share', value: formatAnalyticsMoney(summary?.mentorShare) },
              { label: 'Platform earning', value: formatAnalyticsMoney(summary?.platformEarning) },
              { label: 'Net after commissions', value: formatAnalyticsMoney(summary?.netAfterCommissions) },
            ]}
          />
          {series.length === 0 ? (
            <AnalyticsEmpty message="No revenue data for this range." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={analyticsTooltipStyle}
                    formatter={(value, name) => [
                      name === 'Sales' ? Number(value).toLocaleString() : formatAnalyticsMoney(Number(value)),
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="money" type="monotone" dataKey="gross" name="Gross" stroke={ANALYTICS_CHART_COLORS.purple} strokeWidth={2} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="mentorShare" name="Mentor share" stroke={ANALYTICS_CHART_COLORS.green} strokeWidth={2} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="platformEarning" name="Platform earning" stroke={ANALYTICS_CHART_COLORS.primary} strokeWidth={2} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="netAfterCommissions" name="Net after commissions" stroke={ANALYTICS_CHART_COLORS.orange} strokeWidth={2} dot={false} />
                  <Line yAxisId="sales" type="monotone" dataKey="sales" name="Sales" stroke={ANALYTICS_CHART_COLORS.slate} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </AnalyticsBlock>
  );
}
