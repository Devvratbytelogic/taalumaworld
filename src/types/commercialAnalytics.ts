/** Commercial analytics — GET /admin/analytics/* (SOW 3.17) */

export type AnalyticsInterval = 'day' | 'month' | 'year' | string;

export interface IAnalyticsRangeMeta {
  fromDate: string | null;
  toDate: string | null;
  interval: AnalyticsInterval;
}

export interface IAnalyticsEnvelope<T> {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface IAnalyticsNamedCount {
  key: string;
  name: string;
  count?: number;
  registrations?: number;
  conversions?: number;
  conversionRate?: number;
  avgScore?: number;
  status?: string;
}

export interface IAiScoreDistribution {
  high_value: number;
  standard: number;
  needs_improvement: number;
  hold_for_review: number;
  unscored: number;
}

/** ── GET /admin/analytics/registrations ───────────────────────────────────── */

export interface IAnalyticsConversionRow {
  key?: string;
  date?: string;
  label?: string;
  name?: string;
  registrations: number;
  conversions: number;
  conversionRate: number;
}

export interface IAnalyticsRegistrationsSummary {
  registrations: number;
  conversions: number;
  conversionRate: number;
}

export interface IAnalyticsRegistrationsData extends IAnalyticsRangeMeta {
  summary: IAnalyticsRegistrationsSummary;
  byPeriod?: IAnalyticsConversionRow[] | null;
  byInstitution?: IAnalyticsConversionRow[] | null;
  bySource?: IAnalyticsConversionRow[] | null;
}

export type IAnalyticsRegistrationsAPIResponse = IAnalyticsEnvelope<IAnalyticsRegistrationsData>;

/** ── GET /admin/analytics/blueprints ──────────────────────────────────────── */

export interface IAnalyticsBlueprintItem {
  rank: number;
  id: string;
  title: string;
  slug?: string | null;
  status: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  aiScore?: number | null;
  aiClassification?: string | null;
}

export interface IAnalyticsBlueprintsData extends IAnalyticsRangeMeta {
  items?: IAnalyticsBlueprintItem[] | null;
}

export type IAnalyticsBlueprintsAPIResponse = IAnalyticsEnvelope<IAnalyticsBlueprintsData>;

/** ── GET /admin/analytics/mentors ─────────────────────────────────────────── */

export interface IAnalyticsMentorItem {
  rank: number;
  id: string;
  name: string;
  email: string;
  sales: number;
  revenue: number;
  mentorShare: number;
  platformShare: number;
  qualityScore: number;
  avgAiScore?: number | null;
  aiScoreDistribution?: IAiScoreDistribution | null;
}

export interface IAnalyticsMentorsData extends IAnalyticsRangeMeta {
  items?: IAnalyticsMentorItem[] | null;
}

export type IAnalyticsMentorsAPIResponse = IAnalyticsEnvelope<IAnalyticsMentorsData>;

/** ── GET /admin/analytics/institutions ────────────────────────────────────── */

export interface IAnalyticsInstitutionMetrics {
  registrations: number;
  /** Unique partner students counted as active in the selected range (all time if none). */
  activeUsers: number;
  /** Blueprint opens in that range. Not completions. */
  consumption: number;
  conversions: number;
  conversionRate: number;
}

export interface IAnalyticsInstitutionItem extends IAnalyticsInstitutionMetrics {
  id?: string;
  key?: string;
  name: string;
}

export interface IAnalyticsInstitutionsData extends IAnalyticsRangeMeta {
  summary: IAnalyticsInstitutionMetrics;
  items?: IAnalyticsInstitutionItem[] | null;
}

export type IAnalyticsInstitutionsAPIResponse = IAnalyticsEnvelope<IAnalyticsInstitutionsData>;

/** ── GET /admin/analytics/revenue ─────────────────────────────────────────── */

export interface IAnalyticsRevenueMetrics {
  sales: number;
  gross: number;
  mentorShare: number;
  platformEarning: number;
  netAfterCommissions: number;
}

export interface IAnalyticsRevenuePoint extends IAnalyticsRevenueMetrics {
  date: string;
  label: string;
}

export interface IAnalyticsRevenueData extends IAnalyticsRangeMeta {
  summary: IAnalyticsRevenueMetrics;
  series?: IAnalyticsRevenuePoint[] | null;
}

export type IAnalyticsRevenueAPIResponse = IAnalyticsEnvelope<IAnalyticsRevenueData>;

/** ── GET /admin/analytics/coupons ─────────────────────────────────────────── */

export interface IAnalyticsCouponsSummary {
  coupons: number;
  orders: number;
  discount: number;
  revenue: number;
}

export interface IAnalyticsCouponItem {
  rank: number;
  couponCode: string;
  couponType?: string | null;
  status?: string | null;
  orders: number;
  discount: number;
  revenue: number;
}

export interface IAnalyticsCouponsData extends IAnalyticsRangeMeta {
  summary: IAnalyticsCouponsSummary;
  items?: IAnalyticsCouponItem[] | null;
}

export type IAnalyticsCouponsAPIResponse = IAnalyticsEnvelope<IAnalyticsCouponsData>;

/** ── GET /admin/analytics/referrals ───────────────────────────────────────── */

export interface IAnalyticsReferralsSummary {
  referrers: number;
  registrations: number;
  conversions: number;
  conversionRate: number;
  commission: number;
}

export interface IAnalyticsReferralItem {
  rank: number;
  id: string;
  name: string;
  email: string;
  referralCode?: string | null;
  registrations: number;
  conversions: number;
  conversionRate: number;
  commission: number;
}

export interface IAnalyticsReferralsData extends IAnalyticsRangeMeta {
  summary: IAnalyticsReferralsSummary;
  items?: IAnalyticsReferralItem[] | null;
}

export type IAnalyticsReferralsAPIResponse = IAnalyticsEnvelope<IAnalyticsReferralsData>;

/** ── GET /admin/analytics/ai-quality ──────────────────────────────────────── */

export interface IAnalyticsAiQualityAi {
  scored: number;
  avgScore: number;
  flagged: number;
  distribution: IAiScoreDistribution;
  byClassification?: IAnalyticsNamedCount[] | Record<string, number> | null;
  byStatus?: IAnalyticsNamedCount[] | Record<string, number> | null;
}

export interface IAnalyticsAiQualityQuality {
  mentors: number;
  avgQualityScore: number;
}

export interface IAnalyticsAiQualityData extends IAnalyticsRangeMeta {
  ai: IAnalyticsAiQualityAi;
  quality: IAnalyticsAiQualityQuality;
}

export type IAnalyticsAiQualityAPIResponse = IAnalyticsEnvelope<IAnalyticsAiQualityData>;
