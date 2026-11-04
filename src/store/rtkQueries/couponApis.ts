import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAllCouponsAPIResponse,
    ICouponPerformanceAPIResponse,
    ICouponRedemptionsAPIResponse,
} from '@/types/coupon';

export const couponApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Coupons */
        addCoupon: builder.mutation({
            query: (payload) => ({
                url: `/admin/coupons`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminCoupons'],
        }),
        getAdminAllCoupons: builder.query<IAllCouponsAPIResponse, { page?: number; limit?: number; search?: string; status?: string; type?: string; isDeleted?: boolean } | void>({
            query: (params) => ({
                url: `/admin/coupons`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminCoupons'],
        }),
        // getCouponById: builder.query<IGetCouponByIdAPIResponse, string>({
        //     query: (id) => ({
        //         url: `/admin/coupons/${id}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['AdminCoupons'],
        // }),
        updateCoupon: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/coupons/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminCoupons'],
        }),
        updateCouponTaalumaStatus: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/coupons/${id}/taaluma-status`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminCoupons'],
        }),
        deleteCoupon: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminCoupons'],
        }),
        restoreCoupon: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/coupons/restore/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminCoupons'],
        }),
        getCouponRedemptions: builder.query<
            ICouponRedemptionsAPIResponse,
            { id: string; page?: number; limit?: number; search?: string; from?: string; to?: string }
        >({
            query: ({ id, ...params }) => ({
                url: `/admin/coupons/${id}/redemptions`,
                method: 'GET',
                params,
            }),
            providesTags: ['AdminCoupons'],
        }),
        getCouponPerformance: builder.query<ICouponPerformanceAPIResponse, { id?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/coupons/performance`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminCoupons'],
        }),
    }),
});

export const {
    useAddCouponMutation,
    useGetAdminAllCouponsQuery,
    useUpdateCouponMutation,
    useUpdateCouponTaalumaStatusMutation,
    useDeleteCouponMutation,
    useRestoreCouponMutation,
    useGetCouponRedemptionsQuery,
    useGetCouponPerformanceQuery,
} = couponApi;
