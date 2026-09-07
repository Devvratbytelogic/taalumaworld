import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
  IAdminReviewRejectAPIResponse,
  IAdminReviewReportMutationAPIResponse,
  IAdminReviewsAPIResponse,
} from '@/types/adminReviews';

export type AdminReviewListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  type?: string;
  itemId?: string;
};

export const adminReviewsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminReviews: builder.query<IAdminReviewsAPIResponse, AdminReviewListParams | void>({
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
      invalidatesTags: ['AdminReviews', 'AdminReviewReports'],
    }),
    rejectAdminReview: builder.mutation<IAdminReviewRejectAPIResponse, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/reviews/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['AdminReviews', 'AdminReviewReports', 'Reviews'],
    }),
    reportAdminReview: builder.mutation<IAdminReviewReportMutationAPIResponse, { reviewId: string; reason: string }>({
      query: ({ reviewId, reason }) => ({
        url: `/admin/reviews/${reviewId}/report`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['AdminReviewReports'],
    }),
  }),
});

export const {
  useGetAllAdminReviewsQuery,
  useGetAdminReviewByIdQuery,
  useLazyGetAdminReviewByIdQuery,
  useUpdateAdminReviewStatusMutation,
  useRejectAdminReviewMutation,
  useReportAdminReviewMutation,
} = adminReviewsApi;
