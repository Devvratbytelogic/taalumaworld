'use client';

import { useState } from 'react';
import { AdminPage } from '@/components/admin/layout/AdminContent';
import { AdminAnalyticsHeader } from './AdminAnalyticsHeader';
import { AnalyticsRegistrationsSection } from './AnalyticsRegistrationsSection';
import { AnalyticsBlueprintsSection } from './AnalyticsBlueprintsSection';
import { AnalyticsMentorsSection } from './AnalyticsMentorsSection';
import { AnalyticsInstitutionsSection } from './AnalyticsInstitutionsSection';
import { AnalyticsRevenueSection } from './AnalyticsRevenueSection';
import { AnalyticsCouponsSection } from './AnalyticsCouponsSection';
import { AnalyticsReferralsSection } from './AnalyticsReferralsSection';
import { AnalyticsAiQualitySection } from './AnalyticsAiQualitySection';
import { ANALYTICS_TOP_LIMIT, analyticsRangeParams, isValidDateRange } from './analyticsUtils';

export function AdminAnalyticsTab() {
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [applied, setApplied] = useState({ fromDate: '', toDate: '' });

  const rangeParams = analyticsRangeParams(applied.fromDate, applied.toDate);
  const topParams = { ...rangeParams, limit: ANALYTICS_TOP_LIMIT };

  const applyRange = (range: { fromDate: string; toDate: string }) => {
    const isClear = !range.fromDate && !range.toDate;
    if (!isClear && !isValidDateRange(range.fromDate, range.toDate)) return;
    setDraftFrom(range.fromDate);
    setDraftTo(range.toDate);
    setApplied(range);
  };

  return (
    <AdminPage>
      <AdminAnalyticsHeader
        draftFrom={draftFrom}
        draftTo={draftTo}
        appliedFrom={applied.fromDate}
        appliedTo={applied.toDate}
        onDraftFromChange={setDraftFrom}
        onDraftToChange={setDraftTo}
        onApply={applyRange}
      />

      <AnalyticsRegistrationsSection params={rangeParams} />
      <AnalyticsRevenueSection params={rangeParams} />
      <AnalyticsBlueprintsSection params={topParams} />
      <AnalyticsMentorsSection params={topParams} />
      <AnalyticsInstitutionsSection params={rangeParams} />
      <AnalyticsCouponsSection params={topParams} />
      <AnalyticsReferralsSection params={topParams} />
      <AnalyticsAiQualitySection params={rangeParams} />
    </AdminPage>
  );
}
