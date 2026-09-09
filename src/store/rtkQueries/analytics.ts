import type {
  IAnalyticsAiQualityAPIResponse,
  IAnalyticsBlueprintsAPIResponse,
  IAnalyticsCouponsAPIResponse,
  IAnalyticsInstitutionsAPIResponse,
  IAnalyticsMentorsAPIResponse,
  IAnalyticsReferralsAPIResponse,
  IAnalyticsRegistrationsAPIResponse,
  IAnalyticsRevenueAPIResponse,
} from '@/types/commercialAnalytics';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export interface IAnalyticsRangeParams {
  fromDate?: string;
  toDate?: string;
}

export interface IAnalyticsTopListParams extends IAnalyticsRangeParams {
  limit?: number;
}

export const analyticsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsRegistrations: builder.query<IAnalyticsRegistrationsAPIResponse, IAnalyticsRangeParams>({
      query: (params) => ({
        url: '/admin/analytics/registrations',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsBlueprints: builder.query<IAnalyticsBlueprintsAPIResponse, IAnalyticsTopListParams>({
      query: (params) => ({
        url: '/admin/analytics/blueprints',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsMentors: builder.query<IAnalyticsMentorsAPIResponse, IAnalyticsTopListParams>({
      query: (params) => ({
        url: '/admin/analytics/mentors',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsInstitutions: builder.query<IAnalyticsInstitutionsAPIResponse, IAnalyticsRangeParams>({
      query: (params) => ({
        url: '/admin/analytics/institutions',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsRevenue: builder.query<IAnalyticsRevenueAPIResponse, IAnalyticsRangeParams>({
      query: (params) => ({
        url: '/admin/analytics/revenue',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsCoupons: builder.query<IAnalyticsCouponsAPIResponse, IAnalyticsTopListParams>({
      query: (params) => ({
        url: '/admin/analytics/coupons',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsReferrals: builder.query<IAnalyticsReferralsAPIResponse, IAnalyticsTopListParams>({
      query: (params) => ({
        url: '/admin/analytics/referrals',
        method: 'GET',
        params,
      }),
    }),
    getAnalyticsAiQuality: builder.query<IAnalyticsAiQualityAPIResponse, IAnalyticsRangeParams>({
      query: (params) => ({
        url: '/admin/analytics/ai-quality',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useGetAnalyticsRegistrationsQuery,
  useGetAnalyticsBlueprintsQuery,
  useGetAnalyticsMentorsQuery,
  useGetAnalyticsInstitutionsQuery,
  useGetAnalyticsRevenueQuery,
  useGetAnalyticsCouponsQuery,
  useGetAnalyticsReferralsQuery,
  useGetAnalyticsAiQualityQuery,
} = analyticsApi;
