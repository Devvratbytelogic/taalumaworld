import type { AnalyticsInterval, IAiScoreDistribution, IAnalyticsNamedCount } from '@/types/commercialAnalytics';

export const ANALYTICS_TOP_LIMIT = 10;

const YMD = /^\d{4}-\d{2}-\d{2}$/;

export function formatYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLastNDaysRange(days: number): { fromDate: string; toDate: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { fromDate: formatYmd(from), toDate: formatYmd(to) };
}

export function isValidDateRange(fromDate: string, toDate: string): boolean {
  return YMD.test(fromDate) && YMD.test(toDate) && fromDate <= toDate;
}

export function analyticsQueryOptions(params: { fromDate?: string; toDate?: string }) {
  return { skip: !isValidDateRange(params.fromDate ?? '', params.toDate ?? '') };
}

export function formatAnalyticsMoney(amount?: number | null): string {
  return `KSh ${Number(amount ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactKes(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `KSh ${(value / 1_000).toFixed(0)}k`;
  return formatAnalyticsMoney(value);
}

export function formatRate(value?: number | null): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(1)}%`;
}

export function formatScore(value?: number | null, digits = 1): string {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toFixed(digits);
}

export function humanizeKey(value?: string | null): string {
  if (!value) return '—';
  if (value === 'none') return 'No institution';
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function intervalLabel(interval?: AnalyticsInterval | null): string {
  if (interval === 'day') return 'Daily';
  if (interval === 'month') return 'Monthly';
  if (interval === 'year') return 'Yearly';
  return interval ? humanizeKey(interval) : '';
}

export const AI_CLASSIFICATION_ORDER: (keyof IAiScoreDistribution)[] = [
  'high_value',
  'standard',
  'needs_improvement',
  'hold_for_review',
  'unscored',
];

export const AI_CLASSIFICATION_COLORS: Record<keyof IAiScoreDistribution, string> = {
  high_value: '#059669',
  standard: '#0284c7',
  needs_improvement: '#d97706',
  hold_for_review: '#7c3aed',
  unscored: '#94a3b8',
};

export function distributionToSeries(distribution?: IAiScoreDistribution | null) {
  if (!distribution) return [];
  return AI_CLASSIFICATION_ORDER.map((key) => ({
    key,
    label: humanizeKey(key),
    value: Number(distribution[key] ?? 0),
  })).filter((item) => item.value > 0);
}

export function normalizeNamedCounts(
  value?: IAnalyticsNamedCount[] | Record<string, number> | null,
): { key: string; name: string; count: number }[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const key = String(item.key ?? item.status ?? item.name ?? index);
      return {
        key,
        name: item.name || humanizeKey(item.status ?? item.key) || key,
        count: Number(item.count ?? item.registrations ?? 0),
      };
    });
  }
  return Object.entries(value).map(([key, count]) => ({
    key,
    name: humanizeKey(key),
    count: Number(count ?? 0),
  }));
}

export function queryErrorMessage(error: unknown, fallback = 'Unable to load this block right now.'): string {
  if (!error || typeof error !== 'object') return fallback;
  const data = (error as { data?: { message?: unknown } }).data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  const message = (error as { error?: unknown }).error;
  if (typeof message === 'string' && message.trim()) return message;
  return fallback;
}
