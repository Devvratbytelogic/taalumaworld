import {
    IAdminDashboardAPIResponse,
    IBlueprintPerformanceAPIResponse,
    IBlueprintRevenueAPIResponse,
    IMentorEconomyRevenueAPIResponse,
    IMentorReferralsAPIResponse,
    ISalesVolumeAPIResponse,
} from '@/types/dashboard';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const dashboardApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Admin overview dashboard stats */
        getAdminDashboard: builder.query<IAdminDashboardAPIResponse, void>({
            query: () => ({
                url: `/admin/dashboard`,
                method: 'GET',
            }),
        }),

        /** Blueprint performance — accessible to Admin and Mentor */
        getBlueprintPerformance: builder.query<IBlueprintPerformanceAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/blueprints/performance`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Blueprint sales volume — accessible to Admin and Mentor */
        getSalesVolume: builder.query<ISalesVolumeAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/blueprints/sales-volume`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Blueprint revenue — accessible to Admin and Mentor */
        getBlueprintRevenue: builder.query<IBlueprintRevenueAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/blueprints/revenue`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Mentor economy revenue — Admin only */
        getMentorEconomyRevenue: builder.query<IMentorEconomyRevenueAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-economy/revenue`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Logged-in mentor's own referrals, filterable by status — Mentor only */
        getMyMentorReferrals: builder.query<IMentorReferralsAPIResponse, { page?: number; limit?: number; status?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-referrals/my`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
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
} = dashboardApi;
