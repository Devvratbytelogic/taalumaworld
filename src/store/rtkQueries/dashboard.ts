import { IBlueprintPerformanceAPIResponse, IBlueprintRevenueAPIResponse, ISalesVolumeAPIResponse } from '@/types/dashboard';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const dashboardApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Blueprint performance — accessible to Admin and Mentor */
        getBlueprintPerformance: builder.query<IBlueprintPerformanceAPIResponse, void>({
            query: () => ({
                url: `/admin/blueprints/performance`,
                method: 'GET',
            }),
        }),

        /** Blueprint sales volume — accessible to Admin and Mentor */
        getSalesVolume: builder.query<ISalesVolumeAPIResponse, void>({
            query: () => ({
                url: `/admin/blueprints/sales-volume`,
                method: 'GET',
            }),
        }),

        /** Blueprint revenue — accessible to Admin and Mentor */
        getBlueprintRevenue: builder.query<IBlueprintRevenueAPIResponse, void>({
            query: () => ({
                url: `/admin/blueprints/revenue`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetBlueprintPerformanceQuery,
    useGetSalesVolumeQuery,
    useGetBlueprintRevenueQuery,
} = dashboardApi;
