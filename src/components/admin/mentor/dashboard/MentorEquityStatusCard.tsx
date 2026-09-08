'use client';

import { CheckCircle2, Circle, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminPanel, AdminSectionHeader } from '@/components/admin/layout/AdminContent';
import { useGetMyMentorEquityQuery } from '@/store/rtkQueries/mentorEquityApis';
import { cn } from '@/components/ui/utils';

const CHECK_LABELS: Record<string, string> = {
  min_rating: 'Minimum rating',
  qualifying_blueprint: 'Qualifying Blueprints',
};

function formatCheckLabel(key: string) {
  if (CHECK_LABELS[key]) return CHECK_LABELS[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function MentorEquityStatusCard() {
  const { data, isLoading, isError } = useGetMyMentorEquityQuery();
  const equity = data?.data?.equity;
  const eligibility = data?.data?.eligibility;
  const pool = data?.data?.pool;
  const checks = eligibility?.checks ?? {};
  const checkEntries = Object.entries(checks).filter(([, value]) => typeof value === 'boolean');

  if (isLoading) {
    return (
      <AdminPanel>
        <AdminSectionHeader title="Equity status" />
        <div className="h-24 animate-pulse rounded-md bg-slate-100" />
      </AdminPanel>
    );
  }

  if (isError || !equity) {
    return null;
  }

  const statusCopy = !equity.track
    ? 'Your current tier is not part of the equity program.'
    : equity.is_granted
      ? 'Recorded as granted offline.'
      : equity.is_eligible
        ? 'Flagged for Super Admin / legal review.'
        : eligibility?.is_eligible
          ? 'You meet the criteria. Ranking against the top % is still in progress.'
          : 'Keep meeting the published eligibility gates. This is progress only — not an ownership claim.';

  return (
    <AdminPanel>
      <AdminSectionHeader
        title="Equity status"
        badge={<Scale className="h-4 w-4 text-violet-600" />}
      />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              equity.track
                ? 'bg-violet-50 text-violet-700 border-violet-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }
          >
            {equity.track ? 'Equity track' : 'Not on equity track'}
          </Badge>
          {equity.track && equity.eligible_percent != null ? (
            <Badge variant="outline" className="border-slate-200 text-slate-700">
              Top {equity.eligible_percent}%
            </Badge>
          ) : null}
          {equity.is_eligible ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Eligible
            </Badge>
          ) : null}
          {equity.is_granted ? (
            <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
              Granted (offline)
            </Badge>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{statusCopy}</p>

        {equity.track ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Overall rating</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {eligibility?.overall_rating == null ? '—' : eligibility.overall_rating}
                {eligibility?.required?.min_rating != null ? (
                  <span className="font-normal text-slate-400"> / {eligibility.required.min_rating} min</span>
                ) : null}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Qualifying Blueprints</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {eligibility?.qualifying_blueprint_count ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Pool rank / slots</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {pool?.rank ?? '—'} / {pool?.slots ?? '—'}
              </p>
            </div>
          </div>
        ) : null}

        {checkEntries.length > 0 ? (
          <ul className="space-y-2">
            {checkEntries.map(([key, passed]) => (
              <li key={key} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <CheckCircle2 className={cn('h-4 w-4', 'text-emerald-600')} />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300" />
                )}
                <span className={passed ? 'text-slate-700' : 'text-slate-500'}>{formatCheckLabel(key)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </AdminPanel>
  );
}
