import { IMyVerifiedMentorApplicationAPIResponse } from '@/types/verifiedMentorApplication';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const verifiedMentorApplicationApis = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    /** Apply for Verified Mentor status — Mentor */
    submitVerifiedMentorApplication: builder.mutation({
      query: (body) => ({
        url: `/admin/verified-mentor-applications`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MyVerifiedMentorApplication'],
    }),

    /** Latest submitted verification application status — Mentor */
    getMyVerifiedMentorApplication: builder.query<IMyVerifiedMentorApplicationAPIResponse, void>({
      query: () => ({
        url: `/admin/verified-mentor-applications/my`,
        method: 'GET',
      }),
      providesTags: ['MyVerifiedMentorApplication'],
    }),

    /** Approve / reject a verification application — Admin */
    reviewVerifiedMentorApplication: builder.mutation({
      query: ({ id, values }) => ({
        url: `/admin/verified-mentor-applications/${id}/review`,
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['AdminVerifiedMentorApplications'],
    }),

    /** All verification applications — Admin */
    getAllVerifiedMentorApplications: builder.query<any, {page?: number; limit?: number; status?: string; search?: string} | void>({
      query: (params) => ({
        url: `/admin/verified-mentor-applications`,
        method: 'GET',
        params: params ? { ...params } : {},
      }),
      providesTags: ['AdminVerifiedMentorApplications'],
    }),
  }),
});

export const {
  useSubmitVerifiedMentorApplicationMutation,
  useGetMyVerifiedMentorApplicationQuery,
  useReviewVerifiedMentorApplicationMutation,
  useGetAllVerifiedMentorApplicationsQuery,
} = verifiedMentorApplicationApis;
