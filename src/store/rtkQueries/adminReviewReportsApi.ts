import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
  IAdminReviewReportAPIResponse,
  IAdminReviewReportsAPIResponse,
} from '@/types/adminReviewReports';

export type AdminReviewReportListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'accepted' | 'ignored' | 'all';
  type?: string;
  itemId?: string;
};

export const adminReviewReportsApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminReviewReports: builder.query<IAdminReviewReportsAPIResponse, AdminReviewReportListParams | void>({
      query: (params) => ({
        url: `/admin/review-reports`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminReviewReports'],
    }),
    getAdminReviewReportById: builder.query<IAdminReviewReportAPIResponse, string>({
      query: (id) => ({
        url: `/admin/review-reports/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'AdminReviewReports', id }],
    }),
    processAdminReviewReport: builder.mutation<
      IAdminReviewReportAPIResponse,
      { id: string; action: 'accept' | 'ignore'; reason?: string }
    >({
      query: ({ id, action, reason }) => ({
        url: `/admin/review-reports/${id}/process`,
        method: 'PUT',
        body: {
          action,
          ...(reason?.trim() ? { reason: reason.trim() } : {}),
        },
      }),
      invalidatesTags: ['AdminReviewReports', 'AdminReviews', 'Reviews'],
    }),
  }),
});

export const {
  useGetAllAdminReviewReportsQuery,
  useGetAdminReviewReportByIdQuery,
  useProcessAdminReviewReportMutation,
} = adminReviewReportsApi;
