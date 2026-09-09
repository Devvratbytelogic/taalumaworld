'use client';

import { X } from 'lucide-react';
import { AdminPageHeader, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import { Input } from '@/components/ui/input';
import { isValidDateRange } from './analyticsUtils';

interface AdminAnalyticsHeaderProps {
  draftFrom: string;
  draftTo: string;
  appliedFrom: string;
  appliedTo: string;
  onDraftFromChange: (value: string) => void;
  onDraftToChange: (value: string) => void;
  onApply: (range: { fromDate: string; toDate: string }) => void;
}

export function AdminAnalyticsHeader({
  draftFrom,
  draftTo,
  appliedFrom,
  appliedTo,
  onDraftFromChange,
  onDraftToChange,
  onApply,
}: AdminAnalyticsHeaderProps) {
  const hasDraft = Boolean(draftFrom && draftTo);
  const hasApplied = Boolean(appliedFrom && appliedTo);
  const valid = !hasDraft || isValidDateRange(draftFrom, draftTo);
  const dirty = draftFrom !== appliedFrom || draftTo !== appliedTo;
  const clearing = !draftFrom && !draftTo && hasApplied;
  const canApply = (hasDraft && isValidDateRange(draftFrom, draftTo) && dirty) || clearing;

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Commercial analytics"
        description="Registration, revenue, and quality for the selected range. Each block loads from its own API."
      />
      <AdminSearchPanel>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-0 flex-col gap-1 sm:w-40">
            <label className="text-xs font-medium text-slate-500">From</label>
            <Input
              type="date"
              value={draftFrom}
              max={draftTo || undefined}
              onChange={(e) => onDraftFromChange(e.target.value)}
              className="h-9 w-full bg-white text-sm"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1 sm:w-40">
            <label className="text-xs font-medium text-slate-500">To</label>
            <Input
              type="date"
              value={draftTo}
              min={draftFrom || undefined}
              onChange={(e) => onDraftToChange(e.target.value)}
              className="h-9 w-full bg-white text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => onApply({ fromDate: draftFrom, toDate: draftTo })}
            disabled={!canApply}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
          {dirty ? (
            <button
              type="button"
              onClick={() => {
                onDraftFromChange(appliedFrom);
                onDraftToChange(appliedTo);
              }}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200! bg-white px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          ) : hasApplied ? (
            <button
              type="button"
              onClick={() => onApply({ fromDate: '', toDate: '' })}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
        {hasDraft && !valid ? (
          <p className="text-xs text-red-600">Choose a from date that is on or before the to date.</p>
        ) : hasApplied ? (
          <p className="text-xs text-slate-500">
            Showing {appliedFrom} to {appliedTo}. Changing dates does not reload until you apply.
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Showing all dates. Changing dates does not reload until you apply.
          </p>
        )}
      </AdminSearchPanel>
    </>
  );
}
