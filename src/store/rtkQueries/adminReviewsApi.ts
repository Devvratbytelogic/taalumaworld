import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAdminReviewsAPIResponse, } from '@/types/adminReviews';


export const adminReviewsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminReviews: builder.query<IAdminReviewsAPIResponse, { page?: number; limit?: number; search?: string; status?: 'Pending' | 'Approved' | 'Rejected'; type?: string } | void>({
      query: (params) => ({
        url: `/admin/reviews`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminReviews'],
    }),
    getAdminReviewById: builder.query<IAdminReviewsAPIResponse, string>({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'AdminReviews', id }],
    }),
    updateAdminReviewStatus: builder.mutation({
      query: ({ id, values }) => ({
        url: `/admin/reviews/${id}/status`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['AdminReviews'],
    }),
  }),
});

export const {
  useGetAllAdminReviewsQuery,
  useGetAdminReviewByIdQuery,
  useLazyGetAdminReviewByIdQuery,
  useUpdateAdminReviewStatusMutation,
} = adminReviewsApi;
