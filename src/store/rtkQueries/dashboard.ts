import {
    IAdminDashboardAPIResponse,
    IBlueprintPerformanceAPIResponse,
    IBlueprintRevenueAPIResponse,
    IMentorEconomyRevenueAPIResponse,
    IMentorReferralsAPIResponse,
    ISalesVolumeAPIResponse,
} from '@/types/dashboard';
import { IReferralWalletLedgerAPIResponse } from '@/types/referralWallet';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export interface IDashboardDateRangeParams {
    fromDate?: string;
    toDate?: string;
}

export interface IGetReferralWalletLedgerParams {
    page?: number;
    limit?: number;
    type?: 'credit' | 'debit';
}

export const dashboardApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Admin overview dashboard stats */
        getAdminDashboard: builder.query<IAdminDashboardAPIResponse, IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/dashboard`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Blueprint performance — accessible to Admin and Mentor */
        getBlueprintPerformance: builder.query<IBlueprintPerformanceAPIResponse, { page?: number; limit?: number; search?: string } & IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/blueprints/performance`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Blueprint sales volume — accessible to Admin and Mentor */
        getSalesVolume: builder.query<ISalesVolumeAPIResponse, { page?: number; limit?: number; search?: string } & IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/blueprints/sales-volume`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Blueprint revenue — accessible to Admin and Mentor */
        getBlueprintRevenue: builder.query<IBlueprintRevenueAPIResponse, { page?: number; limit?: number; search?: string } & IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/blueprints/revenue`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Mentor economy revenue — Admin only */
        getMentorEconomyRevenue: builder.query<IMentorEconomyRevenueAPIResponse, { page?: number; limit?: number; search?: string } & IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/mentor-economy/revenue`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Logged-in user's own referrals, filterable by status — Mentor + Career Architect */
        getMyMentorReferrals: builder.query<IMentorReferralsAPIResponse, { page?: number; limit?: number; status?: string } & IDashboardDateRangeParams | void>({
            query: (params) => ({
                url: `/admin/referrals/my`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Referral wallet ledger — Mentor + Career Architect */
        getReferralWalletLedger: builder.query<IReferralWalletLedgerAPIResponse, IGetReferralWalletLedgerParams | void>({
            query: (params) => ({
                url: `/admin/referrals/wallet-ledger`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['ReferralWalletLedger'],
        }),
    }),
});

export const {
    useGetAdminDashboardQuery,
    useGetBlueprintPerformanceQuery,
    useGetSalesVolumeQuery,
    useGetBlueprintRevenueQuery,
    useGetMentorEconomyRevenueQuery,
    useGetMyMentorReferralsQuery,
    useGetReferralWalletLedgerQuery,
} = dashboardApi;
